PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`group_id` integer NOT NULL,
	`description` text,
	`category_id` integer NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `ingredient_groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ingredients`("id", "name", "group_id", "description", "category_id") SELECT "id", "name", "group_id", "description", "category_id" FROM `ingredients`;--> statement-breakpoint
DROP TABLE `ingredients`;--> statement-breakpoint
ALTER TABLE `__new_ingredients` RENAME TO `ingredients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_name_unique` ON `ingredients` (`name`);