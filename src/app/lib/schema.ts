import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, primaryKey, check, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

function isUuid(column: AnySQLiteColumn) {
  return sql`length(${column}) = 36
    and substr(${column}, 9, 1) = '-'
    and substr(${column}, 14, 1) = '-'
    and substr(${column}, 19, 1) = '-'
    and substr(${column}, 24, 1) = '-'
    and substr(${column}, 15, 1) glob '[1-8]'
    and lower(substr(${column}, 20, 1)) glob '[89ab]'
    and length(replace(${column}, '-', '')) = 32
    and lower(replace(${column}, '-', '')) not glob '*[^0-9a-f]*'`;
}

export const users = sqliteTable("users", {
  userId: text('user_id')
    .primaryKey()
    .$default(() => uuidv4()),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (table) => [
  check('users_user_id_uuid', isUuid(table.userId)),
]);

export const groups = sqliteTable("groups", {
  groupId: text('group_id')
    .primaryKey()
    .$default(() => uuidv4()),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  submissionWindowDays: integer("submission_window_days").notNull(),
  votingWindowDays: integer("voting_window_days").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  createdBy: text("created_by").notNull().references(() => users.userId),
}, (table) => [
  check('groups_group_id_uuid', isUuid(table.groupId)),
  check('groups_created_by_uuid', isUuid(table.createdBy)),
  check(
    'groups_submission_window_positive',
    sql`${table.submissionWindowDays} > 0`,
  ),
  check(
    'groups_voting_window_positive',
    sql`${table.votingWindowDays} > 0`,
  ),
]);

export const memberships = sqliteTable('memberships', {
  groupId: text('group_id').notNull().references(() => groups.groupId),
  userId: text('user_id').notNull().references(() => users.userId),
  joinedAt: text('joined_at')
    .notNull()
    .default(sql`(datetime('now'))`),
}, (table) => [
  primaryKey({ columns: [table.groupId, table.userId] }),
  check('memberships_group_id_uuid', isUuid(table.groupId)),
  check('memberships_user_id_uuid', isUuid(table.userId)),
])


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
