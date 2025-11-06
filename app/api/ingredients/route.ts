import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { ingredients, categories, ingredientGroups } from "../../../schema";
import { asc, eq } from "drizzle-orm";

/**
 * カクテルの材料一覧を取得するAPIエンドポイント
 * GET /api/ingredients
 */
export async function GET() {
	try {
		// Cloudflare環境からコンテキストを取得
		const context = getCloudflareContext();
		
		// コンテキストまたはenvが存在しない場合のエラーハンドリング
		if (!context || !context.env) {
			console.error("Cloudflare context or env is not available");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}

		// D1データベースに接続（型アサーションを使用してDBバインディングにアクセス）
		// Cloudflare Workers環境では、env.DBがD1Databaseとして利用可能
		const env = context.env as { DB?: D1Database };
		if (!env.DB) {
			console.error("DB binding is not available");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}
		const db = drizzle(env.DB);

		// カテゴリを並び順で取得
		const allCategories = await db
			.select()
			.from(categories)
			.orderBy(asc(categories.sortOrder));

		// 材料テーブルとグループテーブルをJOINして取得
		const allIngredientsWithGroups = await db
			.select({
				id: ingredients.id,
				name: ingredients.name,
				category: ingredients.category,
				groupId: ingredients.groupId,
				groupDisplayName: ingredientGroups.displayName,
				groupSortOrder: ingredientGroups.sortOrder,
			})
			.from(ingredients)
			.leftJoin(ingredientGroups, eq(ingredients.groupId, ingredientGroups.id));

		// 表示用にグループ化（displayNameでグループ化）
		const groupedIngredientsMap = new Map<
			string,
			{
				id: number;
				name: string;
				category: string | null;
				actualNames: string[];
				sortOrder: number | null;
			}
		>();

		for (const ing of allIngredientsWithGroups) {
			// 表示名を決定（グループがあればグループ名、なければ材料名）
			const displayName = ing.groupDisplayName || ing.name;

			if (groupedIngredientsMap.has(displayName)) {
				// 既存のグループに実際の材料名を追加
				const existing = groupedIngredientsMap.get(displayName)!;
				existing.actualNames.push(ing.name);
			} else {
				// 新しいグループを作成
				groupedIngredientsMap.set(displayName, {
					id: ing.id, // 最初に見つかった材料のIDを使用
					name: displayName,
					category: ing.category,
					actualNames: [ing.name],
					sortOrder: ing.groupSortOrder,
				});
			}
		}

		// グループ化された材料を配列に変換し、sortOrderでソート
		const groupedIngredients = Array.from(groupedIngredientsMap.values()).sort(
			(a, b) => {
				// sortOrderがnullのものは最後に
				if (a.sortOrder === null && b.sortOrder === null) return 0;
				if (a.sortOrder === null) return 1;
				if (b.sortOrder === null) return -1;
				return a.sortOrder - b.sortOrder;
			},
		);

		// グループ情報のマッピングを作成（検索時の展開に使用）
		// キー: 表示グループ名、値: 実際の材料名の配列
		const groupMapping: Record<string, string[]> = {};
		for (const ing of allIngredientsWithGroups) {
			if (ing.groupDisplayName) {
				if (!groupMapping[ing.groupDisplayName]) {
					groupMapping[ing.groupDisplayName] = [];
				}
				// 重複を避ける
				if (!groupMapping[ing.groupDisplayName].includes(ing.name)) {
					groupMapping[ing.groupDisplayName].push(ing.name);
				}
			}
		}

		// カテゴリ情報と材料、グループマッピングを一緒に返す
		return NextResponse.json(
			{
				categories: allCategories,
				ingredients: groupedIngredients,
				groupMapping: groupMapping,
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

