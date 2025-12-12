import { ingredientGroups, ingredients } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import type { DB } from "../db/db";

const schema = {
	ingredients,
	ingredientGroups,
};

/**
 * 材料名から表示グループ名を取得する関数
 *
 * @param db Drizzle D1 データベースインスタンス
 * @param ingredientName 実際の材料名
 * @returns 表示グループ名（グループ化されていない場合は null を返す）
 */
export async function getGroupDisplayName(
	db: DB,
	ingredientName: string,
): Promise<string | null> {
	const result = await db.query.ingredients.findFirst({
		columns: {},
		where: eq(schema.ingredients.name, ingredientName),
		with: {
			group: {
				columns: {
					displayName: true,
				},
			},
		},
	});

	return result?.group?.displayName ?? null;
}

/**
 * 表示グループ名から実際の材料名のリストを取得する関数
 *
 * @param db Drizzle D1 データベースインスタンス
 * @param displayName 表示グループ名（例: "ラム"）
 * @returns 実際の材料名のリスト（例: ["ホワイト・ラム", "ダーク・ラム", ...]）
 */
export async function getIngredientNamesByGroup(
	db: DB,
	displayName: string,
): Promise<string[]> {
	const result = await db.query.ingredientGroups.findFirst({
		columns: {},
		where: eq(schema.ingredientGroups.displayName, displayName),
		with: {
			ingredients: {
				columns: { name: true },
			},
		},
	});

	return result?.ingredients.map((ing: { name: string }) => ing.name) ?? [];
}
