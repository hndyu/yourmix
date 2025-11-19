import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type Mock,
} from "vitest";
import { render, screen } from "@testing-library/react";
import RecipeDetailPage, { generateMetadata } from "../page";
import type { Cocktail } from "../../../types/cocktail";

// next/navigation のモック
const { notFound } = vi.hoisted(() => {
	return { notFound: vi.fn() };
});
vi.mock("next/navigation", () => ({
	notFound,
}));

// CocktailDisplay コンポーネントのモック
vi.mock("../../../_components/cocktail-display", () => ({
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
		// 各テストの前に fetch をモック
		global.fetch = vi.fn();
	});

	afterEach(() => {
		// 各テストの後にモックをクリア
		vi.restoreAllMocks();
	});

	describe("generateMetadata", () => {
		it("should generate correct metadata on successful fetch", async () => {
			(fetch as Mock).mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => ({ cocktail: mockCocktail }),
			});

			const metadata = await generateMetadata(mockParams);

			expect(metadata.title).toBe("Gin and Tonicのレシピ");
			expect(metadata.description).toBe(
				"Gin and Tonicの作り方と材料を紹介します。A classic and refreshing cocktail.",
			);
		});

		it("should call notFound on 404 fetch", async () => {
			(fetch as Mock).mockResolvedValue({
				ok: false,
				status: 404,
			});

			try {
				await generateMetadata(mockParams);
			} catch (error) {
				// notFound() は内部的にエラーをスローするため、それをキャッチします。
			}
			expect(notFound).toHaveBeenCalledTimes(1);
		});

		it("should throw an error on non-404 failed fetch", async () => {
			(fetch as Mock).mockResolvedValue({
				ok: false,
				status: 500,
			});

			await expect(generateMetadata(mockParams)).rejects.toThrow(
				"レシピの取得に失敗しました。",
			);
		});
	});

	describe("RecipeDetailPage Component", () => {
		it("should render cocktail details on successful fetch", async () => {
			(fetch as Mock).mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => ({ cocktail: mockCocktail }),
			});

			const Page = await RecipeDetailPage(mockParams);
			render(Page);

			// パンくずリストの確認
			expect(screen.getByText("ホーム")).toBeInTheDocument();
			// パンくずリストとカクテル名で複数存在するため getAllByText を使用
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

		it("should call notFound on 404 fetch", async () => {
			(fetch as Mock).mockResolvedValue({
				ok: false,
				status: 404,
			});

			try {
				await RecipeDetailPage(mockParams);
			} catch (error) {
				// notFound() は内部的にエラーをスローするため、それをキャッチします。
			}
			expect(notFound).toHaveBeenCalledTimes(1);
		});

		it("should throw an error on non-404 failed fetch", async () => {
			(fetch as Mock).mockResolvedValue({
				ok: false,
				status: 500,
			});

			await expect(RecipeDetailPage(mockParams)).rejects.toThrow(
				"レシピの取得に失敗しました。",
			);
		});
	});
});
