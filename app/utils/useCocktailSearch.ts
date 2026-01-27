import * as React from "react";
import type { Category, Cocktail, Ingredient } from "../types/cocktail";

export function useCocktailSearch(
	cocktails: Cocktail[],
	selectedIngredients: string[],
	categories: Category[],
	allIngredients: Ingredient[],
) {
	const ingredientSortOrderMap = React.useMemo(() => {
		const map = new Map<
			string,
			{ categoryOrder: number; groupOrder: number }
		>();
		const categoryOrderMap = new Map(
			categories.map((c) => [c.name, c.sortOrder ?? Number.POSITIVE_INFINITY]),
		);

		for (const group of allIngredients) {
			const groupOrder = group.sortOrder ?? Number.POSITIVE_INFINITY;
			const categoryOrder =
				categoryOrderMap.get(group.categoryName ?? "") ??
				Number.POSITIVE_INFINITY;

			const orderInfo = { categoryOrder, groupOrder };
			map.set(group.name, orderInfo);
			if (group.actualNames) {
				for (const actualName of group.actualNames) {
					map.set(actualName, orderInfo);
				}
			}
		}
		return map;
	}, [allIngredients, categories]);

	// ⚡ Bolt: Optimized lookups for ingredient selection status
	// Convert selectedIngredients to a Set for O(1) membership checks
	const selectedSet = React.useMemo(
		() => new Set(selectedIngredients),
		[selectedIngredients],
	);

	// ⚡ Bolt: Map child names to parent group names for O(1) lookup
	// Pre-calculated once when allIngredients changes, rather than searching in a loop
	const actualNameToParentMap = React.useMemo(() => {
		const map = new Map<string, string>();
		for (const ing of allIngredients) {
			if (ing.actualNames) {
				for (const actualName of ing.actualNames) {
					map.set(actualName, ing.name);
				}
			}
		}
		return map;
	}, [allIngredients]);

	const isIngredientSelected = React.useCallback(
		(ingredientName: string) => {
			// O(1) lookup in Set
			if (selectedSet.has(ingredientName)) return true;

			// O(1) lookup in parent map
			const parentName = actualNameToParentMap.get(ingredientName);
			// O(1) lookup in Set for parent
			return parentName ? selectedSet.has(parentName) : false;
		},
		[selectedSet, actualNameToParentMap],
	);

	// カクテルを「ユーザーが選択しマッチした材料数 / カクテルを作るのに必要なすべての材料数」の割合が高い順に並び替える
	const sortedCocktails = React.useMemo(() => {
		// ⚡ Bolt: Pre-calculate match ratios once per cocktail to avoid redundant calculations during sort
		// Reduces complexity from O(C log C) to O(C) for the match ratio calculation
		const matchRatios = new Map<string, number>();

		for (const cocktail of cocktails) {
			if (cocktail.ingredients.length === 0) {
				matchRatios.set(cocktail.id, 0);
				continue;
			}

			const matchedCount = cocktail.ingredients.filter((ingredient) =>
				isIngredientSelected(ingredient.name),
			).length;

			matchRatios.set(cocktail.id, matchedCount / cocktail.ingredients.length);
		}

		return [...cocktails].sort((a, b) => {
			const ratioA = matchRatios.get(a.id) ?? 0;
			const ratioB = matchRatios.get(b.id) ?? 0;

			// 比率が高い順にソート (降順)
			// 比率が同じ場合は、元の順序を維持
			return ratioB - ratioA;
		});
	}, [cocktails, isIngredientSelected]);

	return { sortedCocktails, ingredientSortOrderMap, isIngredientSelected };
}
