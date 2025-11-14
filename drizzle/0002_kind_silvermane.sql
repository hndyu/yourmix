
-- Custom migration to add NOT NULL constraint to sort_order in ingredient_groups
-- Create a new table with the NOT NULL constraint
CREATE TABLE `new_ingredient_groups` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `display_name` text NOT NULL,
    `sort_order` integer NOT NULL,
    `description` text,
    `icon` text
);
--> statement-breakpoint
-- Copy data from the old table to the new table, providing a default value for sort_order
INSERT INTO `new_ingredient_groups` (`id`, `display_name`, `sort_order`, `description`, `icon`)
SELECT `id`, `display_name`, COALESCE(`sort_order`, 0), `description`, `icon` FROM `ingredient_groups`;
--> statement-breakpoint
-- Drop the old table
DROP TABLE `ingredient_groups`;
--> statement-breakpoint
-- Rename the new table
ALTER TABLE `new_ingredient_groups` RENAME TO `ingredient_groups`;
--> statement-breakpoint
-- Recreate the unique index
CREATE UNIQUE INDEX `ingredient_groups_display_name_unique` ON `ingredient_groups` (`display_name`);
