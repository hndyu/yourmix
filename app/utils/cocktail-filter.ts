import type { Cocktail } from "../types/cocktail";

/**
 * 材料名から量を除去して純粋な材料名を取得する関数
 * @param ingredientWithAmount 量を含む材料名（例：「ラム（ホワイト） 60ml」）
 * @returns 純粋な材料名（例：「ラム（ホワイト）」）
 */
function extractIngredientName(ingredientWithAmount: string): string {
	// 量の部分を除去（数字 + 単位のパターンを削除）
	return ingredientWithAmount.replace(/\s+\d+[a-zA-Z]*$/, "").trim();
}

/**
 * 選択された材料に完全一致するカクテルを検索する関数
 * @param cocktails 検索対象のカクテル配列
 * @param selectedIngredients 選択された材料の配列
 * @returns 完全一致するカクテル配列
 */
export function findExactMatchCocktails(
	cocktails: Cocktail[],
	selectedIngredients: string[],
): Cocktail[] {
	// 材料が選択されていない場合は空配列を返す
	if (selectedIngredients.length === 0) {
		return [];
	}

	return cocktails.filter((cocktail) => {
		// カクテルの材料名を抽出（量を除去）
		const cocktailIngredientNames = cocktail.ingredients.map(
			extractIngredientName,
		);

		// 選択された材料とカクテルの材料が完全に一致するかチェック
		// 順序は考慮しない（配列の要素が同じであれば良い）
		if (selectedIngredients.length !== cocktailIngredientNames.length) {
			return false;
		}

		// 全ての選択された材料がカクテルに含まれているかチェック
		const allSelectedIncluded = selectedIngredients.every(
			(selectedIngredient) =>
				cocktailIngredientNames.some((cocktailIngredient) =>
					cocktailIngredient
						.toLowerCase()
						.includes(selectedIngredient.toLowerCase()),
				),
		);

		// 全てのカクテル材料が選択された材料に含まれているかチェック
		const allCocktailIncluded = cocktailIngredientNames.every(
			(cocktailIngredient) =>
				selectedIngredients.some((selectedIngredient) =>
					cocktailIngredient
						.toLowerCase()
						.includes(selectedIngredient.toLowerCase()),
				),
		);

		return allSelectedIncluded && allCocktailIncluded;
	});
}

/**
 * 生成AIによるオリジナルカクテルを生成する関数（仮実装）
 * @param selectedIngredients 選択された材料の配列
 * @returns 生成されたオリジナルカクテル
 */
export function generateOriginalCocktail(
	selectedIngredients: string[],
): Cocktail {
	// TODO: 実際の生成AI処理を実装
	return {
		id: `generated-${Date.now()}`,
		name: `${selectedIngredients.join(" & ")} オリジナル`,
		description: `選択された材料（${selectedIngredients.join(", ")}）を使用したオリジナルカクテルです。`,
		ingredients: selectedIngredients.map((ingredient) => `${ingredient} 適量`),
		instructions: [
			"選択された材料を適切な比率で混ぜ合わせます",
			"お好みに応じて調整してください",
			"※このレシピは生成AIによる提案です",
		],
		glassType: "カクテルグラス",
		garnish: "お好みのガーニッシュ",
		difficulty: "medium",
		prepTime: "5分",
	};
}

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

/**
 * 日付シードベースでカクテルを選択する関数
 * @param cocktails 選択対象のカクテル配列
 * @returns 日替わりで選択されたカクテル
 */
export function getDailyRecommendation(cocktails: Cocktail[]): Cocktail {
	// 今日の日付を取得
	const today = new Date();

	// 日付を文字列として結合（YYYY-MM-DD形式）
	const dateString = today.toISOString().split("T")[0];

	// 日付文字列から数値シードを生成
	let seed = 0;
	for (let i = 0; i < dateString.length; i++) {
		seed += dateString.charCodeAt(i);
	}

	// シードを使用してカクテルを選択
	const index = seed % cocktails.length;
	return cocktails[index];
}
