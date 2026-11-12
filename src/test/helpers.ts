import { getDb } from "@/app/lib/db";
import { users } from "@/app/lib/schema";

export async function resetDb(): Promise<void> {
  const db = await getDb();
  await db.delete(users);
}
