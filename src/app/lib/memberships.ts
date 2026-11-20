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
