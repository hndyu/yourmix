import type { Cocktail, Ingredient } from "../types/cocktail";

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
		// カクテルの材料名を抽出
		const cocktailIngredientNames = cocktail.ingredients.map(
			(ingredient) => ingredient.name,
		);

		// 選択された材料とカクテルの材料が完全に一致するかチェック
		// 順序は考慮しない（配列の要素が同じであれば良い）
		if (selectedIngredients.length !== cocktailIngredientNames.length) {
			return false;
		}

		// 全ての選択された材料がカクテルに含まれているかチェック
		const allSelectedIncluded = selectedIngredients.every((selectedIngredient) =>
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
		// エラーが発生した場合、フォールバックとして簡単なカクテル情報を返すか、
		// エラーを呼び出し元にスローしてUI側でハンドリングする
		// ここではエラーを再スローする
		throw error;
	}
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
			.map((i) => i.name)
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
 * カクテルと選択された材料のマッチ度を計算する関数（改善版）
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

	// カクテルの材料名を抽出
	const cocktailIngredientNames = cocktail.ingredients.map(
		(ingredient) => ingredient.name,
	);

	// 選択された材料のうち、カクテルに含まれている材料の数をカウント
	const matchedIngredients = selectedIngredients.filter((ingredient) => {
		const ingredientLower = ingredient.toLowerCase();

		// カクテルの材料リストで部分一致をチェック
		return cocktailIngredientNames.some((cocktailIngredient) =>
			cocktailIngredient.toLowerCase().includes(ingredientLower),
		);
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

/**
 * カクテルIDからカクテルデータを取得する関数
 * @param cocktails カクテル配列
 * @param id 検索するカクテルID
 * @returns カクテルデータ（見つからない場合はundefined）
 */
export function getCocktailById(
	cocktails: Cocktail[],
	id: string,
): Cocktail | undefined {
	return cocktails.find((cocktail) => cocktail.id === id);
}

/**
 * カクテルIDからカクテルデータを取得する関数（非同期版）
 * @param id 検索するカクテルID
 * @returns Promise<Cocktail | undefined>
 */
export async function getCocktailByIdAsync(
	id: string,
): Promise<Cocktail | undefined> {
	// 実際の実装では、ここでAPIからデータを取得
	// 現在はモックデータを使用
	const { mockCocktails } = await import("../types/cocktail");
	return mockCocktails.find((cocktail) => cocktail.id === id);
}
