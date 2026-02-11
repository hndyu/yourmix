"use server";

import { searchCocktailsByIngredients } from "@/app/lib/cocktail-search";
import type { Cocktail } from "@/app/types/cocktail";

/**
 * クライアントから呼び出すサーバーアクション
 */
export async function searchCocktailsAction(
	ingredientIds: number[],
	options?: { mock?: boolean; mockData?: Cocktail[] },
): Promise<Cocktail[]> {
	if (options?.mock) {
		return options.mockData ?? [];
	}

	return searchCocktailsByIngredients(ingredientIds);
}
