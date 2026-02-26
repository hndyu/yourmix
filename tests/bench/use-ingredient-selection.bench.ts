import { useIngredientSelection } from "@/app/_components/ingredient-selector/use-ingredient-selection";
import type { Ingredient } from "@/app/types/cocktail";
import { renderHook } from "@testing-library/react";
import { bench, describe } from "vitest";

// 大量のモックデータを生成するヘルパー関数
function generateMockData(groupCount: number) {
	const allIngredients: Ingredient[] = Array.from(
		{ length: groupCount },
		(_, i) => {
			const id = i + 1;
			const name = `Group ${id}`;
			// 各グループに3つの詳細材料を持たせる
			const actualNames = [`Group ${id}`, `Detail ${id}A`, `Detail ${id}B`];
			const actualIds = [id * 10, id * 10 + 1, id * 10 + 2];

			return {
				id: id * 10,
				name,
				category: `Category ${i % 5}`,
				categoryName: `Category ${i % 5}`,
				actualNames,
				actualIds,
				actualDetails: actualNames.map((n, j) => ({
					id: actualIds[j],
					name: n,
				})),
				sortOrder: i,
			};
		},
	);

	// ユーザーが選択している材料のモック (ランダムに選択状態を作成)
	// ここでは10%のグループ全体と、20%の詳細材料を選択した状態とする
	const selectedIngredientNames: string[] = [];
	const selectedIngredientIds: number[] = [];

	for (let i = 0; i < groupCount; i++) {
		const ing = allIngredients[i];
		if (i % 10 === 0) {
			// グループ全体を選択
			if (ing.actualNames && ing.actualIds) {
				selectedIngredientNames.push(ing.name, ...ing.actualNames);
				selectedIngredientIds.push(...ing.actualIds);
			}
		} else if (i % 5 === 0) {
			// 一部の詳細のみ選択
			if (
				ing.actualNames &&
				ing.actualNames.length > 1 &&
				ing.actualIds &&
				ing.actualIds.length > 1
			) {
				selectedIngredientNames.push(ing.actualNames[1]);
				selectedIngredientIds.push(ing.actualIds[1]);
			}
		}
	}

	return { allIngredients, selectedIngredientNames, selectedIngredientIds };
}

describe("useIngredientSelection benchmarks", () => {
	// データ量を 500グループ(計1500詳細材料) でベンチマーク
	const { allIngredients, selectedIngredientNames, selectedIngredientIds } =
		generateMockData(500);

	const onIngredientsChange = () => {};

	bench("renderHook and initialization with 500 groups", () => {
		renderHook(() =>
			useIngredientSelection({
				allIngredients,
				selectedIngredientNames,
				selectedIngredientIds,
				onIngredientsChange,
				maxSelectionCount: 100,
			}),
		);
	});

	bench("toggleGroup (add) execution", () => {
		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients,
				selectedIngredientNames,
				selectedIngredientIds,
				onIngredientsChange,
				maxSelectionCount: 100,
			}),
		);
		result.current.toggleGroup(allIngredients[1]); // 未選択のものをトグル
	});

	bench("toggleGroup (remove) execution", () => {
		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients,
				selectedIngredientNames,
				selectedIngredientIds,
				onIngredientsChange,
				maxSelectionCount: 100,
			}),
		);
		result.current.toggleGroup(allIngredients[0]); // 選択済みのものをトグル
	});
});
