import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { generateOriginalCocktail } from "../cocktail-generator";
import type { Cocktail } from "../../types/cocktail";

// fetchのモック
const mockFetch = vi.fn();

beforeEach(() => {
	global.fetch = mockFetch;
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("generateOriginalCocktail", () => {
	it("選択された材料に基づいてオリジナルカクテルを生成する", async () => {
		const selectedIngredients = ["ラム", "ライム"];
		const mockResponse: Cocktail = {
			id: "generated-123",
			name: "ラム & ライム オリジナル",
			description: "ラムとライムを使ったオリジナルカクテル",
			ingredients: [
				{ name: "ラム", amount: "適量" },
				{ name: "ライム", amount: "適量" },
			],
			instructions: ["材料を混ぜる"],
			garnish: "なし",
		};

		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => mockResponse,
		});

		const cocktail = await generateOriginalCocktail(selectedIngredients);

		expect(fetch).toHaveBeenCalledWith("/api/generate-cocktail", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ingredients: selectedIngredients }),
		});

		expect(cocktail.name).toBe("ラム & ライム オリジナル");
		expect(cocktail.ingredients).toHaveLength(2);
	});
});