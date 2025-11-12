
/**
 * 材料名から表示グループへのマッピングの型定義
 */
export type IngredientGroupMap = Record<string, string>;

/**
 * 材料名から表示グループ名を取得する関数
 * @param ingredientName 実際の材料名
 * @param ingredientGroupMap 材料名とグループのマッピング
 * @returns 表示グループ名（グループ化されていない場合は null を返す）
 */
export function getGroupDisplayName(
	ingredientName: string,
	ingredientGroupMap: IngredientGroupMap,
): string | null {
	return ingredientGroupMap[ingredientName] ?? null;
}

/**
 * 表示グループ名から実際の材料名のリストを取得する関数
 * @param displayName 表示グループ名（例: "ラム"）
 * @param ingredientGroupMap 材料名とグループのマッピング
 * @returns 実際の材料名のリスト（例: ["ホワイト・ラム", "ダーク・ラム", ...]）
 */
export function getIngredientNamesByGroup(
	displayName: string,
	ingredientGroupMap: IngredientGroupMap,
): string[] {
	return Object.entries(ingredientGroupMap)
		.filter(([_, groupName]) => groupName === displayName)
		.map(([ingredientName]) => ingredientName);
}
