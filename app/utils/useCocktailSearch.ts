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

	const isIngredientSelected = React.useCallback(
		(ingredientName: string) => {
			const isDirectlySelected = selectedIngredients.includes(ingredientName);
			if (isDirectlySelected) return true;

			const parentIngredient = allIngredients.find((ing) =>
				ing.actualNames?.includes(ingredientName),
			);
			return parentIngredient
				? selectedIngredients.includes(parentIngredient.name)
				: false;
		},
		[selectedIngredients, allIngredients],
	);

	// カクテルを「ユーザーが選択しマッチした材料数 / カクテルを作るのに必要なすべての材料数」の割合が高い順に並び替える
	const sortedCocktails = React.useMemo(() => {
		return [...cocktails].sort((a, b) => {
			const calculateMatchRatio = (cocktail: Cocktail) => {
				if (cocktail.ingredients.length === 0) {
					return 0; // 材料がないカクテルは比率0とする
				}
				const matchedCount = cocktail.ingredients.filter((ingredient) =>
					isIngredientSelected(ingredient.name),
				).length;

				return matchedCount / cocktail.ingredients.length;
			};

			const ratioA = calculateMatchRatio(a);
			const ratioB = calculateMatchRatio(b);

			// 比率が高い順にソート (降順)
			// 比率が同じ場合は、元の順序を維持
			return ratioB - ratioA;
		});
	}, [cocktails, isIngredientSelected]);

	return { sortedCocktails, ingredientSortOrderMap, isIngredientSelected };
}
