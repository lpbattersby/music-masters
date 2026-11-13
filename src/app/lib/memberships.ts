import { eq } from "drizzle-orm";
import { getDb } from "@/app/lib/db";
import { memberships, type Membership } from "@/app/lib/schema";

export async function createMembership(input: {
  groupId: string;
  userId: string;
}): Promise<Membership> {
  const db = await getDb();
  const [membership] = await db.insert(memberships).values(input).returning();
  return membership;
}

export async function getMembershipsByGroupId(groupId: string): Promise<Membership[]> {
  const db = await getDb();
  return db.query.memberships.findMany({ where: eq(memberships.groupId, groupId) });
}

export async function getMembershipsByUserId(userId: string): Promise<Membership[]> {
  const db = await getDb();
  return db.query.memberships.findMany({ where: eq(memberships.userId, userId) });
}
