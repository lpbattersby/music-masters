PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_groups` (
	`group_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`submission_window_days` integer NOT NULL,
	`voting_window_days` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`created_by` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "groups_group_id_uuid" CHECK(length("__new_groups"."group_id") = 36
    and substr("__new_groups"."group_id", 9, 1) = '-'
    and substr("__new_groups"."group_id", 14, 1) = '-'
    and substr("__new_groups"."group_id", 19, 1) = '-'
    and substr("__new_groups"."group_id", 24, 1) = '-'
    and substr("__new_groups"."group_id", 15, 1) glob '[1-8]'
    and lower(substr("__new_groups"."group_id", 20, 1)) glob '[89ab]'
    and length(replace("__new_groups"."group_id", '-', '')) = 32
    and lower(replace("__new_groups"."group_id", '-', '')) not glob '*[^0-9a-f]*'),
	CONSTRAINT "groups_created_by_uuid" CHECK(length("__new_groups"."created_by") = 36
    and substr("__new_groups"."created_by", 9, 1) = '-'
    and substr("__new_groups"."created_by", 14, 1) = '-'
    and substr("__new_groups"."created_by", 19, 1) = '-'
    and substr("__new_groups"."created_by", 24, 1) = '-'
    and substr("__new_groups"."created_by", 15, 1) glob '[1-8]'
    and lower(substr("__new_groups"."created_by", 20, 1)) glob '[89ab]'
    and length(replace("__new_groups"."created_by", '-', '')) = 32
    and lower(replace("__new_groups"."created_by", '-', '')) not glob '*[^0-9a-f]*'),
	CONSTRAINT "groups_submission_window_positive" CHECK("__new_groups"."submission_window_days" > 0),
	CONSTRAINT "groups_voting_window_positive" CHECK("__new_groups"."voting_window_days" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_groups`("group_id", "name", "description", "submission_window_days", "voting_window_days", "created_at", "created_by") SELECT "group_id", "name", "description", "submission_window_days", "voting_window_days", "created_at", "created_by" FROM `groups`;--> statement-breakpoint
DROP TABLE `groups`;--> statement-breakpoint
ALTER TABLE `__new_groups` RENAME TO `groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `groups_name_unique` ON `groups` (`name`);--> statement-breakpoint
CREATE TABLE `__new_memberships` (
	`group_id` text NOT NULL,
	`user_id` text NOT NULL,
	`joined_at` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "memberships_group_id_uuid" CHECK(length("__new_memberships"."group_id") = 36
    and substr("__new_memberships"."group_id", 9, 1) = '-'
    and substr("__new_memberships"."group_id", 14, 1) = '-'
    and substr("__new_memberships"."group_id", 19, 1) = '-'
    and substr("__new_memberships"."group_id", 24, 1) = '-'
    and substr("__new_memberships"."group_id", 15, 1) glob '[1-8]'
    and lower(substr("__new_memberships"."group_id", 20, 1)) glob '[89ab]'
    and length(replace("__new_memberships"."group_id", '-', '')) = 32
    and lower(replace("__new_memberships"."group_id", '-', '')) not glob '*[^0-9a-f]*'),
	CONSTRAINT "memberships_user_id_uuid" CHECK(length("__new_memberships"."user_id") = 36
    and substr("__new_memberships"."user_id", 9, 1) = '-'
    and substr("__new_memberships"."user_id", 14, 1) = '-'
    and substr("__new_memberships"."user_id", 19, 1) = '-'
    and substr("__new_memberships"."user_id", 24, 1) = '-'
    and substr("__new_memberships"."user_id", 15, 1) glob '[1-8]'
    and lower(substr("__new_memberships"."user_id", 20, 1)) glob '[89ab]'
    and length(replace("__new_memberships"."user_id", '-', '')) = 32
    and lower(replace("__new_memberships"."user_id", '-', '')) not glob '*[^0-9a-f]*')
);
--> statement-breakpoint
INSERT INTO `__new_memberships`("group_id", "user_id", "joined_at") SELECT "group_id", "user_id", "joined_at" FROM `memberships`;--> statement-breakpoint
DROP TABLE `memberships`;--> statement-breakpoint
ALTER TABLE `__new_memberships` RENAME TO `memberships`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`display_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	CONSTRAINT "users_user_id_uuid" CHECK(length("__new_users"."user_id") = 36
    and substr("__new_users"."user_id", 9, 1) = '-'
    and substr("__new_users"."user_id", 14, 1) = '-'
    and substr("__new_users"."user_id", 19, 1) = '-'
    and substr("__new_users"."user_id", 24, 1) = '-'
    and substr("__new_users"."user_id", 15, 1) glob '[1-8]'
    and lower(substr("__new_users"."user_id", 20, 1)) glob '[89ab]'
    and length(replace("__new_users"."user_id", '-', '')) = 32
    and lower(replace("__new_users"."user_id", '-', '')) not glob '*[^0-9a-f]*')
);
--> statement-breakpoint
INSERT INTO `__new_users`("user_id", "username", "display_name", "password_hash", "created_at") SELECT "user_id", "username", "display_name", "password_hash", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);