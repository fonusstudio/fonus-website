CREATE TABLE `contact_rate_limits` (
	`identifier` text PRIMARY KEY NOT NULL,
	`window_started_at` integer NOT NULL,
	`request_count` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_rate_limits_updated_at_idx` ON `contact_rate_limits` (`updated_at`);