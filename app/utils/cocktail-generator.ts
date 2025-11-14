import type { Cocktail } from "../types/cocktail";

/**
 * 生成AIによるオリジナルカクテルを生成する関数
 * @param selectedIngredients 選択された材料の配列
 * @returns 生成されたオリジナルカクテル
 */
export async function generateOriginalCocktail(
	selectedIngredients: string[],
): Promise<Cocktail> {
	try {
		const response = await fetch("/api/generate-cocktail", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ingredients: selectedIngredients }),
		});

		if (!response.ok) {
			const errorData = (await response.json()) as { error?: string };
			throw new Error(errorData.error || "カクテルの生成に失敗しました。");
		}

		const cocktailData = (await response.json()) as Cocktail;

		// APIからのデータがCocktail型に準拠していることを確認
		// ここでは簡単なチェックのみ
		if (!cocktailData.name || !cocktailData.ingredients) {
			throw new Error("受信したカクテルデータの形式が正しくありません。");
		}

		return cocktailData as Cocktail;
	} catch (error) {
		console.error("オリジナルカクテルの生成に失敗しました:", error);
		throw error;
	}
}
