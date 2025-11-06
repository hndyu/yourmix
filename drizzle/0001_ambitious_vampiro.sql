CREATE TABLE `ingredient_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_name` text NOT NULL,
	`sort_order` integer,
	`description` text,
	`icon` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredient_groups_display_name_unique` ON `ingredient_groups` (`display_name`);--> statement-breakpoint
ALTER TABLE `ingredients` ADD `group_id` integer REFERENCES ingredient_groups(id);