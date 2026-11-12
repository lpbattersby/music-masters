CREATE TABLE `groups` (
	`group_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`submission_window_days` integer NOT NULL,
	`voting_window_days` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`created_by` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `groups_name_unique` ON `groups` (`name`);--> statement-breakpoint
CREATE TABLE `memberships` (
	`group_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`joined_at` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
