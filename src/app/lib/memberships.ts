import { and, eq } from "drizzle-orm";
import { getDb } from "@/app/lib/db";
import { memberships, type Membership } from "@/app/lib/schema";

export async function createMembership(input: {
  groupId: number;
  userId: number;
}): Promise<Membership> {
  const db = await getDb();
  const [membership] = await db.insert(memberships).values(input).returning();
  return membership;
}

export async function getMembershipsByGroupId(groupId: number): Promise<Membership[]> {
  const db = await getDb();
  return db.query.memberships.findMany({ where: eq(memberships.groupId, groupId) });
}

export async function getMembershipsByUserId(userId: number): Promise<Membership[]> {
  const db = await getDb();
  return db.query.memberships.findMany({ where: eq(memberships.userId, userId) });
}
