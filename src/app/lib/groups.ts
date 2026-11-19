import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { getDb } from "@/app/lib/db";
import { groups, memberships, type Group } from "@/app/lib/schema";
import { v4 as uuidv4 } from "uuid";

export async function createGroup(input: {
  name: string;
  description: string;
  submissionWindowDays: number;
  votingWindowDays: number;
  createdBy: string;
}): Promise<Group> {
  const db = await getDb();
  const groupInput = { ...input, groupId: uuidv4() };
  const [group] = await db.insert(groups).values(groupInput).returning();
  return group;
}

export async function getGroupById(id: string): Promise<Group | undefined> {
  const db = await getDb();
  return db.query.groups.findFirst({ where: eq(groups.groupId, id) });
}

export async function getGroupsByUserId(userId: string): Promise<Group[]> {
  const db = await getDb();

  return db
    .select(getTableColumns(groups))
    .from(groups)
    .innerJoin(memberships, eq(groups.groupId, memberships.groupId))
    .where(eq(memberships.userId, userId))
    .orderBy(desc(groups.createdAt));
}

export async function isUserMemberOfGroup(
  groupId: string,
  userId: string,
): Promise<boolean> {
  const db = await getDb();
  const [membership] = await db
    .select({ userId: memberships.userId })
    .from(memberships)
    .where(
      and(eq(memberships.groupId, groupId), eq(memberships.userId, userId)),
    )
    .limit(1);

  return Boolean(membership);
}
