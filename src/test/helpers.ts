import { getDb } from "@/app/lib/db";
import { users, groups, memberships } from "@/app/lib/schema";

export async function resetDb(): Promise<void> {
  const db = await getDb();

  await db.transaction(async (tx) => {
    await tx.delete(memberships)
    await tx.delete(groups)
    await tx.delete(users)
  })
}
