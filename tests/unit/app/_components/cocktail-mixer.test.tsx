import CocktailMixer from "@/app/_components/cocktail-mixer";
import type { Cocktail, GeneratedCocktail } from "@/app/types/cocktail";
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
	generatedCocktail: GeneratedCocktail | null;
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
		showCompletionBar,
	}: {
		onMixClick: () => void;
		onIngredientsChange: (ids: number[], names: string[]) => void;
		isMixing: boolean;
		isInitialLoading: boolean;
		showCompletionBar?: boolean;
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
			{showCompletionBar && <span>Completion Bar Visible</span>}
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
vi.mock("@/app/_components/completion-bar", () => ({
	default: ({
		isGenerating,
		onViewClick,
	}: { isGenerating: boolean; onViewClick: () => void }) => (
		<div data-testid="completion-bar">
			{isGenerating ? (
				<span>バーテンダーがカクテルを考案中…</span>
			) : (
				<>
					<span>オリジナルカクテルが完成しました！</span>
					<button
						type="button"
						data-testid="view-cocktail"
						onClick={onViewClick}
					>
						見る
					</button>
				</>
			)}
		</div>
	),
}));
vi.mock("@/app/_components/cocktail-dialog", () => ({
	default: ({
		cocktail,
		open,
		onClose,
	}: {
		cocktail: GeneratedCocktail | null;
		open: boolean;
		onClose: () => void;
	}) =>
		open && cocktail ? (
			<div data-testid="cocktail-dialog">
				<h2>Generated Cocktail: {cocktail.name}</h2>
				<button type="button" data-testid="close-dialog" onClick={onClose}>
					閉じる
				</button>
			</div>
		) : null,
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
		name: "AIジンソニック",
		description: "AIによって生成された特別なカクテルです。",
		ingredients: [{ name: "Gin", amount: "45ml" }],
		instructions: ["Mix ingredients"],
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

	it("材料を選択しMixボタンを押すと、カクテル生成と検索が実行される", async () => {
		render(<CocktailMixer {...defaultProps} />);

		// 材料を選択
		fireEvent.click(screen.getByTestId("select-ingredient"));

		// Mixボタンをクリック
		fireEvent.click(screen.getByTestId("mix-button"));

		// カスタムフックの関数が正しい引数で呼ばれたか確認
		await waitFor(() => {
			expect(mockUseCocktails.searchCocktails).toHaveBeenCalledWith([1]);
			expect(mockUseAICocktailGenerator.generateCocktail).toHaveBeenCalledWith([
				"ジン",
			]);
		});
	});

	it("AI生成中に通知バーで実況メッセージを表示する", async () => {
		// isGeneratingをtrueに設定してレンダリング
		mockUseAICocktailGenerator.isGenerating = true;
		render(<CocktailMixer {...defaultProps} />);

		await waitFor(() => {
			// 通知バーが表示されることを確認
			expect(screen.getByTestId("completion-bar")).toBeInTheDocument();
			expect(
				screen.getByText("バーテンダーがカクテルを考案中…"),
			).toBeInTheDocument();
		});
	});

	it("AI生成完了後に完成メッセージと「見る」ボタンを表示する", async () => {
		// 生成完了状態をシミュレート
		mockUseAICocktailGenerator.generatedCocktail = mockGeneratedCocktail;
		mockUseAICocktailGenerator.isGenerating = false;
		render(<CocktailMixer {...defaultProps} />);

		await waitFor(() => {
			expect(
				screen.getByText("オリジナルカクテルが完成しました！"),
			).toBeInTheDocument();
			expect(screen.getByTestId("view-cocktail")).toBeInTheDocument();
		});
	});

	it("「見る」ボタンでモーダルを開き、閉じるボタンで閉じられる", async () => {
		// 生成完了状態をシミュレート
		mockUseAICocktailGenerator.generatedCocktail = mockGeneratedCocktail;
		mockUseAICocktailGenerator.isGenerating = false;
		render(<CocktailMixer {...defaultProps} />);

		// 「見る」ボタンをクリック
		fireEvent.click(screen.getByTestId("view-cocktail"));

		// モーダルが開くことを確認
		await waitFor(() => {
			expect(screen.getByTestId("cocktail-dialog")).toBeInTheDocument();
			expect(
				screen.getByText(`Generated Cocktail: ${mockGeneratedCocktail.name}`),
			).toBeInTheDocument();
		});

		// 閉じるボタンをクリック
		fireEvent.click(screen.getByTestId("close-dialog"));

		// モーダルが閉じることを確認
		await waitFor(() => {
			expect(screen.queryByTestId("cocktail-dialog")).not.toBeInTheDocument();
		});
	});

	it("検索結果が表示されたらスクロールする", async () => {
		const { rerender } = render(<CocktailMixer {...defaultProps} />);

		// 初期状態ではスクロールされない
		expect(window.HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();

		// 材料を選択してMix
		fireEvent.click(screen.getByTestId("select-ingredient"));
		fireEvent.click(screen.getByTestId("mix-button"));

		// 検索の完了をシミュレート (searchPromise.finally で showSearchResults が true になる)
		// 実際の実装では searchPromise.finally 内で setShowSearchResults(true) されるため、
		// テストでは rerender で showSearchResults の反映を待つ必要がある。
		// しかし showSearchResults は内部状態なので直接は操作できない。
		// 代わりに、検索が完了したことを擬似的に表現するために、searchResults を更新して rerender する。
		mockUseCocktails.cocktails = mockSearchResults;
		rerender(<CocktailMixer {...defaultProps} />);

		// 検索結果が表示される（＝showSearchResultsがtrueになる）まで待ち、スクロールを確認
		await waitFor(() => {
			expect(
				screen.getByText(`Search Results: ${mockSearchResults.length}`),
			).toBeInTheDocument();
			expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
				behavior: "smooth",
			});
		});
	});
});
