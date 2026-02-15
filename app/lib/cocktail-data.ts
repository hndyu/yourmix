import { getDb } from "@/app/db/db";
import { cocktails, deliciousLikes } from "@/app/db/schema";
import type { Cocktail } from "@/app/types/cocktail";
import { sql } from "drizzle-orm";
import { cache } from "react";

// ⚡ Bolt: Use React.cache to deduplicate data fetching within a single request.
// Especially useful for metadata generation and page rendering sharing the same data.
export const getCocktailBySlug = cache(
	async (slug: string, userId?: string): Promise<Cocktail | null> => {
		const db = await getDb();

		// ⚡ Bolt: Consolidate relational query and aggregate counts into a single SQL-level operation using `extras`.
		// This reduces the number of coordinated database round-trips from 2 to 1.
		const result = await db.query.cocktails.findFirst({
			where: (cocktails, { eq }) => eq(cocktails.slug, slug),
			with: {
				cocktailIngredients: {
					with: {
						ingredient: {
							with: {
								group: {
									with: {
										category: true,
									},
								},
							},
						},
					},
				},
				instructions: {
					orderBy: (instructions, { asc }) => [asc(instructions.step)],
				},
				cocktailTags: {
					with: {
						tag: true,
					},
				},
			},
			extras: (cocktails, { sql }) => ({
				deliciousCount:
					sql<number>`(SELECT COUNT(*) FROM ${deliciousLikes} WHERE ${deliciousLikes.cocktailId} = ${cocktails.id})`.as(
						"delicious_count",
					),
				isLiked: userId
					? sql<number>`(SELECT CASE WHEN EXISTS(SELECT 1 FROM ${deliciousLikes} WHERE ${deliciousLikes.cocktailId} = ${cocktails.id} AND ${deliciousLikes.userId} = ${userId}) THEN 1 ELSE 0 END)`.as(
							"is_liked",
						)
					: sql<number>`0`.as("is_liked"),
			}),
		});

		if (!result) {
			return null;
		}

		const deliciousCount = result.deliciousCount ?? 0;
		const isLiked = result.isLiked === 1;

		// Structure the data to match the Cocktail interface
		const cocktailData: Cocktail = {
			id: result.id,
			name: result.name,
			slug: result.slug,
			description: result.description ?? "",
			garnish: result.garnish ?? undefined,
			imageUrl: result.imageUrl ?? undefined,
			deliciousCount,
			isLiked,
			ingredients: result.cocktailIngredients.map((ci) => ({
				id: ci.ingredient.id,
				name: ci.ingredient.name,
				category: ci.ingredient.group.category.name,
				amount: ci.amount,
				option_group: ci.option_group ?? undefined,
			})),
			tags: result.cocktailTags.map((ct) => ({
				name: ct.tag.name,
				description: ct.tag.description,
			})),
			instructions: result.instructions.map((inst) => inst.text),
		};

		return cocktailData;
	},
);
