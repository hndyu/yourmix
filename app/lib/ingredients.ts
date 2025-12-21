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
				sortOrder: ingredients.sortOrder,
			})
			.from(ingredients)
			.leftJoin(ingredientGroups, eq(ingredients.groupId, ingredientGroups.id))
			.leftJoin(categories, eq(ingredientGroups.categoryId, categories.id))
			// グループの表示順でソートし、次に材料の表示順でソート
			.orderBy(asc(ingredientGroups.sortOrder), asc(ingredients.sortOrder)),
	]);

	// 表示用に材料をグループ化
	const groupedIngredientsMap = allIngredientsWithGroups.reduce(
		(acc, ing) => {
			const displayName = ing.groupDisplayName || ing.name;
			let group = acc.get(displayName);

			if (group) {
				group.actualNames?.push(ing.name);
				group.actualIds?.push(ing.id);
				group.actualDetails?.push({ id: ing.id, name: ing.name });
			} else {
				group = {
					id: ing.id,
					name: displayName,
					category: ing.categoryName ?? "", // Ingredient型に合わせる
					categoryName: ing.categoryName ?? "",
					actualNames: [ing.name],
					actualIds: [ing.id],
					actualDetails: [{ id: ing.id, name: ing.name }],
					sortOrder: ing.groupSortOrder,
					description: ing.groupDescription,
				};
				acc.set(displayName, group);
			}
			return acc;
		},
		new Map<string, Ingredient>(), // Ingredient型を使用
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

	return {
		categories: allCategories as Category[],
		ingredients: groupedIngredients as Ingredient[], // Ingredient[]として返す
		groupMapping,
	};
}
