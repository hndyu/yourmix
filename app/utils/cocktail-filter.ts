import type { Cocktail, Ingredient } from "../types/cocktail";
import { getIngredientNamesByGroup } from "./ingredient-groups";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "@/schema";

/**
 * グループマッピングの型定義
 * キー: 表示グループ名、値: 実際の材料名の配列
 */
export type GroupMapping = Record<string, string[]>;

/**
 * 選択された材料に完全一致するカクテルを検索する関数
 * @param cocktails 検索対象のカクテル配列
 * @param selectedIngredients 選択された材料の配列（表示名と実際の材料名が混在）
 * @param groupMapping データベースから取得したグループマッピング（オプショナル）
 * @param db Drizzleデータベースインスタンス
 * @returns 完全一致するカクテル配列
 */
export async function findExactMatchCocktails(
	cocktails: Cocktail[],
	selectedIngredients: string[],
	groupMapping?: GroupMapping,
	db?: DrizzleD1Database<typeof schema>,
): Promise<Cocktail[]> {
	// 材料が選択されていない場合は空配列を返す
	if (selectedIngredients.length === 0) {
		return Promise.resolve([]);
	}

	// 表示名を実際の材料名に展開
	const expandedIngredients = await expandSelectedIngredients(
		selectedIngredients,
		groupMapping,
		db,
	);

	// 各カクテルが条件に一致するかどうかを非同期で判定
	const filterResults = await Promise.all(
		cocktails.map(async (cocktail) => {
			const cocktailIngredientNames = cocktail.ingredients.map(
				(ingredient) => ingredient.name,
			);

			// 材料数が一致しない場合は除外
			if (expandedIngredients.length !== cocktailIngredientNames.length) {
				return false;
			}

			// 順序を無視して配列の要素が一致するかをチェック
			const sortedExpanded = [...expandedIngredients].sort();
			const sortedCocktail = [...cocktailIngredientNames].sort();

			const allSelectedIncluded = sortedExpanded.every((selectedIngredient) =>
				sortedCocktail.some((cocktailIngredient) =>
					cocktailIngredient
						.toLowerCase()
						.includes(selectedIngredient.toLowerCase()),
				),
			);

			const allCocktailIncluded = sortedCocktail.every((cocktailIngredient) =>
				sortedExpanded.some((selectedIngredient) =>
					cocktailIngredient
						.toLowerCase()
						.includes(selectedIngredient.toLowerCase()),
				),
			);

			return allSelectedIncluded && allCocktailIncluded;
		}),
	);

	// 判定結果に基づいてカクテルをフィルタリング
	return cocktails.filter((_, index) => filterResults[index]);
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
 * 選択された材料名を展開する関数（表示名 → 実際の材料名）
 * @param selectedIngredients 選択された材料名の配列（表示名と実際の材料名が混在）
 * @param groupMapping データベースから取得したグループマッピング（オプショナル）
 * @param db Drizzleデータベースインスタンス
 * @returns 展開された実際の材料名の配列
 */
async function expandSelectedIngredients(
	selectedIngredients: string[],
	groupMapping?: GroupMapping,
	db?: DrizzleD1Database<typeof schema>,
): Promise<string[]> {
	const expanded: string[] = [];

	for (const ingredient of selectedIngredients) {
		// データベースから取得したマッピングを優先使用
		if (groupMapping && groupMapping[ingredient]) {
			expanded.push(...groupMapping[ingredient]);
		} else if (db) {
			// フォールバック: コード内のマッピングを使用（シードスクリプトなどで使用）
			const actualNames = await getIngredientNamesByGroup(db, ingredient);
			if (actualNames.length > 0) {
				expanded.push(...actualNames);
			} else {
				expanded.push(ingredient);
			}
		} else {
			// グループ化されていない場合、元の名称をそのまま追加
			expanded.push(ingredient);
		}
	}

	// 重複を除去して返す
	return [...new Set(expanded)];
}

/**
 * 選択された材料に基づいてカクテルをフィルタリングする関数
 * @param cocktails フィルタリング対象のカクテル配列
 * @param selectedIngredients 選択された材料の配列（表示名と実際の材料名が混在）
 * @param groupMapping データベースから取得したグループマッピング（オプショナル）
 * @param db Drizzleデータベースインスタンス
 * @returns フィルタリングされたカクテル配列
 */
export async function filterCocktailsByIngredients(
	cocktails: Cocktail[],
	selectedIngredients: string[],
	groupMapping?: GroupMapping,
	db?: DrizzleD1Database<typeof schema>,
): Promise<Cocktail[]> {
	// 材料が選択されていない場合は全てのカクテルを返す
	if (selectedIngredients.length === 0) {
		return cocktails;
	}

	// 表示名を実際の材料名に展開
	const expandedIngredients = await expandSelectedIngredients(
		selectedIngredients,
		groupMapping,
	);

	return cocktails.filter((cocktail) => {
		// カクテルの材料リストを文字列として結合
		const cocktailIngredientsText = cocktail.ingredients
			.map((i) => i.name)
			.join(" ")
			.toLowerCase();

		// 選択された材料のうち、少なくとも1つがカクテルの材料に含まれているかチェック
		return expandedIngredients.some((ingredient) => {
			const ingredientLower = ingredient.toLowerCase();

			// 材料名がカクテルの材料リストに含まれているかチェック
			// 部分一致も考慮（例：「ラム」は「ホワイト・ラム」にマッチ）
			return cocktailIngredientsText.includes(ingredientLower);
		});
	});
}

/**
 * カクテルと選択された材料のマッチ度を計算する関数（改善版）
 * @param cocktail カクテル
 * @param selectedIngredients 選択された材料の配列（表示名と実際の材料名が混在）
 * @param groupMapping データベースから取得したグループマッピング（オプショナル）
 * @param db Drizzleデータベースインスタンス
 * @returns マッチ度（0-1の数値、1が完全一致）
 */
export async function calculateMatchScore(
	cocktail: Cocktail,
	selectedIngredients: string[],
	groupMapping?: GroupMapping,
	db?: DrizzleD1Database<typeof schema>,
): Promise<number> {
	if (selectedIngredients.length === 0) {
		return 0;
	}

	// 表示名を実際の材料名に展開
	const expandedIngredients = await expandSelectedIngredients(
		selectedIngredients,
		groupMapping,
		db,
	);

	// カクテルの材料名を抽出
	const cocktailIngredientNames = cocktail.ingredients.map(
		(ingredient) => ingredient.name,
	);

	// 選択された材料のうち、カクテルに含まれている材料の数をカウント
	const matchedIngredients = expandedIngredients.filter((ingredient) => {
		const ingredientLower = ingredient.toLowerCase();

		// カクテルの材料リストで部分一致をチェック
		return cocktailIngredientNames.some((cocktailIngredient) =>
			cocktailIngredient.toLowerCase().includes(ingredientLower),
		);
	});

	// マッチ度を計算（展開された材料のうち、カクテルに含まれている材料の割合）
	// ただし、元の選択数で割ることで、グループ化された材料の選択を適切に評価
	return matchedIngredients.length / expandedIngredients.length;
}

/**
 * マッチ度に基づいてカクテルをソートする関数
 * @param cocktails ソート対象のカクテル配列
 * @param selectedIngredients 選択された材料の配列（表示名と実際の材料名が混在）
 * @param groupMapping データベースから取得したグループマッピング（オプショナル）
 * @param db Drizzleデータベースインスタンス
 * @returns マッチ度順にソートされたカクテル配列
 */
export async function sortCocktailsByMatchScore(
	cocktails: Cocktail[],
	selectedIngredients: string[],
	groupMapping?: GroupMapping,
	db?: DrizzleD1Database<typeof schema>,
): Promise<Cocktail[]> {
	const scores = await Promise.all(
		cocktails.map(async (cocktail) => ({
			cocktail,
			score: await calculateMatchScore(cocktail, selectedIngredients, groupMapping, db),
		})),
	);
	return scores.sort((a, b) => b.score - a.score).map((item) => item.cocktail);
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
