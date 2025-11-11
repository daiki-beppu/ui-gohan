CREATE TABLE `menus` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT '' NOT NULL,
	`day_of_week` integer NOT NULL,
	`meal_type` text NOT NULL,
	`dish_name` text NOT NULL,
	`memo` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
