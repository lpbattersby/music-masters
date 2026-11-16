import { desc, eq, and } from "drizzle-orm";
import { getDb } from "@/app/lib/db";
import { groups, type Group } from "@/app/lib/schema";
import { memberships } from "@/app/lib/schema";
import { getTableColumns } from "drizzle-orm";

export async function createRound(input: {
  name: string;
  groupId: string;
  description: string;
  submissionWindowDays: number;
  votingWindowDays: number;
  createdBy: string;
}): Promise<Group> {
  const db = await getDb();
  const [group] = await db.insert(groups).values(input).returning();
  return group;
}
