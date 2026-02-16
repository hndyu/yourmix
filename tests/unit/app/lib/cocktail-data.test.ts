import { type DB, getDb } from "@/app/db/db";
import { getCocktailBySlug } from "@/app/lib/cocktail-data";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/db/db", () => ({
	getDb: vi.fn(),
}));

describe("getCocktailBySlug", () => {
	const mockCocktail = {
		id: "cocktail-1",
		name: "Martini",
		slug: "martini",
		description: "Strong and classic",
		cocktailIngredients: [
			{
				ingredient: {
					id: 1,
					name: "Gin",
					group: { category: { name: "Spirits" } },
				},
				amount: "60ml",
			},
		],
		instructions: [{ text: "Stir with ice" }],
		cocktailTags: [{ tag: { name: "Classic" } }],
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return cocktail data with likes for authenticated user", async () => {
		const mockDb = {
			query: {
				cocktails: {
					findFirst: vi.fn().mockResolvedValue({
						...mockCocktail,
						deliciousCount: 5,
						isLiked: 1,
					}),
				},
			},
		};
		vi.mocked(getDb).mockResolvedValue(mockDb as unknown as DB);

		const result = await getCocktailBySlug("martini", "user-1");

		expect(result).toBeDefined();
		expect(result?.name).toBe("Martini");
		expect(result?.deliciousCount).toBe(5);
		expect(result?.isLiked).toBe(true);
		expect(mockDb.query.cocktails.findFirst).toHaveBeenCalled();
	});

	it("should return cocktail data for unauthenticated user", async () => {
		const mockDb = {
			query: {
				cocktails: {
					findFirst: vi.fn().mockResolvedValue({
						...mockCocktail,
						deliciousCount: 3,
						isLiked: 0,
					}),
				},
			},
		};
		vi.mocked(getDb).mockResolvedValue(mockDb as unknown as DB);

		const result = await getCocktailBySlug("martini");

		expect(result).toBeDefined();
		expect(result?.deliciousCount).toBe(3);
		expect(result?.isLiked).toBe(false);
	});

	it("should return null if cocktail not found", async () => {
		const mockDb = {
			query: {
				cocktails: {
					findFirst: vi.fn().mockResolvedValue(null),
				},
			},
		};
		vi.mocked(getDb).mockResolvedValue(mockDb as unknown as DB);

		const result = await getCocktailBySlug("unknown");

		expect(result).toBeNull();
	});
});
