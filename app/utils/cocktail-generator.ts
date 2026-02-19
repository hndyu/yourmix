import { generateCocktailAction } from "../actions/generate-cocktail";
import type { GeneratedCocktail } from "../types/cocktail";

declare global {
	interface Window {
		__E2E__?: boolean;
	}
}

const isE2E = typeof window !== "undefined" && window.__E2E__ === true;

/**
 * 生成AIによるオリジナルカクテルを生成する関数
 * @param selectedIngredients 選択された材料の配列
 * @returns 生成されたオリジナルカクテル
 */
export async function generateOriginalCocktail(
	selectedIngredients: string[],
): Promise<GeneratedCocktail> {
	try {
		const cocktailData = await generateCocktailAction(selectedIngredients, {
			mock: isE2E,
		});

		// APIからのデータがGeneratedCocktail型に準拠していることを確認
		// ここでは簡単なチェックのみ
		if (
			!cocktailData ||
			!cocktailData.name ||
			!Array.isArray(cocktailData.ingredients)
		) {
			throw new Error("受信したカクテルデータの形式が正しくありません。");
		}

		return cocktailData;
	} catch (error) {
		console.error("オリジナルカクテルの生成に失敗しました:", error);
		throw error;
	}
}
