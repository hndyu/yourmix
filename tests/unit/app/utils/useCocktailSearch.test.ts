import type { Category, Cocktail, Ingredient } from "@/app/types/cocktail";
import { useCocktailSearch } from "@/app/utils/useCocktailSearch";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const mockCategories: Category[] = [
	{ id: 1, name: "Spirits", sortOrder: 1, assetKey: null, description: null },
	{ id: 2, name: "Juice", sortOrder: 2, assetKey: null, description: null },
];

const mockAllIngredients: Ingredient[] = [
	{
		id: 101,
		name: "Gin",
		category: "Spirits",
		categoryName: "Spirits",
		actualNames: ["Dry Gin", "London Dry Gin"],
	},
	{
		id: 102,
		name: "Lime Juice",
		category: "Juice",
		categoryName: "Juice",
		actualNames: ["Fresh Lime Juice"],
	},
	{
		id: 103,
		name: "Vodka",
		category: "Spirits",
		categoryName: "Spirits",
		actualNames: [],
	},
];

const mockCocktails: Cocktail[] = [
	{
		id: "c1",
		name: "Gimlet",
		slug: "gimlet",
		description: "Classic",
		ingredients: [
			{ id: 101, name: "Gin", amount: "45ml", category: "Spirits" },
			{ id: 102, name: "Lime Juice", amount: "15ml", category: "Juice" },
		],
		instructions: [],
	},
	{
		id: "c2",
		name: "Vodka Gimlet",
		slug: "vodka-gimlet",
		description: "Vodka version",
		ingredients: [
			{ id: 103, name: "Vodka", amount: "45ml", category: "Spirits" },
			{ id: 102, name: "Lime Juice", amount: "15ml", category: "Juice" },
		],
		instructions: [],
	},
	{
		id: "c3",
		name: "Dry Gimlet",
		slug: "dry-gimlet",
		description: "Dry version",
		ingredients: [
			{ id: 101, name: "Dry Gin", amount: "45ml", category: "Spirits" },
			{ id: 102, name: "Lime Juice", amount: "15ml", category: "Juice" },
		],
		instructions: [],
	},
];

describe("useCocktailSearch", () => {
	it("should identify selected ingredients correctly (direct match)", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Gin"],
				mockCategories,
				mockAllIngredients,
			),
		);

		expect(result.current.isIngredientSelected("Gin")).toBe(true);
		expect(result.current.isIngredientSelected("Vodka")).toBe(false);
	});

	it("should identify selected ingredients correctly (group match for detail requirement)", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Gin"],
				mockCategories,
				mockAllIngredients,
			),
		);

		// "Dry Gin" is an actualName of "Gin".
		// Cocktail requires "Dry Gin", user selected "Gin". Should match.
		expect(result.current.isIngredientSelected("Dry Gin")).toBe(true);
	});

	it("should sort cocktails by match ratio", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Gin"],
				mockCategories,
				mockAllIngredients,
			),
		);

		// Gimlet matches 1/2 (Gin).
		// Vodka Gimlet matches 0/2.
		// Dry Gimlet matches 1/2 (Dry Gin matches via Gin selection).
		// Gimlet and Dry Gimlet should be first.
		const firstTwoNames = result.current.sortedCocktails
			.slice(0, 2)
			.map((c) => c.name);
		expect(firstTwoNames).toContain("Gimlet");
		expect(firstTwoNames).toContain("Dry Gimlet");
		expect(result.current.sortedCocktails[2].name).toBe("Vodka Gimlet");
	});

	it("should handle full match correctly", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Gin", "Lime Juice"],
				mockCategories,
				mockAllIngredients,
			),
		);

		// Gimlet matches 2/2.
		expect(result.current.sortedCocktails[0].name).toBe("Gimlet");
		expect(result.current.sortedCocktails[0].ingredients.length).toBe(2);
	});

	it("should handle detail selection correctly (preserving original behavior)", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(
				mockCocktails,
				["Dry Gin"],
				mockCategories,
				mockAllIngredients,
			),
		);

		// Direct match
		expect(result.current.isIngredientSelected("Dry Gin")).toBe(true);
		// Original behavior: selecting a detail does NOT match the group requirement
		expect(result.current.isIngredientSelected("Gin")).toBe(false);
	});

	it("should calculate ingredientSortOrderMap correctly", () => {
		const { result } = renderHook(() =>
			useCocktailSearch(mockCocktails, [], mockCategories, mockAllIngredients),
		);

		const ginOrder = result.current.ingredientSortOrderMap.get("Gin");
		expect(ginOrder).toBeDefined();
		expect(ginOrder?.categoryOrder).toBe(1); // Spirits

		const dryGinOrder = result.current.ingredientSortOrderMap.get("Dry Gin");
		expect(dryGinOrder).toEqual(ginOrder);
	});
});
