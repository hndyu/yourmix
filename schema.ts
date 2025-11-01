
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// cocktails テーブル
export const cocktails = sqliteTable('cocktails', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  garnish: text('garnish'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// ingredients テーブル
export const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  description: text('description'),
});

// cocktail_ingredients 中間テーブル
export const cocktailIngredients = sqliteTable('cocktail_ingredients', {
  cocktailId: text('cocktail_id').notNull().references(() => cocktails.id, { onDelete: 'cascade' }),
  ingredientId: integer('ingredient_id').notNull().references(() => ingredients.id, { onDelete: 'cascade' }),
  amount: text('amount').notNull(),
  optionGroup: integer('option_group'),
}, (table) => ({
  pk: primaryKey({ columns: [table.cocktailId, table.ingredientId] }),
}));

// instructions テーブル
export const instructions = sqliteTable('instructions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cocktailId: text('cocktail_id').notNull().references(() => cocktails.id, { onDelete: 'cascade' }),
  step: integer('step').notNull(),
  text: text('text').notNull(),
});

// tags テーブル
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  description: text('description'),
});

// cocktail_tags 中間テーブル
export const cocktailTags = sqliteTable('cocktail_tags', {
  cocktailId: text('cocktail_id').notNull().references(() => cocktails.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.cocktailId, table.tagId] }),
}));

// Relations
export const cocktailsRelations = relations(cocktails, ({ many }) => ({
  cocktailIngredients: many(cocktailIngredients),
  instructions: many(instructions),
  cocktailTags: many(cocktailTags),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  cocktailIngredients: many(cocktailIngredients),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  cocktailTags: many(cocktailTags),
}));

export const cocktailIngredientsRelations = relations(cocktailIngredients, ({ one }) => ({
  cocktail: one(cocktails, {
    fields: [cocktailIngredients.cocktailId],
    references: [cocktails.id],
  }),
  ingredient: one(ingredients, {
    fields: [cocktailIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

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
