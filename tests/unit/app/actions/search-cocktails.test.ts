import { searchCocktailsAction } from "@/app/actions/search-cocktails";
import { searchCocktailsByIngredients } from "@/app/lib/cocktail-search";
import type { Cocktail } from "@/app/types/cocktail";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/lib/cocktail-search", () => ({
	searchCocktailsByIngredients: vi.fn(),
}));

describe("search-cocktails actions", () => {
	const mockCocktails: Cocktail[] = [
		{
			id: "1",
			name: "Cocktail 1",
			slug: "cocktail-1",
			description: "Desc 1",
			ingredients: [],
			instructions: ["Step 1"],
			imageUrl: "img1",
		},
		{
			id: "2",
			name: "Cocktail 2",
			slug: "cocktail-2",
			description: "Desc 2",
			ingredients: [],
			instructions: ["Step 2"],
			imageUrl: "img2",
		},
	];

	describe("searchCocktailsAction", () => {
		it("should return mock data when mock option is true", async () => {
			const ingredientIds = [1, 2];
			const result = await searchCocktailsAction(ingredientIds, {
				mock: true,
				mockData: mockCocktails,
			});

			expect(result).toEqual(mockCocktails);
			expect(searchCocktailsByIngredients).not.toHaveBeenCalled();
		});

		it("should return empty array if mock is true but no mockData provided", async () => {
			const result = await searchCocktailsAction([1], { mock: true });
			expect(result).toEqual([]);
		});

		it("should call searchCocktailsByIngredients when mock is false or not provided", async () => {
			const ingredientIds = [1, 2];
			vi.mocked(searchCocktailsByIngredients).mockResolvedValueOnce(
				mockCocktails,
			);

			const result = await searchCocktailsAction(ingredientIds);

			expect(searchCocktailsByIngredients).toHaveBeenCalledWith(ingredientIds);
			expect(result).toEqual(mockCocktails);
		});
	});
});
