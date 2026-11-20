import { test as base, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createUser } from "@/app/lib/users";
import { createGroup } from "@/app/lib/groups";
import { createRound } from "@/app/lib/rounds";

export const testUser = {
  username: "existing-user",
  displayName: "Test User",
  password: "TestPassword1!",
};

export const testGroup = {
  name: "test-group",
  description: "Test Group",
  submissionWindowDays: 2,
  votingWindowDays: 2,
};

export const test = base.extend<{ resetDatabase: void }>({
  resetDatabase: [
    async ({ baseURL }, use) => {
      if (baseURL !== "http://localhost:3001") {
        throw new Error("Database reset requires the dedicated E2E server");
      }

      await mkdir("./data", { recursive: true });
      const client = createClient({ url: "file:./data/e2e.db" });

      try {
        await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
        await client.batch(
          [
            "DELETE FROM song_submissions",
            "DELETE FROM rounds",
            "DELETE FROM memberships",
            "DELETE FROM groups",
            "DELETE FROM users",
          ],
          "write",
        );
      } finally {
        client.close();
      }

      await use();
    },
    { auto: true },
  ],
});

export const createTestUsers = (count: number) =>
  Promise.all(
    Array.from({ length: count }, () =>
      createUser({
        ...testUser,
        username: `${testUser.username}-${randomUUID()}`,
      }),
    ),
  );

export const createTestGroups = (count: number, createdBy?: string) =>
  Promise.all(
    Array.from({ length: count }, async () => {
      const creatorId = createdBy ?? (await createUser(testUser)).userId;
      return createGroup({
        ...testGroup,
        name: `${testGroup.name}-${randomUUID()}`,
        createdBy: creatorId,
      });
    }),
  );

export const createTestRounds = (count: number, groupId: string) =>
  Promise.all(
    Array.from({ length: count }, async () => {
      const today = new Date().toISOString().slice(0, 10);
      const dayFromToday = (days: number) => {
        const date = new Date(`${today}T00:00:00.000Z`);
        date.setUTCDate(date.getUTCDate() + days);
        return date.toISOString().slice(0, 10);
      };
      return createRound({
        name: `Round ${randomUUID().slice(0, 8)}`,
        groupId,
        description: "Test round",
        submissionDeadline: dayFromToday(3),
        votingDeadline: dayFromToday(7),
      });
    }),
  );

export { expect };
