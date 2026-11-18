import { eq, getTableColumns } from "drizzle-orm";
import bcrypt from 'bcrypt'
import { getDb } from "@/app/lib/db";
import { memberships, users, type User } from "@/app/lib/schema";

export async function createUser(input: {
  username: string;
  displayName: string;
  password: string;
}): Promise<User> {
  const db = await getDb();
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const [user] = await db.insert(users).values(
    {
      username: input.username,
      displayName: input.displayName, 
      passwordHash: hashedPassword
    }).returning();
  return user;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const db = await getDb();
  return db.query.users.findFirst({ where: eq(users.username, username) });
}

export async function getMembersByGroupId(groupId: string): Promise<User[]> {
  const db = await getDb();
  const members = await db
    .select(getTableColumns(users))
    .from(users)
    .innerJoin(memberships, eq(users.userId, memberships.userId))
    .where(eq(memberships.groupId, groupId));
  return members;
}
