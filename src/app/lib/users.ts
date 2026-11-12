import { desc, eq } from "drizzle-orm";

import { getDb } from "@/app/lib/db";
import { users, type User } from "@/app/lib/schema";

export async function createUser(input: {
  username: string;
  displayName: string;
  passwordHash: string;
}): Promise<User> {
  const db = await getDb();
  const [user] = await db.insert(users).values(input).returning();
  return user;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  return db.query.users.findFirst({ where: eq(users.userId, id) });
}

export async function listUsers(): Promise<User[]> {
  const db = await getDb();
  return db.select().from(users).orderBy(desc(users.createdAt));
}
