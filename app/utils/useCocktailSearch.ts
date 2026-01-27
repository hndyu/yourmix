import * as React from "react";
import type { Category, Cocktail, Ingredient } from "../types/cocktail";

export function useCocktailSearch(
	cocktails: Cocktail[],
	selectedIngredients: string[],
	categories: Category[],
	allIngredients: Ingredient[],
) {
	// ⚡ Bolt: Pre-calculate sorting order map for ingredients
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

	// ⚡ Bolt: Convert selected ingredients to a Set for O(1) lookups
	// Impact: Reduces lookup time from O(S) to O(1)
	const selectedIngredientsSet = React.useMemo(
		() => new Set(selectedIngredients),
		[selectedIngredients],
	);

	// ⚡ Bolt: Pre-calculate a mapping from detail name to group name
	// This eliminates the need to call allIngredients.find() (O(A)) inside isIngredientSelected.
	// Impact: Reduces complexity from O(A) to O(1) per lookup
	const detailToGroupNameMap = React.useMemo(() => {
		const map = new Map<string, string>();
		for (const ing of allIngredients) {
			if (ing.actualNames) {
				for (const detailName of ing.actualNames) {
					// グループ名と詳細名が異なる場合のみMapに登録する
					if (detailName !== ing.name) {
						map.set(detailName, ing.name);
					}
				}
			}
		}
		return map;
	}, [allIngredients]);

	// ⚡ Bolt: Optimized isIngredientSelected with O(1) complexity
	const isIngredientSelected = React.useCallback(
		(ingredientName: string) => {
			if (selectedIngredientsSet.has(ingredientName)) return true;

			const parentGroupName = detailToGroupNameMap.get(ingredientName);
			return parentGroupName
				? selectedIngredientsSet.has(parentGroupName)
				: false;
		},
		[selectedIngredientsSet, detailToGroupNameMap],
	);

	// ⚡ Bolt: Optimized sorting logic
	// Pre-calculates match ratios in O(N*I) instead of O(N log N * I) during sort.
	// Also uses the optimized O(1) isIngredientSelected.
	// Expected impact: ~2-5x faster sorting for large cocktail lists.
	const sortedCocktails = React.useMemo(() => {
		const calculateMatchRatio = (cocktail: Cocktail) => {
			if (cocktail.ingredients.length === 0) {
				return 0; // 材料がないカクテルは比率0とする
			}
			const matchedCount = cocktail.ingredients.reduce(
				(count, ingredient) =>
					count + (isIngredientSelected(ingredient.name) ? 1 : 0),
				0,
			);

			return matchedCount / cocktail.ingredients.length;
		};

		// 1. Calculate ratios once (O(N * I))
		const cocktailRatios = cocktails.map((cocktail) => ({
			cocktail,
			ratio: calculateMatchRatio(cocktail),
		}));

		// 2. Sort by pre-calculated ratios (O(N log N))
		// 比率が高い順にソート (降順)
		return cocktailRatios
			.sort((a, b) => b.ratio - a.ratio)
			.map((item) => item.cocktail);
	}, [cocktails, isIngredientSelected]);

	return { sortedCocktails, ingredientSortOrderMap, isIngredientSelected };
}
