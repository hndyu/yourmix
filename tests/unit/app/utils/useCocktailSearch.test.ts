import type { Category, Cocktail, Ingredient } from "@/app/types/cocktail";
import { useCocktailSearch } from "@/app/utils/useCocktailSearch";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const mockCategories: Category[] = [
	{ id: 1, name: "Liquor", sortOrder: 1, assetKey: null, description: null },
	{ id: 2, name: "Juice", sortOrder: 2, assetKey: null, description: null },
];

const mockAllIngredients: Ingredient[] = [
	{
		id: 1,
		name: "Gin",
		category: "Liquor",
		categoryName: "Liquor",
		actualNames: ["Gin", "Beefeater", "Tanqueray"],
		sortOrder: 1,
	},
	{
		id: 2,
		name: "Lime Juice",
		category: "Juice",
		categoryName: "Juice",
		actualNames: ["Lime Juice", "Fresh Lime Juice"],
		sortOrder: 1,
	},
];

const mockCocktails: Cocktail[] = [
	{
		id: "1",
		name: "Gimlet",
		slug: "gimlet",
		description: "Classic",
		ingredients: [
			{ id: 1, name: "Gin", category: "Liquor" },
			{ id: 2, name: "Lime Juice", category: "Juice" },
		],
		instructions: [],
	},
	{
		id: "2",
		name: "Gin Tonic",
		slug: "gin-tonic",
		description: "Easy",
		ingredients: [
			{ id: 1, name: "Gin", category: "Liquor" },
			{ id: 3, name: "Tonic Water", category: "Soda" },
		],
		instructions: [],
	},
];

describe("useCocktailSearch", () => {
	it("should return sorted cocktails based on match ratio", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Gin", "Lime Juice"],
				mockCategories,
				mockAllIngredients,
			),
		);

		// Gimlet matches 2/2 = 1.0
		// Gin Tonic matches 1/2 = 0.5
		expect(result.current.sortedCocktails[0].name).toBe("Gimlet");
		expect(result.current.sortedCocktails[1].name).toBe("Gin Tonic");
	});

	it("should handle parent ingredient selection correctly", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Gin"],
				mockCategories,
				mockAllIngredients,
			),
		);

		// "Beefeater" is an actualName of "Gin"
		expect(result.current.isIngredientSelected("Beefeater")).toBe(true);
		expect(result.current.isIngredientSelected("Gin")).toBe(true);
		expect(result.current.isIngredientSelected("Lime Juice")).toBe(false);
	});

	it("should handle direct selection of actual names", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Beefeater"],
				mockCategories,
				mockAllIngredients,
			),
		);

		expect(result.current.isIngredientSelected("Beefeater")).toBe(true);
		// "Gin" is NOT selected if only "Beefeater" is in selectedIngredients (based on current logic)
		expect(result.current.isIngredientSelected("Gin")).toBe(false);
	});

	it("should sort cocktails with higher match ratio first", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Tonic Water"],
				mockCategories,
				mockAllIngredients,
			),
		);

		// Gimlet matches 0/2 = 0
		// Gin Tonic matches 1/2 = 0.5
		expect(result.current.sortedCocktails[0].name).toBe("Gin Tonic");
		expect(result.current.sortedCocktails[1].name).toBe("Gimlet");
	});
});
