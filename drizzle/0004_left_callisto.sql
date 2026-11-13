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
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
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
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("user_id", "username", "display_name", "password_hash", "created_at") SELECT "user_id", "username", "display_name", "password_hash", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);