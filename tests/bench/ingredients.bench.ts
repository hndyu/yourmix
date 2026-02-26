import type { Ingredient } from "@/app/types/cocktail";
import { bench, describe } from "vitest";

// getIngredientsMasterData内のデータ変換ロジックを抽出した関数
function processIngredients(
	allIngredientsWithGroups: {
		id: number;
		name: string;
		categoryName: string | null;
		groupId: number | null;
		groupDisplayName: string | null;
		groupSortOrder: number | null;
		groupDescription: string | null;
		groupAssetKey: string | null;
		sortOrder: number;
	}[],
) {
	// 表示用に材料をグループ化
	const groupedIngredientsMap = allIngredientsWithGroups.reduce((acc, ing) => {
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
				category: ing.categoryName ?? "",
				categoryName: ing.categoryName ?? "",
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
	}, new Map<string, Ingredient>());

	const groupedIngredients = Array.from(groupedIngredientsMap.values());

	const groupMapping: Record<string, string[]> = {};
	for (const ing of allIngredientsWithGroups) {
		if (ing.groupDisplayName) {
			if (!groupMapping[ing.groupDisplayName]) {
				groupMapping[ing.groupDisplayName] = [];
			}
			groupMapping[ing.groupDisplayName].push(ing.name);
		}
	}

	return {
		ingredients: groupedIngredients,
		groupMapping,
	};
}

// 大量のモックデータを生成するヘルパー関数
function generateMockRawData(recordCount: number, groupCount: number) {
	return Array.from({ length: recordCount }, (_, i) => {
		const groupId = (i % groupCount) + 1;
		const isGrouped = i % 2 === 0;

		return {
			id: i + 1,
			name: `Raw Ingredient ${i + 1}`,
			categoryName: `Category ${i % 5}`,
			groupId: isGrouped ? groupId : null,
			groupDisplayName: isGrouped ? `Group ${groupId}` : null,
			groupSortOrder: isGrouped ? groupId : null,
			groupDescription: isGrouped ? `Desc ${groupId}` : null,
			groupAssetKey: null,
			sortOrder: i,
		};
	});
}

describe("ingredients.ts data processing benchmarks", () => {
	// データ量を 5000レコード、500グループ でベンチマーク
	const mockRawData = generateMockRawData(5000, 500);

	bench("processIngredients with 5000 raw records", () => {
		processIngredients(mockRawData);
	});
});
