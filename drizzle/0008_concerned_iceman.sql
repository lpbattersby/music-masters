CREATE TABLE `song_submissions` (
	`submission_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`round_id` text NOT NULL,
	`song_url` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`round_id`) REFERENCES `rounds`(`round_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `song_submissions_user_round_unique` ON `song_submissions` (`user_id`,`round_id`);