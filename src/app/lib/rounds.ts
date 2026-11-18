import { getDb } from "@/app/lib/db";
import { rounds, type Round } from "@/app/lib/schema";
import { and, desc, eq, getTableColumns, inArray, max, sql } from "drizzle-orm";

export async function createRound(input: {
  name: string;
  groupId: string;
  description: string;
  submissionDeadline: string;
  votingDeadline: string;
}): Promise<Round> {
  const db = await getDb();

  const [round] = await db
    .insert(rounds)
    .values({
      ...input,
      roundNumber: sql<number>`(SELECT COALESCE(MAX("round_number"), 0) + 1
                                      FROM "rounds"
                                      WHERE "group_id" = ${input.groupId})`,
    })
    .returning();

  return round;
}

export async function getRoundsByGroupId(groupId: string): Promise<Round[]> {
  const db = await getDb();

  return db
    .select()
    .from(rounds)
    .where(eq(rounds.groupId, groupId))
    .orderBy(desc(rounds.roundNumber));
}

export async function getLatestRoundsByGroupIds(
  groupIds: string[],
): Promise<Round[]> {
  if (groupIds.length === 0) {
    return [];
  }

  const db = await getDb();
  const latestRoundNumbers = db
    .select({
      groupId: rounds.groupId,
      latestRoundNumber: max(rounds.roundNumber).as("latest_round_number"),
    })
    .from(rounds)
    .where(inArray(rounds.groupId, groupIds))
    .groupBy(rounds.groupId)
    .as("latest_round_numbers");

  return db
    .select(getTableColumns(rounds))
    .from(rounds)
    .innerJoin(
      latestRoundNumbers,
      and(
        eq(rounds.groupId, latestRoundNumbers.groupId),
        eq(rounds.roundNumber, latestRoundNumbers.latestRoundNumber),
      ),
    );
}
