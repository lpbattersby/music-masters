PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rounds` (
	`round_id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`round_number` integer NOT NULL,
	`submission_deadline` text NOT NULL,
	`voting_deadline` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "rounds_voting_deadline_after_submission" CHECK("__new_rounds"."voting_deadline" > "__new_rounds"."submission_deadline")
);
--> statement-breakpoint
INSERT INTO `__new_rounds`("round_id", "group_id", "name", "description", "round_number", "submission_deadline", "voting_deadline", "created_at") SELECT "round_id", "group_id", "name", "description", "round_number", "submission_deadline", "voting_deadline", "created_at" FROM `rounds`;--> statement-breakpoint
DROP TABLE `rounds`;--> statement-breakpoint
ALTER TABLE `__new_rounds` RENAME TO `rounds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `rounds_group_round_number_unique` ON `rounds` (`group_id`,`round_number`);