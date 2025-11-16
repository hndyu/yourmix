ALTER TABLE `ingredients` ADD `category_id` integer REFERENCES categories(id);--> statement-breakpoint
ALTER TABLE `ingredients` DROP COLUMN `category`;