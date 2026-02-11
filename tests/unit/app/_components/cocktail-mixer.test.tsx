import CocktailMixer from "@/app/_components/cocktail-mixer";
import type { Cocktail } from "@/app/types/cocktail";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

// カスタムフックのモック
const mockUseCocktails: {
	cocktails: Cocktail[];
	isLoading: boolean;
	searchCocktails: Mock;
} = {
	cocktails: [],
	isLoading: false,
	searchCocktails: vi.fn(),
};

const mockUseAICocktailGenerator: {
	generatedCocktail: Cocktail | null;
	isGenerating: boolean;
	generateCocktail: Mock;
	clearGeneratedCocktail: Mock;
} = {
	generatedCocktail: null,
	isGenerating: false,
	generateCocktail: vi.fn(),
	clearGeneratedCocktail: vi.fn(),
};

vi.mock("@/app/utils/useCocktails", () => ({
	useCocktails: () => mockUseCocktails,
}));
vi.mock("@/app/utils/useAICocktailGenerator", () => ({
	useAICocktailGenerator: () => mockUseAICocktailGenerator,
}));

// 子コンポーネントのモック
vi.mock("@/app/_components/mix-section", () => ({
	default: ({
		onMixClick,
		onIngredientsChange,
		isMixing,
		isInitialLoading,
	}: {
		onMixClick: () => void;
		onIngredientsChange: (ids: number[], names: string[]) => void;
		isMixing: boolean;
		isInitialLoading: boolean;
	}) => (
		<div>
			<h2>MixSection</h2>
			<button
				type="button"
				data-testid="mix-button"
				onClick={onMixClick}
				disabled={isMixing || isInitialLoading}
			>
				Mix!
			</button>
			<button
				type="button"
				data-testid="select-ingredient"
				onClick={() => onIngredientsChange([1], ["ジン"])}
			>
				Select Gin
			</button>
			{isInitialLoading && <span>Initial Loading...</span>}
			{isMixing && <span>Mixing...</span>}
		</div>
	),
}));
vi.mock("@/app/_components/cocktail-display", () => ({
	default: ({
		cocktail,
		onRemove,
	}: { cocktail: Cocktail; onRemove: () => void }) => (
		<div>
			<h2>Generated Cocktail: {cocktail.name}</h2>
			<button type="button" data-testid="remove-cocktail" onClick={onRemove}>
				Remove
			</button>
		</div>
	),
}));
vi.mock("@/app/_components/cocktail-search-results", () => ({
	default: ({ cocktails }: { cocktails: Cocktail[] }) => (
		<div>
			<h2>Search Results: {cocktails.length}</h2>
		</div>
	),
}));
vi.mock("@/app/_components/cocktail-display-skeleton", () => ({
	default: () => <div>Cocktail Skeleton</div>,
}));

// --- Tests ---

describe("CocktailMixer", () => {
	const mockIngredients = [
		{
			id: 1,
			name: "ジン",
			category: "spirit",
			categoryName: "スピリッツ",
		},
	];
	const mockCategories = [
		{
			id: 1,
			name: "スピリッツ",
			sortOrder: 1,
			assetKey: null,
			description: null,
		},
	];
	const mockGeneratedCocktail = {
		id: "101",
		name: "AIジンソニック",
		slug: "ai-gin-sonic",
		description: "AIによって生成された特別なカクテルです。",
		ingredients: [],
		instructions: [],
	};
	const mockSearchResults = [
		{
			id: "201",
			name: "ジントニック",
			slug: "gin-and-tonic",
			description: "ジントニックの説明",
			ingredients: [],
			instructions: [],
		},
	];
	const defaultProps = {
		initialIngredients: mockIngredients,
		initialCategories: mockCategories,
	};

	beforeEach(() => {
		// スクロールのモック
		window.HTMLElement.prototype.scrollIntoView = vi.fn();

		// フックの戻り値をリセット
		mockUseCocktails.cocktails = [];
		mockUseCocktails.isLoading = false;
		mockUseAICocktailGenerator.generatedCocktail = null;
		mockUseAICocktailGenerator.isGenerating = false;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("材料を選択しMixボタンを押すと、カクテル生成と検索が実行される", () => {
		render(<CocktailMixer {...defaultProps} />);

		// 材料を選択
		fireEvent.click(screen.getByTestId("select-ingredient"));

		// Mixボタンをクリック
		fireEvent.click(screen.getByTestId("mix-button"));

		// カスタムフックの関数が正しい引数で呼ばれたか確認
		expect(mockUseCocktails.searchCocktails).toHaveBeenCalledWith([1]);
		expect(mockUseAICocktailGenerator.generateCocktail).toHaveBeenCalledWith([
			"ジン",
		]);
	});

	it("検索中(isSearching=true)にスケルトンを表示する", async () => {
		// isSearchingをtrueに設定してレンダリング
		mockUseCocktails.isLoading = true;
		render(<CocktailMixer {...defaultProps} />);

		await waitFor(() => {
			// isMixingがtrueになり、スケルトンが表示されることを確認
			expect(screen.getByText("Cocktail Skeleton")).toBeInTheDocument();
		});
	});

	it("AI生成中(isGenerating=true)にスケルトンを表示する", async () => {
		// isGeneratingをtrueに設定してレンダリング
		mockUseAICocktailGenerator.isGenerating = true;
		render(<CocktailMixer {...defaultProps} />);

		await waitFor(() => {
			// isMixingがtrueになり、スケルトンが表示されることを確認
			expect(screen.getByText("Cocktail Skeleton")).toBeInTheDocument();
		});
	});

	it("カクテル生成と検索が完了したら結果を表示する", async () => {
		const { rerender } = render(<CocktailMixer {...defaultProps} />);

		// 材料を選択してMix
		fireEvent.click(screen.getByTestId("select-ingredient"));
		fireEvent.click(screen.getByTestId("mix-button"));

		// 結果が返ってきた状態をシミュレート
		mockUseAICocktailGenerator.generatedCocktail = mockGeneratedCocktail;
		mockUseCocktails.cocktails = mockSearchResults;

		// モックの値を反映させるために再レンダリング
		rerender(<CocktailMixer {...defaultProps} />);

		// 結果が表示されていることを確認
		await waitFor(() => {
			expect(
				screen.getByText(`Generated Cocktail: ${mockGeneratedCocktail.name}`),
			).toBeInTheDocument();
			expect(
				screen.getByText(`Search Results: ${mockSearchResults.length}`),
			).toBeInTheDocument();
		});

		// スクロールが呼ばれたことを確認
		expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
		});
	});
});
