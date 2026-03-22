import { getDb } from "@/app/db/db";
import { schema } from "@/app/db/schema";
import type { Cocktail } from "@/app/types/cocktail";
import { and, eq, inArray } from "drizzle-orm";

export async function searchCocktailsByIngredients(
	selectedIngredientIds: number[],
): Promise<Cocktail[]> {
	const db = await getDb();

	// ⚡ Bolt: Prune unnecessary relations and fields for search results.
	// Search results only require basic cocktail info and ingredient names for match ratio/badges.
	// Pruning 'instructions', 'tags', and deep-nested 'category' reduces query complexity and payload size.
	const allCocktails = await db.query.cocktails.findMany({
		where:
			selectedIngredientIds.length > 0
				? (cocktails, { exists }) =>
						exists(
							db
								.select()
								.from(schema.cocktailIngredients)
								.where(
									and(
										eq(cocktails.id, schema.cocktailIngredients.cocktailId),
										inArray(
											schema.cocktailIngredients.ingredientId,
											selectedIngredientIds,
										),
									),
								),
						)
				: undefined,
		columns: {
			id: true,
			name: true,
			slug: true,
			description: true,
			imageUrl: true,
			garnish: true,
		},
		with: {
			cocktailIngredients: {
				columns: {
					amount: true,
				},
				with: {
					ingredient: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});

	// APIレスポンスの型に変換
	return allCocktails.map((cocktail) => ({
		id: cocktail.id,
		name: cocktail.name,
		slug: cocktail.slug,
		description: cocktail.description ?? "",
		imageUrl: cocktail.imageUrl ?? undefined,
		garnish: cocktail.garnish ?? undefined,
		ingredients: cocktail.cocktailIngredients.map((ci) => ({
			id: ci.ingredient.id,
			name: ci.ingredient.name,
			amount: ci.amount,
			category: "", // Search results don't need category per ingredient
		})),
		tags: [], // Not needed for search results summary
		instructions: [], // Not needed for search results summary
	}));
}
