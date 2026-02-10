"use server";

import { generateCocktailFromIngredients } from "@/app/lib/generate-cocktail";
import type { Cocktail } from "@/app/types/cocktail";

const mockCocktail: Cocktail = {
	id: "mock-ai-1",
	name: "ジン・フィズ",
	slug: "mock-gin-fizz",
	description: "さっぱりとした味わいのカクテルです。",
	ingredients: [
		{ id: 1, name: "ジン", category: "spirit", amount: "45ml" },
		{ id: 2, name: "レモンジュース", category: "citrus", amount: "30ml" },
		{ id: 3, name: "砂糖", category: "sweet", amount: "2tsp" },
		{ id: 4, name: "ソーダ", category: "mixer", amount: "適量" },
	],
	instructions: ["シェイクしてグラスに注ぐ", "ソーダで満たす"],
};

/**
 * クライアントから呼び出すサーバーアクション
 */
export async function generateCocktailAction(
	ingredients: string[],
	options?: { mock?: boolean },
): Promise<Cocktail> {
	if (options?.mock) {
		// E2Eテスト向けに外部API呼び出しを避ける
		return mockCocktail;
	}

	return generateCocktailFromIngredients(ingredients);
}
