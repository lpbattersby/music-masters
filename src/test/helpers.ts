import { getDb } from "@/lib/db";
import { users } from "@/lib/schema";

export async function resetDb(): Promise<void> {
  const db = await getDb();
  await db.delete(users);
}
