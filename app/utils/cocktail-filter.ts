import type { Cocktail } from "../types/cocktail";

/**
 * 選択された材料に基づいてカクテルをフィルタリングする関数
 * @param cocktails フィルタリング対象のカクテル配列
 * @param selectedIngredients 選択された材料の配列
 * @returns フィルタリングされたカクテル配列
 */
export function filterCocktailsByIngredients(
	cocktails: Cocktail[],
	selectedIngredients: string[],
): Cocktail[] {
	// 材料が選択されていない場合は全てのカクテルを返す
	if (selectedIngredients.length === 0) {
		return cocktails;
	}

	return cocktails.filter((cocktail) => {
		// カクテルの材料リストを文字列として結合
		const cocktailIngredientsText = cocktail.ingredients
			.join(" ")
			.toLowerCase();

		// 選択された材料のうち、少なくとも1つがカクテルの材料に含まれているかチェック
		return selectedIngredients.some((ingredient) => {
			const ingredientLower = ingredient.toLowerCase();

			// 材料名がカクテルの材料リストに含まれているかチェック
			// 部分一致も考慮（例：「ラム」は「ラム（ホワイト）」にマッチ）
			return cocktailIngredientsText.includes(ingredientLower);
		});
	});
}

/**
 * カクテルと選択された材料のマッチ度を計算する関数
 * @param cocktail カクテル
 * @param selectedIngredients 選択された材料の配列
 * @returns マッチ度（0-1の数値、1が完全一致）
 */
export function calculateMatchScore(
	cocktail: Cocktail,
	selectedIngredients: string[],
): number {
	if (selectedIngredients.length === 0) {
		return 0;
	}

	// カクテルの材料リストを文字列として結合
	const cocktailIngredientsText = cocktail.ingredients.join(" ").toLowerCase();

	// 選択された材料のうち、カクテルに含まれている材料の数をカウント
	const matchedIngredients = selectedIngredients.filter((ingredient) => {
		const ingredientLower = ingredient.toLowerCase();
		return cocktailIngredientsText.includes(ingredientLower);
	});

	// マッチ度を計算（選択された材料のうち、カクテルに含まれている材料の割合）
	return matchedIngredients.length / selectedIngredients.length;
}

/**
 * マッチ度に基づいてカクテルをソートする関数
 * @param cocktails ソート対象のカクテル配列
 * @param selectedIngredients 選択された材料の配列
 * @returns マッチ度順にソートされたカクテル配列
 */
export function sortCocktailsByMatchScore(
	cocktails: Cocktail[],
	selectedIngredients: string[],
): Cocktail[] {
	return [...cocktails].sort((a, b) => {
		const scoreA = calculateMatchScore(a, selectedIngredients);
		const scoreB = calculateMatchScore(b, selectedIngredients);
		return scoreB - scoreA; // 降順（マッチ度の高い順）
	});
}
