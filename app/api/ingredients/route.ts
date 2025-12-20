import { getDb } from "@/app/db/db";
import {
	categories,
	cocktailIngredients,
	cocktailTags,
	cocktails,
	deliciousLikes,
	ingredientGroups,
	ingredients,
	instructions,
	tags,
} from "@/app/db/schema";
import type { GroupedIngredient } from "@/app/types/cocktail";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const schema = {
	cocktails,
	cocktailIngredients,
	cocktailTags,
	deliciousLikes,
	ingredients,
	tags,
	instructions,
	categories,
	ingredientGroups,
};

/**
 * カクテルの材料一覧を取得するAPIエンドポイント
 * GET /api/ingredients
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
				} else {
					group = {
						id: ing.id,
						name: displayName,
						categoryName: ing.categoryName ?? "",
						actualNames: [ing.name],
						sortOrder: ing.groupSortOrder,
						description: ing.groupDescription,
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

		// カテゴリ情報と材料、グループマッピングを一緒に返す
		return NextResponse.json(
			{
				categories: allCategories,
				ingredients: groupedIngredients,
				groupMapping,
			},
			{ status: 200 },
		);
	} catch (error) {
		// エラーが発生した場合のログ出力とエラーレスポンス
		console.error("Error fetching ingredients:", error);
		return NextResponse.json(
			{ error: "材料の取得中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}
