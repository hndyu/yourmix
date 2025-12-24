import { getDb } from "@/app/db/db";
import { schema } from "@/app/db/schema";
import type { GroupedIngredient } from "@/app/types/cocktail";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * 材料マスタを取得するAPIエンドポイント
 * GET /api/ingredients
 * @returns カテゴリとグループ化された材料データのJSONレスポンス
 */
export async function GET() {
	try {
		const db = await getDb();

		const [allCategories, allIngredientsWithGroups] = await Promise.all([
			// カテゴリを並び順で取得
			db
				.select()
				.from(schema.categories)
				.orderBy(asc(schema.categories.sortOrder)),
			// 材料テーブルとグループテーブル、カテゴリテーブルをJOINして取得
			db
				.select({
					id: schema.ingredients.id,
					name: schema.ingredients.name,
					categoryName: schema.categories.name,
					groupId: schema.ingredients.groupId,
					groupDisplayName: schema.ingredientGroups.displayName,
					groupSortOrder: schema.ingredientGroups.sortOrder,
					groupDescription: schema.ingredientGroups.description,
					groupAssetKey: schema.ingredientGroups.assetKey,
					sortOrder: schema.ingredients.sortOrder,
				})
				.from(schema.ingredients)
				.leftJoin(
					schema.ingredientGroups,
					eq(schema.ingredients.groupId, schema.ingredientGroups.id),
				)
				.leftJoin(
					schema.categories,
					eq(schema.ingredientGroups.categoryId, schema.categories.id),
				)
				// グループの表示順でソートし、次に材料の表示順でソート
				.orderBy(
					asc(schema.ingredientGroups.sortOrder),
					asc(schema.ingredients.sortOrder),
				),
		]);

		// 表示用に材料をグループ化
		const groupedIngredientsMap = allIngredientsWithGroups.reduce(
			(acc, ing) => {
				const displayName = ing.groupDisplayName || ing.name;
				let group = acc.get(displayName);

				if (group) {
					group.actualNames.push(ing.name);
					group.actualIds.push(ing.id);
					group.actualDetails.push({ id: ing.id, name: ing.name });
				} else {
					group = {
						id: ing.id,
						name: displayName,
						categoryName: ing.categoryName,
						actualNames: [ing.name],
						actualIds: [ing.id],
						actualDetails: [{ id: ing.id, name: ing.name }],
						sortOrder: ing.groupSortOrder,
						description: ing.groupDescription,
						assetKey: ing.groupAssetKey,
					};
					acc.set(displayName, group);
				}
				return acc;
			},
			new Map<string, GroupedIngredient>(),
		);

		// Mapの値を配列に変換 (挿入順が保持される)
		const groupedIngredients = Array.from(groupedIngredientsMap.values());
		// グループ情報のマッピングを作成（検索時の展開に使用）
		const groupMapping = allIngredientsWithGroups.reduce<
			Record<string, string[]>
		>((acc, ing) => {
			if (ing.groupDisplayName && !acc[ing.groupDisplayName]) {
				acc[ing.groupDisplayName] = allIngredientsWithGroups
					.filter((i) => i.groupDisplayName === ing.groupDisplayName)
					.map((i) => i.name);
			}
			return acc;
		}, {});

		return NextResponse.json(
			{
				categories: allCategories,
				ingredients: groupedIngredients,
				groupMapping,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching ingredients:", error);
		return NextResponse.json(
			{ error: "材料データの取得中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}
