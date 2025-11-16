import { getCloudflareContext } from "@opennextjs/cloudflare";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { NextResponse } from "next/server";
import type { Env } from "../../../cloudflare-env";
import { categories, ingredientGroups, ingredients } from "../../../schema";
import type { GroupedIngredient } from "../../types/cocktail";

/**
 * カクテルの材料一覧を取得するAPIエンドポイント
 * GET /api/ingredients
 */

export async function GET() {
	try {
		// Cloudflare環境からコンテキストを取得
		const context = getCloudflareContext();
		const env = context.env as Env;

		if (!env.DB) {
			console.error("DB binding is not available.");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}
		const db = drizzle(env.DB);

		const [allCategories, allIngredientsWithGroups] = await Promise.all([
			// カテゴリを並び順で取得
			db
				.select()
				.from(categories)
				.orderBy(asc(categories.sortOrder)),
			// 材料テーブルとグループテーブル、カテゴリテーブルをJOINして取得
			db
				.select({
					id: ingredients.id,
					name: ingredients.name,
					categoryName: categories.name,
					groupId: ingredients.groupId,
					groupDisplayName: ingredientGroups.displayName,
					groupSortOrder: ingredientGroups.sortOrder,
					groupDescription: ingredientGroups.description,
				})
				.from(ingredients)
				.leftJoin(
					ingredientGroups,
					eq(ingredients.groupId, ingredientGroups.id),
				)
				.leftJoin(categories, eq(ingredients.categoryId, categories.id))
				// グループの表示順でソート
				.orderBy(asc(ingredientGroups.sortOrder)),
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
