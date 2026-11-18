import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";
import { createRound, getLatestRoundsByGroupIds } from "./rounds";

vi.mock("./db", () => ({ getDb: vi.fn() }));
import { getDb } from "./db";

const client = createClient({ url: ":memory:" });
const db = drizzle(client, { schema });

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  vi.mocked(getDb).mockResolvedValue(db);
  await db.insert(schema.users).values({
    userId: "owner",
    username: "alice",
    displayName: "Alice",
    passwordHash: "hash",
  });
  await db.insert(schema.groups).values(
    ["group-a", "group-b"].map((groupId) => ({
      groupId,
      name: groupId,
      description: "Music",
      createdBy: "owner",
      submissionWindowDays: 2,
      votingWindowDays: 3,
    })),
  );
});

afterAll(() => client.close());

it("returns the group ID and generates consecutive numbers independently per group", async () => {
  const input = {
    name: "Round",
    description: "Favourite tracks",
    submissionDeadline: "2099-01-01",
    votingDeadline: "2099-01-03",
  };
  const first = await createRound({ ...input, groupId: "group-a" });
  const second = await createRound({ ...input, groupId: "group-a" });
  const other = await createRound({ ...input, groupId: "group-b" });

  expect(first).toMatchObject({ groupId: "group-a", roundNumber: 1 });
  expect(second).toMatchObject({ groupId: "group-a", roundNumber: 2 });
  expect(other).toMatchObject({ groupId: "group-b", roundNumber: 1 });
  expect(first.roundId).toBeTruthy();
});

it("returns only the latest round for each requested group", async () => {
  const groupIds = ["latest-a", "latest-b"];
  await db.insert(schema.groups).values(
    groupIds.map((groupId) => ({
      groupId,
      name: groupId,
      description: "Music",
      createdBy: "owner",
      submissionWindowDays: 2,
      votingWindowDays: 3,
    })),
  );

  const input = {
    description: "Favourite tracks",
    submissionDeadline: "2099-01-01",
    votingDeadline: "2099-01-03",
  };
  await createRound({ ...input, groupId: "latest-a", name: "Earlier round" });
  await createRound({ ...input, groupId: "latest-a", name: "Latest round" });
  await createRound({ ...input, groupId: "latest-b", name: "Only round" });

  const latestRounds = await getLatestRoundsByGroupIds([
    ...groupIds,
    "no-rounds",
  ]);

  expect(latestRounds).toHaveLength(2);
  expect(latestRounds).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        groupId: "latest-a",
        name: "Latest round",
        roundNumber: 2,
      }),
      expect.objectContaining({
        groupId: "latest-b",
        name: "Only round",
        roundNumber: 1,
      }),
    ]),
  );
  await expect(getLatestRoundsByGroupIds([])).resolves.toEqual([]);
});
