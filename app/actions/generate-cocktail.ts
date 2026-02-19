"use server";

import { generateCocktailFromIngredients } from "@/app/lib/generate-cocktail";
import type { GeneratedCocktail } from "@/app/types/cocktail";

const mockCocktail: GeneratedCocktail = {
	name: "ジン・フィズ",
	description: "さっぱりとした味わいのカクテルです。",
	ingredients: [
		{ name: "ジン", amount: "45ml" },
		{ name: "レモンジュース", amount: "30ml" },
		{ name: "砂糖", amount: "2tsp" },
		{ name: "ソーダ", amount: "適量" },
	],
	instructions: ["シェイクしてグラスに注ぐ", "ソーダで満たす"],
};

/**
 * クライアントから呼び出すサーバーアクション
 */
export async function generateCocktailAction(
	ingredients: string[],
	options?: { mock?: boolean },
): Promise<GeneratedCocktail> {
	if (options?.mock) {
		// E2Eテスト向けに外部API呼び出しを避ける
		return mockCocktail;
	}

	return generateCocktailFromIngredients(ingredients);
}
