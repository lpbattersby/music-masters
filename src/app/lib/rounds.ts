import { getDb } from "@/app/lib/db";
import { rounds, type Round } from "@/app/lib/schema";
import { sql } from "drizzle-orm";

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
      roundNumber: sql<number>`(
        SELECT COALESCE(MAX("round_number"), 0) + 1
        FROM "rounds"
        WHERE "group_id" = ${input.groupId}
      )`,
    })
    .returning();

  return round;
}
