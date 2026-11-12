import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Database schema (Drizzle ORM).
 *
 * This is the single source of truth for the database structure — the
 * TypeScript equivalent of a SQLAlchemy/SQLModel model. `drizzle-kit generate`
 * reads this file to produce SQL migrations in `./drizzle`, and query results
 * are fully typed from these definitions.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

/** Row returned from SELECT queries. */
export type User = typeof users.$inferSelect;

/** Shape accepted by INSERT queries. */
export type NewUser = typeof users.$inferInsert;
