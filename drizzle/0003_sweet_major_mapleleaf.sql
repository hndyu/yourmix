PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`group_id` integer NOT NULL,
	`description` text,
	`category` text,
	FOREIGN KEY (`group_id`) REFERENCES `ingredient_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_ingredients`("id", "name", "group_id", "description", "category") SELECT "id", "name", "group_id", "description", "category" FROM `ingredients`;--> statement-breakpoint
DROP TABLE `ingredients`;--> statement-breakpoint
ALTER TABLE `__new_ingredients` RENAME TO `ingredients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_name_unique` ON `ingredients` (`name`);--> statement-breakpoint
CREATE TABLE `__new_ingredient_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_name` text NOT NULL,
	`sort_order` integer NOT NULL,
	`description` text,
	`icon` text
);
--> statement-breakpoint
INSERT INTO `__new_ingredient_groups`("id", "display_name", "sort_order", "description", "icon") SELECT "id", "display_name", "sort_order", "description", "icon" FROM `ingredient_groups`;--> statement-breakpoint
DROP TABLE `ingredient_groups`;--> statement-breakpoint
ALTER TABLE `__new_ingredient_groups` RENAME TO `ingredient_groups`;--> statement-breakpoint
CREATE UNIQUE INDEX `ingredient_groups_display_name_unique` ON `ingredient_groups` (`display_name`);