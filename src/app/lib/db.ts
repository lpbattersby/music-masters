import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import * as schema from "@/app/lib/schema";

const DATABASE_URL = process.env.DATABASE_URL ?? "file:./data/app.db";

type DB = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __db__?: DB;
  __dbReady__?: Promise<unknown>;
};

function ensureParentDir(url: string): void {
  if (url.startsWith("file:")) {
    mkdirSync(dirname(url.slice("file:".length)), { recursive: true });
  }
}

function init(): void {
  ensureParentDir(DATABASE_URL);
  const client = createClient({ url: DATABASE_URL });
  const db = drizzle(client, { schema });
  globalForDb.__db__ = db;
  globalForDb.__dbReady__ = migrate(db, { migrationsFolder: "./drizzle" });
}

export async function getDb(): Promise<DB> {
  if (!globalForDb.__db__) {
    init();
  }
  await globalForDb.__dbReady__;
  return globalForDb.__db__!;
}
