import { relations } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

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
	// 'category' を 'categoryId' に変更し、categories.id を参照する
	categoryId: integer("category_id")
		.notNull()
		.references(() => categories.id),
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
	(table) => ({
		pk: primaryKey({ columns: [table.cocktailId, table.ingredientId] }),
	}),
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
	(table) => ({
		pk: primaryKey({ columns: [table.cocktailId, table.tagId] }),
	}),
);

// Relations
export const cocktailsRelations = relations(cocktails, ({ many }) => ({
	cocktailIngredients: many(cocktailIngredients),
	instructions: many(instructions),
	cocktailTags: many(cocktailTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	ingredients: many(ingredients),
}));

export const ingredientGroupsRelations = relations(
	ingredientGroups,
	({ many }) => ({
		ingredients: many(ingredients),
	}),
);

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
	category: one(categories, {
		fields: [ingredients.categoryId],
		references: [categories.id],
	}),
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

// Better Auth Schema
export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }),
	updatedAt: integer("updatedAt", { mode: "timestamp" }),
});
