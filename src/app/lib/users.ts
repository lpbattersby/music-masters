import { desc, eq } from "drizzle-orm";
import bcrypt from 'bcrypt'
import { getDb } from "@/app/lib/db";
import { users, type User } from "@/app/lib/schema";

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

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  return db.query.users.findFirst({ where: eq(users.userId, id) });
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const db = await getDb();
  return db.query.users.findFirst({ where: eq(users.username, username) });
}

export async function listUsers(): Promise<User[]> {
  const db = await getDb();
  return db.select().from(users).orderBy(desc(users.createdAt));
}
