import { initAuth } from "@/app/auth";
import { getCocktailBySlug } from "@/app/lib/cocktail-data";
import RecipeDetailPage, { generateMetadata } from "@/app/recipes/[slug]/page";
import type { Cocktail } from "@/app/types/cocktail";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

// next/navigation のモック
const { notFound } = vi.hoisted(() => {
	return { notFound: vi.fn() };
});
vi.mock("next/navigation", () => ({
	notFound,
}));

// CocktailDisplay コンポーネントのモック
vi.mock("@/app/_components/cocktail-display", () => ({
	default: ({
		cocktail,
		isDetailPage,
	}: { cocktail: Cocktail; isDetailPage: boolean }) => (
		<div data-testid="cocktail-display">
			<h1>{cocktail.name}</h1>
			<p>{cocktail.description}</p>
			<p>Is Detail Page: {isDetailPage.toString()}</p>
		</div>
	),
}));

// app/lib/cocktail-data のモック
vi.mock("@/app/lib/cocktail-data", () => ({
	getCocktailBySlug: vi.fn(),
}));

// app/auth のモック
vi.mock("@/app/auth", () => ({
	initAuth: vi.fn(),
}));

// next/headers のモック
vi.mock("next/headers", () => ({
	headers: vi.fn(),
}));

const mockCocktail: Cocktail = {
	id: "1",
	slug: "gin-and-tonic",
	name: "Gin and Tonic",
	description: "A classic and refreshing cocktail.",
	ingredients: [
		{
			name: "Gin",
			amount: "45ml",
			id: 1,
			category: "category1",
		},
		{
			name: "Tonic Water",
			amount: "120ml",
			id: 2,
			category: "category2",
		},
	],
	instructions: ["Fill a glass with ice.", "Add gin and tonic water."],
};

const mockParams = { params: Promise.resolve({ slug: "gin-and-tonic" }) };

describe("Recipe Detail Page", () => {
	beforeEach(() => {
		// initAuth のデフォルトのモック動作を設定
		(initAuth as Mock).mockResolvedValue({
			api: {
				getSession: vi.fn().mockResolvedValue({
					user: { id: "test-user-id" },
				}),
			},
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("generateMetadata", () => {
		it("should generate correct metadata on successful fetch", async () => {
			(getCocktailBySlug as Mock).mockResolvedValue(mockCocktail);

			const metadata = await generateMetadata(mockParams);

			expect(metadata.title).toBe("Gin and Tonicのレシピ");
			expect(metadata.description).toBe(
				"Gin and Tonicの作り方と材料を紹介します。A classic and refreshing cocktail.",
			);
		});

		it("should call notFound on null result (404)", async () => {
			(getCocktailBySlug as Mock).mockResolvedValue(null);

			try {
				await generateMetadata(mockParams);
			} catch (error) {
				// notFound() throws internally
			}
			expect(notFound).toHaveBeenCalledTimes(1);
		});

		it("should throw an error on failed fetch", async () => {
			(getCocktailBySlug as Mock).mockRejectedValue(
				new Error("Database error"),
			);

			await expect(generateMetadata(mockParams)).rejects.toThrow(
				"Database error",
			);
		});
	});

	describe("RecipeDetailPage Component", () => {
		it("should render cocktail details on successful fetch", async () => {
			(getCocktailBySlug as Mock).mockResolvedValue(mockCocktail);

			const Page = await RecipeDetailPage(mockParams);
			render(Page);

			// パンくずリストの確認
			expect(screen.getByText("ホーム")).toBeInTheDocument();
			const cocktailNameElements = screen.getAllByText("Gin and Tonic");
			expect(cocktailNameElements.length).toBeGreaterThan(0);

			// モック化したCocktailDisplayが表示されていることを確認
			const cocktailDisplay = screen.getByTestId("cocktail-display");
			expect(cocktailDisplay).toBeInTheDocument();
			expect(
				await screen.findByRole("heading", { name: "Gin and Tonic" }),
			).toBeInTheDocument();
			expect(
				screen.getByText("A classic and refreshing cocktail."),
			).toBeInTheDocument();
			expect(screen.getByText("Is Detail Page: true")).toBeInTheDocument();

			// JSON-LDスクリプトの確認
			const script = document.querySelector(
				'script[type="application/ld+json"]',
			);
			expect(script).not.toBeNull();
			const jsonLd = JSON.parse(script?.textContent ?? "[]");
			expect(jsonLd).toHaveLength(2);
			expect(jsonLd[0]["@type"]).toBe("Recipe");
			expect(jsonLd[0].name).toBe("Gin and Tonic");
			expect(jsonLd[1]["@type"]).toBe("BreadcrumbList");
		});

		it("should call notFound on null result (404)", async () => {
			(getCocktailBySlug as Mock).mockResolvedValue(null);

			try {
				await RecipeDetailPage(mockParams);
			} catch (error) {
				// notFound() throws internally
			}
			expect(notFound).toHaveBeenCalledTimes(1);
		});

		it("should throw an error on failed fetch", async () => {
			(getCocktailBySlug as Mock).mockRejectedValue(
				new Error("Database error"),
			);

			await expect(RecipeDetailPage(mockParams)).rejects.toThrow(
				"Database error",
			);
		});
	});
});
