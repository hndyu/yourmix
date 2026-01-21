import { getDb } from "@/app/db/db";
import { categories, ingredientGroups, ingredients } from "@/app/db/schema";
import type {
	Category,
	GroupedIngredient,
	Ingredient,
} from "@/app/types/cocktail";
import { asc, eq } from "drizzle-orm";

export async function getIngredientsMasterData() {
	const db = await getDb();

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
				groupAssetKey: ingredientGroups.assetKey,
				sortOrder: ingredients.sortOrder,
			})
			.from(ingredients)
			.leftJoin(ingredientGroups, eq(ingredients.groupId, ingredientGroups.id))
			.leftJoin(categories, eq(ingredientGroups.categoryId, categories.id))
			// グループの表示順でソートし、次に材料の表示順でソート
			.orderBy(asc(ingredientGroups.sortOrder), asc(ingredients.sortOrder)),
	]);

	// 表示用に材料をグループ化し、グループ情報のマッピングを同時に作成
	// Optimization: O(N) single-pass logic replaces previous O(N^2) reduction/filtering.
	// This reduces server-side execution time, especially on Cloudflare Workers.
	const groupMapping: Record<string, string[]> = {};
	const groupedIngredientsMap = new Map<string, Ingredient>();

	for (const ing of allIngredientsWithGroups) {
		const displayName = ing.groupDisplayName || ing.name;

		// グループ情報のマッピングを更新（検索時の展開に使用）
		if (ing.groupDisplayName) {
			if (!groupMapping[ing.groupDisplayName]) {
				groupMapping[ing.groupDisplayName] = [];
			}
			groupMapping[ing.groupDisplayName].push(ing.name);
		}

		let group = groupedIngredientsMap.get(displayName);

		if (group) {
			group.actualNames?.push(ing.name);
			group.actualIds?.push(ing.id);
			group.actualDetails?.push({ id: ing.id, name: ing.name });
		} else {
			group = {
				id: ing.id,
				name: displayName,
				category: ing.categoryName ?? "",
				categoryName: ing.categoryName ?? "",
				actualNames: [ing.name],
				actualIds: [ing.id],
				actualDetails: [{ id: ing.id, name: ing.name }],
				sortOrder: ing.groupSortOrder,
				description: ing.groupDescription,
				assetKey: ing.groupAssetKey,
			};
			groupedIngredientsMap.set(displayName, group);
		}
	}

	// Mapの値を配列に変換 (挿入順が保持される)
	const groupedIngredients = Array.from(groupedIngredientsMap.values());

	return {
		categories: allCategories as Category[],
		ingredients: groupedIngredients as Ingredient[], // Ingredient[]として返す
		groupMapping,
	};
}
