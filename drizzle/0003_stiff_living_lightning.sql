PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_groups` (
	`group_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`submission_window_days` integer NOT NULL,
	`voting_window_days` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`created_by` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "groups_submission_window_positive" CHECK("__new_groups"."submission_window_days" > 0),
	CONSTRAINT "groups_voting_window_positive" CHECK("__new_groups"."voting_window_days" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_groups`("group_id", "name", "description", "submission_window_days", "voting_window_days", "created_at", "created_by") SELECT "group_id", "name", "description", "submission_window_days", "voting_window_days", "created_at", "created_by" FROM `groups`;--> statement-breakpoint
DROP TABLE `groups`;--> statement-breakpoint
ALTER TABLE `__new_groups` RENAME TO `groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `groups_name_unique` ON `groups` (`name`);