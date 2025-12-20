import { relations, sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";
import * as authSchema from "./auth.schema";

// cocktails テーブル
export const cocktails = sqliteTable("cocktails", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	garnish: text("garnish"),
	imageUrl: text("image_url"),
	createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
	updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// ingredients テーブル
export const ingredients = sqliteTable("ingredients", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique(),
	groupId: integer("group_id")
		.notNull()
		.references(() => ingredientGroups.id, { onDelete: "cascade" }),
	description: text("description"),
	sortOrder: integer("sort_order").notNull().default(0),
});

// cocktail_ingredients 中間テーブル
export const cocktailIngredients = sqliteTable(
	"cocktail_ingredients",
	{
		cocktailId: text("cocktail_id")
			.notNull()
			.references(() => cocktails.id, { onDelete: "cascade" }),
		ingredientId: integer("ingredient_id")
			.notNull()
			.references(() => ingredients.id, { onDelete: "cascade" }),
		amount: text("amount").notNull(),
		option_group: integer("option_group"),
	},
	(table) => [primaryKey({ columns: [table.cocktailId, table.ingredientId] })],
);

// instructions テーブル
export const instructions = sqliteTable("instructions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	cocktailId: text("cocktail_id")
		.notNull()
		.references(() => cocktails.id, { onDelete: "cascade" }),
	step: integer("step").notNull(),
	text: text("text").notNull(),
});

// categories テーブル（材料カテゴリの並び順を管理）
export const categories = sqliteTable("categories", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique(),
	sortOrder: integer("sort_order").notNull(),
	icon: text("icon"),
	description: text("description"),
});

// ingredient_groups テーブル（材料の表示グループを管理）
export const ingredientGroups = sqliteTable("ingredient_groups", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	displayName: text("display_name").notNull().unique(),
	categoryId: integer("category_id")
		.notNull()
		.references(() => categories.id),
	sortOrder: integer("sort_order").notNull(),
	description: text("description"),
	icon: text("icon"), // 将来的にグループ用アイコンを設定可能
});

// tags テーブル
export const tags = sqliteTable("tags", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique(),
	description: text("description"),
});

// cocktail_tags 中間テーブル
export const cocktailTags = sqliteTable(
	"cocktail_tags",
	{
		cocktailId: text("cocktail_id")
			.notNull()
			.references(() => cocktails.id, { onDelete: "cascade" }),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tags.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.cocktailId, table.tagId] })],
);

export const deliciousLikes = sqliteTable(
	"delicious_likes",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id")
			.notNull()
			.references(() => authSchema.users.id, { onDelete: "cascade" }),
		cocktailId: text("cocktail_id")
			.notNull()
			.references(() => cocktails.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [unique().on(table.userId, table.cocktailId)],
);

// Relations
export const cocktailsRelations = relations(cocktails, ({ many }) => ({
	cocktailIngredients: many(cocktailIngredients),
	instructions: many(instructions),
	cocktailTags: many(cocktailTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	ingredientGroups: many(ingredientGroups),
}));

export const ingredientGroupsRelations = relations(
	ingredientGroups,
	({ one, many }) => ({
		category: one(categories, {
			fields: [ingredientGroups.categoryId],
			references: [categories.id],
		}),
		ingredients: many(ingredients),
	}),
);

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
	group: one(ingredientGroups, {
		fields: [ingredients.groupId],
		references: [ingredientGroups.id],
	}),
	cocktailIngredients: many(cocktailIngredients),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	cocktailTags: many(cocktailTags),
}));

export const cocktailIngredientsRelations = relations(
	cocktailIngredients,
	({ one }) => ({
		cocktail: one(cocktails, {
			fields: [cocktailIngredients.cocktailId],
			references: [cocktails.id],
		}),
		ingredient: one(ingredients, {
			fields: [cocktailIngredients.ingredientId],
			references: [ingredients.id],
		}),
	}),
);

export const instructionsRelations = relations(instructions, ({ one }) => ({
	cocktail: one(cocktails, {
		fields: [instructions.cocktailId],
		references: [cocktails.id],
	}),
}));

export const cocktailTagsRelations = relations(cocktailTags, ({ one }) => ({
	cocktail: one(cocktails, {
		fields: [cocktailTags.cocktailId],
		references: [cocktails.id],
	}),
	tag: one(tags, {
		fields: [cocktailTags.tagId],
		references: [tags.id],
	}),
}));

export const deliciousLikesRelations = relations(deliciousLikes, ({ one }) => ({
	user: one(authSchema.users, {
		fields: [deliciousLikes.userId],
		references: [authSchema.users.id],
	}),
	cocktail: one(cocktails, {
		fields: [deliciousLikes.cocktailId],
		references: [cocktails.id],
	}),
}));

export const schema = {
	...authSchema,
	cocktails,
	ingredients,
	cocktailIngredients,
	instructions,
	categories,
	ingredientGroups,
	tags,
	cocktailTags,
	deliciousLikes,
	cocktailsRelations,
	categoriesRelations,
	ingredientGroupsRelations,
	ingredientsRelations,
	tagsRelations,
	cocktailIngredientsRelations,
	instructionsRelations,
	cocktailTagsRelations,
	deliciousLikesRelations,
};
