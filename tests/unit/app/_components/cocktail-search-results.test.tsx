import CocktailSearchResults from "@/app/_components/cocktail-search-results";
import type { Category, Cocktail, Ingredient } from "@/app/types/cocktail";
import { cleanup, render, screen, within } from "@testing-library/react";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock next/link
vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		className,
	}: {
		children: React.ReactNode;
		href: string;
		className?: string; // Add className
	}) => (
		<a href={href} className={className} data-testid="cocktail-card">
			{children}
		</a>
	),
}));

// Mock next/image
vi.mock("next/image", () => ({
	default: ({ src, alt }: { src: string; alt: string }) => (
		<img src={src} alt={alt} />
	),
}));

// Mock data
const mockCategories: Category[] = [
	{ id: 1, name: "蒸留酒", sortOrder: 1, icon: "Liquor", description: "..." },
	{
		id: 2,
		name: "リキュール",
		sortOrder: 2,
		icon: "Liquor",
		description: "...",
	},
	{
		id: 3,
		name: "ジュース",
		sortOrder: 10,
		icon: "Liquor",
		description: "...",
	},
];

const mockAllIngredients: Ingredient[] = [
	{
		id: 101,
		name: "ジン",
		category: "蒸留酒",
		sortOrder: 1,
		actualNames: [],
	},
	{
		id: 102,
		name: "ウォッカ",
		category: "蒸留酒",
		sortOrder: 2,
		actualNames: [],
	},
	{
		id: 103,
		name: "ウイスキー",
		category: "蒸留酒",
		sortOrder: 3,
		actualNames: ["スコッチ・ウイスキー", "バーボン・ウイスキー"],
	},
	{
		id: 201,
		name: "オレンジ・リキュール",
		category: "リキュール",
		sortOrder: 10,
		actualNames: [],
	},
	{
		id: 301,
		name: "オレンジジュース",
		category: "ジュース",
		sortOrder: 20,
		actualNames: [],
	},
	{
		id: 302,
		name: "ライムジュース",
		category: "ジュース",
		sortOrder: 21,
		actualNames: [],
	},
];

const mockCocktails: Cocktail[] = [
	{
		id: "c1",
		name: "ギムレット",
		slug: "gimlet",
		description: "ジンベースのショートカクテル",
		ingredients: [
			{
				id: 101,
				name: "ジン",
				amount: "45ml",
				category: "蒸留酒",
			},
			{
				id: 302,
				name: "ライムジュース",
				amount: "15ml",
				category: "ジュース",
			},
		],
		instructions: [],
		tags: [],
	},
	{
		id: "c2",
		name: "ウイスキー・サワー",
		slug: "whiskey-sour",
		description: "ウイスキーベースのカクテル",
		ingredients: [
			{
				id: 103,
				name: "バーボン・ウイスキー",
				amount: "45ml",
				category: "蒸留酒",
			},
			{
				id: 302,
				name: "ライムジュース",
				amount: "20ml",
				category: "ジュース",
			},
			{
				name: "砂糖",
				amount: "1tsp",
				id: 0,
				category: "",
			}, // no id
		],
		instructions: [],
		tags: [],
	},
	{
		id: "c3",
		name: "スクリュードライバー",
		slug: "screwdriver",
		description: "ウォッカベースのロングカクテル",
		ingredients: [
			{
				id: 102,
				name: "ウォッカ",
				amount: "45ml",
				category: "蒸留酒",
			},
			{
				id: 301,
				name: "オレンジジュース",
				amount: "適量",
				category: "ジュース",
			},
		],
		instructions: [],
		tags: [],
	},
];

const renderComponent = (
	props: Partial<React.ComponentProps<typeof CocktailSearchResults>>,
) => {
	const defaultProps: React.ComponentProps<typeof CocktailSearchResults> = {
		cocktails: mockCocktails,
		selectedIngredients: [],
		categories: mockCategories,
		allIngredients: mockAllIngredients,
		show: true,
	};
	return render(<CocktailSearchResults {...defaultProps} {...props} />);
};

describe("CocktailSearchResults", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders message when no results found", () => {
		renderComponent({ cocktails: [] });
		expect(
			screen.getByText("レシピが見つかりませんでした"),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/選択された材料の組み合わせではレシピが見つかりませんでした/,
			),
		).toBeInTheDocument();
	});

	it("renders search results as cards", () => {
		renderComponent({});
		expect(screen.getByText(/検索結果 \(3件\)/)).toBeInTheDocument();
		const cocktailCards = screen.getAllByTestId("cocktail-card");
		expect(cocktailCards).toHaveLength(3);
		expect(screen.getByText("ギムレット")).toBeInTheDocument();
		expect(screen.getByText("ウイスキー・サワー")).toBeInTheDocument();
		expect(screen.getByText("スクリュードライバー")).toBeInTheDocument();
	});

	it("sorts cocktails by match rate", () => {
		renderComponent({ selectedIngredients: ["ジン", "ウォッカ"] });

		const cards = screen.getAllByTestId("cocktail-card");
		expect(cards).toHaveLength(3);

		// Gimlet (Gin) and Screwdriver (Vodka) match 1/2. Whiskey Sour (0/3).
		// We expect Gimlet or Screwdriver first.
		const firstCardName = within(cards[0]).getByRole("heading", {
			level: 3,
		}).textContent;
		expect(["ギムレット", "スクリュードライバー"]).toContain(firstCardName);
	});

	it("displays selected ingredients with distinct style (filled)", () => {
		renderComponent({ selectedIngredients: ["ジン"] });

		const gimletCard = screen.getByText("ギムレット").closest("a");
		if (!gimletCard) throw new Error("Gimlet card not found");

		const ginChip = within(gimletCard).getByText("ジン");
		const limeChip = within(gimletCard).getByText("ライムジュース");

		// Selected (Gin): bg-primary/20 (contains 'bg-primary/20')
		expect(ginChip.className).toContain("bg-primary/20");

		// Not selected (Lime): bg-stone-950
		expect(limeChip.className).toContain("bg-stone-950");
	});

	it("treats grouped ingredients as selected", () => {
		// "ウイスキー" matches "バーボン・ウイスキー" via group logic (mocked here by assuming logic holds)
		renderComponent({ selectedIngredients: ["ウイスキー"] });

		const whiskeySourCard = screen.getByText("ウイスキー・サワー").closest("a");
		if (!whiskeySourCard) throw new Error("Whiskey Sour card not found");

		const bourbonChip = within(whiskeySourCard).getByText(
			"バーボン・ウイスキー",
		);
		expect(bourbonChip.className).toContain("bg-primary/20");
	});

	it("links to correct detail page", () => {
		renderComponent({});
		const gimletLink = screen.getByText("ギムレット").closest("a");
		expect(gimletLink).toHaveAttribute("href", "/recipes/gimlet");
	});

	it("renders nothing when show=false", () => {
		const { container } = renderComponent({ show: false });
		expect(container).toBeEmptyDOMElement();
	});
});
