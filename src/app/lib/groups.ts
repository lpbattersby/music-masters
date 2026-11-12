import { desc, eq } from "drizzle-orm";
import { getDb } from "@/app/lib/db";
import { groups, type Group } from "@/app/lib/schema";

export async function createGroup(input: {
  name: string;
  description: string;
  submissionWindowDays: number;
  votingWindowDays: number;
  createdBy: number;
}): Promise<Group> {
  const db = await getDb();
  const [group] = await db.insert(groups).values(input).returning();
  return group;
}

export async function getGroupById(id: number): Promise<Group | undefined> {
  const db = await getDb();
  return db.query.groups.findFirst({ where: eq(groups.groupId, id) });
}

export async function getGroupByName(name: string): Promise<Group | undefined> {
  const db = await getDb();
  return db.query.groups.findFirst({ where: eq(groups.name, name) });
}

export async function listGroups(): Promise<Group[]> {
  const db = await getDb();
  return db.select().from(groups).orderBy(desc(groups.createdAt));
}
