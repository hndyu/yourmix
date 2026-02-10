import { getDb } from "@/app/db/db";
import { schema } from "@/app/db/schema";
import type { Cocktail } from "@/app/types/cocktail";
import { and, eq, inArray } from "drizzle-orm";

export async function searchCocktailsByIngredients(
	selectedIngredientIds: number[],
): Promise<Cocktail[]> {
	const db = await getDb();

	// DrizzleのRelational Queriesを使用してデータを取得
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
	});

	// APIレスポンスの型に変換
	return allCocktails.map((cocktail) => ({
		...cocktail,
		imageUrl: cocktail.imageUrl ?? undefined,
		description: cocktail.description ?? "",
		garnish: cocktail.garnish ?? undefined,
		ingredients: cocktail.cocktailIngredients.map((ci) => ({
			id: ci.ingredient.id,
			name: ci.ingredient.name,
			amount: ci.amount,
			category: ci.ingredient.group.category.name,
		})),
		tags: cocktail.cocktailTags.map((ct) => ({
			name: ct.tag.name,
			description: ct.tag.description,
		})),
		instructions: cocktail.instructions.map((inst) => inst.text),
	}));
}
