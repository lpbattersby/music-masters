import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { users, type User } from "@/lib/schema";

/**
 * Example entity queries (Drizzle ORM).
 *
 * Shows the pattern: typed, composable queries against the `users` table from
 * `@/lib/schema`. Copy this file as a starting point for your own entities.
 */

export async function createUser(input: {
  email: string;
  displayName: string;
}): Promise<User> {
  const db = await getDb();
  const [user] = await db.insert(users).values(input).returning();
  return user;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function listUsers(): Promise<User[]> {
  const db = await getDb();
  return db.select().from(users).orderBy(desc(users.createdAt));
}
