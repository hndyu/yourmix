import type { Category, Cocktail, Ingredient } from "@/app/types/cocktail";
import { useCocktailSearch } from "@/app/utils/useCocktailSearch";
import { renderHook } from "@testing-library/react";
import { bench, describe } from "vitest";

// 大量のモックデータを生成するヘルパー関数
function generateMockData(cocktailCount: number, ingredientCount: number) {
	const mockCategories: Category[] = [
		{ id: 1, name: "Liquor", sortOrder: 1, assetKey: null, description: null },
		{ id: 2, name: "Juice", sortOrder: 2, assetKey: null, description: null },
		{ id: 3, name: "Syrup", sortOrder: 3, assetKey: null, description: null },
		{ id: 4, name: "Soda", sortOrder: 4, assetKey: null, description: null },
	];

	const mockAllIngredients: Ingredient[] = Array.from(
		{ length: ingredientCount },
		(_, i) => ({
			id: i + 1,
			name: `Ingredient ${i + 1}`,
			category: mockCategories[i % 4].name,
			categoryName: mockCategories[i % 4].name,
			actualNames: [
				`Ingredient ${i + 1}`,
				`Detail ${i + 1}A`,
				`Detail ${i + 1}B`,
			],
			sortOrder: i,
		}),
	);

	const mockCocktails: Cocktail[] = Array.from(
		{ length: cocktailCount },
		(_, i) => {
			// 各カクテルに3～5個の材料をランダムに割り当てる (簡略化のため固定パターン)
			const ingCount = 3 + (i % 3);
			const ingredients = Array.from({ length: ingCount }, (_, j) => {
				const ingIndex = (i + j) % ingredientCount;
				return {
					id: mockAllIngredients[ingIndex].id,
					name: mockAllIngredients[ingIndex].name,
					category: mockAllIngredients[ingIndex].category,
				};
			});

			return {
				id: `${i + 1}`,
				name: `Cocktail ${i + 1}`,
				slug: `cocktail-${i + 1}`,
				description: `Description ${i + 1}`,
				ingredients,
				instructions: [],
			};
		},
	);

	// ユーザーが選択している材料のモック (全体の10%を選択しているとする)
	const selectedIngredients = mockAllIngredients
		.slice(0, Math.max(1, Math.floor(ingredientCount * 0.1)))
		.map((ing) => ing.name);

	return {
		mockCocktails,
		mockAllIngredients,
		mockCategories,
		selectedIngredients,
	};
}

describe("useCocktailSearch benchmarks", () => {
	// データ量を 1000カクテル、100材料 でベンチマーク
	const {
		mockCocktails,
		mockAllIngredients,
		mockCategories,
		selectedIngredients,
	} = generateMockData(1000, 100);

	bench("renderHook useCocktailSearch with 1000 cocktails", () => {
		renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				selectedIngredients,
				mockCategories,
				mockAllIngredients,
			),
		);
	});
});
