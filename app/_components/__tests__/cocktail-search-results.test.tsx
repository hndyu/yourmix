import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Category, Cocktail, Ingredient } from "../../types/cocktail";
import CocktailSearchResults from "../cocktail-search-results";

// next/linkのモック
vi.mock("next/link", () => ({
	default: ({
		children,
		href,
	}: {
		children: React.ReactNode;
		href: string;
	}) => <a href={href}>{children}</a>,
}));

// モックデータ
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
			}, // idがない材料
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

	it("検索結果が0件の場合にメッセージを表示する", () => {
		renderComponent({ cocktails: [] });
		expect(screen.getByText("🔍 検索結果")).toBeInTheDocument();
		expect(
			screen.getByText(
				"選択された材料にマッチするレシピが見つかりませんでした。",
			),
		).toBeInTheDocument();
	});

	it("検索結果をカード形式で表示する", () => {
		renderComponent({});
		expect(screen.getByText("🔍 検索結果 (3件)")).toBeInTheDocument();
		const cocktailCards = screen.getAllByRole("heading", { level: 3 });
		expect(cocktailCards).toHaveLength(3);
		expect(screen.getByText("🍹 ギムレット")).toBeInTheDocument();
		expect(screen.getByText("🍹 ウイスキー・サワー")).toBeInTheDocument();
		expect(screen.getByText("🍹 スクリュードライバー")).toBeInTheDocument();
	});

	it("選択材料とのマッチ率でカクテルをソートする", () => {
		// ギムレット: 1/2 (ジン)
		// スクリュードライバー: 1/2 (ウォッカ)
		// ウイスキー・サワー: 0/3
		renderComponent({ selectedIngredients: ["ジン", "ウォッカ"] });

		// 各カードのルート要素を取得 (MuiCard-rootクラスを持つ要素)
		const cards = document.querySelectorAll(".MuiCard-root");
		expect(cards).toHaveLength(3);
		// ギムレットとスクリュードライバーが先頭に来る (比率が同じなので元の順序)
		const card1 = cards[0];
		if (card1 instanceof HTMLElement) {
			expect(within(card1).getByText("🍹 ギムレット")).toBeInTheDocument();
		}

		const card2 = cards[1];
		if (card2 instanceof HTMLElement) {
			expect(
				within(card2).getByText("🍹 スクリュードライバー"),
			).toBeInTheDocument();
		}

		const card3 = cards[2];
		if (card3 instanceof HTMLElement) {
			expect(
				within(card3).getByText("🍹 ウイスキー・サワー"),
			).toBeInTheDocument();
		}
	});

	it("マッチ率が高いカクテルを先に表示する", () => {
		// ウイスキー・サワー: 2/3 (ウイスキー, ライムジュース) -> 0.66
		// ギムレット: 1/2 (ライムジュース) -> 0.5
		// スクリュードライバー: 0/2
		renderComponent({ selectedIngredients: ["ウイスキー", "ライムジュース"] });

		const cards = document.querySelectorAll(".MuiCard-root");
		expect(cards).toHaveLength(3);
		const card1 = cards[0];
		if (card1 instanceof HTMLElement) {
			expect(
				within(card1).getByText("🍹 ウイスキー・サワー"),
			).toBeInTheDocument();
		}

		const card2 = cards[1];
		if (card2 instanceof HTMLElement) {
			expect(within(card2).getByText("🍹 ギムレット")).toBeInTheDocument();
		}

		const card3 = cards[2];
		if (card3 instanceof HTMLElement) {
			expect(
				within(card3).getByText("🍹 スクリュードライバー"),
			).toBeInTheDocument();
		}
	});

	it("カード内の材料がカテゴリ順・グループ順でソートされる", () => {
		renderComponent({ cocktails: [mockCocktails[1]] }); // ウイスキー・サワーのみ

		const card = document.querySelector(".MuiCard-root");
		if (!card) {
			throw new Error("Card not found");
		}
		// Chipコンポーネントのラベル部分をクラス名で取得する
		const ingredientLabels = (card as HTMLElement).querySelectorAll(
			".MuiChip-label",
		);

		// 期待される順序: バーボン・ウイスキー(蒸留酒, sort 3) -> ライムジュース(ジュース, sort 21) -> 砂糖(idなし)
		expect(ingredientLabels[0]).toHaveTextContent("バーボン・ウイスキー");
		expect(ingredientLabels[1]).toHaveTextContent("ライムジュース");
		expect(ingredientLabels[2]).toHaveTextContent("砂糖");
	});

	it("選択された材料を 'filled' スタイルで表示する", () => {
		renderComponent({ selectedIngredients: ["ジン"] });

		const gimletCard = screen
			.getByText("🍹 ギムレット")
			.closest("[class*='MuiCard-root']");
		if (!(gimletCard instanceof HTMLElement)) {
			throw new Error("Gimlet card not found or is not an HTMLElement");
		}
		const ginChip = within(gimletCard).getByText("ジン");
		const limeChip = within(gimletCard).getByText("ライムジュース");

		// MUIのクラスで判定 (variant="filled" -> MuiChip-filled, variant="outlined" -> MuiChip-outlined)
		expect(ginChip.className).toContain("MuiChip-filled");
		expect(ginChip.className).not.toContain("MuiChip-outlined");
		expect(limeChip.className).toContain("MuiChip-outlined");
	});

	it("グループ化された材料が選択された場合、その子の材料も選択済みとして表示する", () => {
		// 「ウイスキー」を選択した場合、「バーボン・ウイスキー」も選択済み扱いになる
		renderComponent({ selectedIngredients: ["ウイスキー"] });

		const whiskeySourCard = screen
			.getByText("🍹 ウイスキー・サワー")
			.closest("[class*='MuiCard-root']");
		if (!(whiskeySourCard instanceof HTMLElement)) {
			throw new Error("Whiskey Sour card not found or is not an HTMLElement");
		}
		const bourbonChip = within(whiskeySourCard).getByText(
			"バーボン・ウイスキー",
		);
		expect(bourbonChip.className).toContain("MuiChip-filled");
	});

	it("詳細ページへの正しいリンクを持つ", () => {
		renderComponent({});
		const link = screen.getAllByText("詳細を見る")[0] as HTMLAnchorElement;
		expect(link.href).toContain("/recipes/gimlet");
	});

	it("show=falseの場合、コンポーネントは表示されない", () => {
		const { container } = renderComponent({ show: false });

		// Fadeコンポーネントが in={false} になるため、子要素はDOMに存在するが非表示になる
		// opacity: 0 で判定
		const box = container.firstChild as HTMLElement;
		expect(box).toBeInTheDocument();
		expect(box.style.opacity).toBe("0");
	});

	it("材料にIDがない場合でもエラーなく表示する", () => {
		renderComponent({ cocktails: [mockCocktails[1]] }); // ウイスキー・サワー

		const card = document.querySelector(".MuiCard-root");
		if (!card) {
			throw new Error("Card not found");
		}
		// "砂糖" は id を持たない
		const sugarChip = within(card as HTMLElement).getByText("砂糖");
		expect(sugarChip).toBeInTheDocument();
		// 選択されていないので outlined
		expect(sugarChip.className).toContain("MuiChip-outlined"); // 砂糖は選択されていないのでoutlined
	});
});
