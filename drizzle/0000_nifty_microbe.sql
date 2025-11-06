CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer NOT NULL,
	`icon` text,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `cocktail_ingredients` (
	`cocktail_id` text NOT NULL,
	`ingredient_id` integer NOT NULL,
	`amount` text NOT NULL,
	`option_group` integer,
	PRIMARY KEY(`cocktail_id`, `ingredient_id`),
	FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cocktail_tags` (
	`cocktail_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`cocktail_id`, `tag_id`),
	FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cocktails` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`garnish` text,
	`image_url` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cocktails_slug_unique` ON `cocktails` (`slug`);--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_name_unique` ON `ingredients` (`name`);--> statement-breakpoint
CREATE TABLE `instructions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cocktail_id` text NOT NULL,
	`step` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);