import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: integer("user_id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const groups = sqliteTable("groups", {
  groupId: integer("group_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  submissionWindowDays: integer("submission_window_days").notNull(),
  votingWindowDays: integer("voting_window_days").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  createdBy: integer("created_by").notNull().references(() => users.userId),
});

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

export type Group = typeof groups.$inferSelect;

export type NewGroup = typeof groups.$inferInsert;
