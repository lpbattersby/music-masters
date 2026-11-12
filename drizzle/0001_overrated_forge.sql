ALTER TABLE `users` RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN "email" TO "username";--> statement-breakpoint
DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `password_hash` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);