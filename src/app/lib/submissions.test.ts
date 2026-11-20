import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";
import {
  getSongSubmissionByRoundAndUser,
  upsertSongSubmission,
} from "./submissions";

vi.mock("./db", () => ({ getDb: vi.fn() }));
import { getDb } from "./db";

const client = createClient({ url: ":memory:" });
const db = drizzle(client, { schema });
const roundId = "a825e838-94ab-4b52-bf4a-abdd267d405b";

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  vi.mocked(getDb).mockResolvedValue(db);
  await db.insert(schema.users).values({
    userId: "owner",
    username: "alice",
    displayName: "Alice",
    passwordHash: "hash",
  });
  await db.insert(schema.groups).values({
    groupId: "group-1",
    name: "Music",
    description: "Our music",
    createdBy: "owner",
    submissionWindowDays: 2,
    votingWindowDays: 3,
  });
  await db.insert(schema.rounds).values([
    {
      roundId,
      groupId: "group-1",
      name: "Round one",
      description: "Favourite tracks",
      roundNumber: 1,
      submissionDeadline: "2099-01-01",
      votingDeadline: "2099-01-03",
    },
    {
      roundId: "round-2",
      groupId: "group-1",
      name: "Round two",
      description: "More tracks",
      roundNumber: 2,
      submissionDeadline: "2099-02-01",
      votingDeadline: "2099-02-03",
    },
  ]);
});

afterAll(() => client.close());

it("replaces a user's song for the same round without creating another row", async () => {
  const first = await upsertSongSubmission({
    roundId,
    userId: "owner",
    songUrl: "https://soundcloud.com/artist/first",
  });
  const replacement = await upsertSongSubmission({
    roundId,
    userId: "owner",
    songUrl: "https://soundcloud.com/artist/replacement",
  });

  expect(replacement.submissionId).toBe(first.submissionId);
  expect(await getSongSubmissionByRoundAndUser(roundId, "owner")).toMatchObject(
    {
      submissionId: first.submissionId,
      songUrl: "https://soundcloud.com/artist/replacement",
    },
  );
});

it("allows a user to submit once in each round", async () => {
  const otherRound = await upsertSongSubmission({
    roundId: "round-2",
    userId: "owner",
    songUrl: "https://soundcloud.com/artist/second-round",
  });

  expect(otherRound.roundId).toBe("round-2");
  expect(await getSongSubmissionByRoundAndUser("round-2", "owner")).toEqual(
    otherRound,
  );
  await expect(
    getSongSubmissionByRoundAndUser(roundId, "another-user"),
  ).resolves.toBeUndefined();
});
