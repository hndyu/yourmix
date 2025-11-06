/**
 * 材料名から表示グループへのマッピング
 * キー: 実際の材料名（レシピで使用される名前）
 * 値: 表示名（材料選択画面で表示されるグループ名）
 */
export const ingredientGroupMap: Record<string, string> = {
	// ラム系のグループ化
	"ホワイト・ラム": "ラム",
	"ダーク・ラム": "ラム",
	"ゴールド・ラム": "ラム",
	"デメララ・ラム": "ラム",
	"マルティニーク・ラム": "ラム",
	"ブレンド熟成ラム": "ラム",
	"熟成ラム": "ラム",
	"キューバ産ラム": "ラム",
	"ジャマイカ産ラム": "ラム",
	"ゴスリングス・ラム": "ラム",
	// 将来的に他のスピリッツもグループ化可能
	// "ロンドン・ドライ・ジン": "ジン",
	// "オールド・トム・ジン": "ジン",
	// "フレーバーウォッカ": "ウォッカ",

};

/**
 * 材料名から表示グループ名を取得する関数
 * @param ingredientName 実際の材料名
 * @returns 表示グループ名（グループ化されていない場合はnullを返す）
 */
export function getGroupDisplayName(ingredientName: string): string | null {
	return ingredientGroupMap[ingredientName] || null;
}

/**
 * 表示グループ名から実際の材料名のリストを取得する関数
 * @param displayName 表示グループ名（例: "ラム"）
 * @returns 実際の材料名のリスト（例: ["ホワイト・ラム", "ダーク・ラム", ...]）
 */
export function getIngredientNamesByGroup(displayName: string): string[] {
	return Object.entries(ingredientGroupMap)
		.filter(([_, groupName]) => groupName === displayName)
		.map(([ingredientName]) => ingredientName);
}

