import IngredientSelector from "@/app/_components/ingredient-selector";
import type { Category, Ingredient } from "@/app/types/cocktail";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, test, vi } from "vitest";

// モックデータ
const mockCategories: Category[] = [
	{
		id: 1,
		name: "スピリッツ",
		sortOrder: 1,
		description: "蒸留酒",
		icon: null,
	},
	{
		id: 2,
		name: "リキュール",
		sortOrder: 2,
		description: "混成酒",
		icon: null,
	},
];

const mockIngredients: Ingredient[] = [
	{
		id: 1,
		name: "ジン",
		category: "スピリッツ",
		categoryName: "スピリッツ",
		actualNames: ["ジン"],
		actualIds: [1],
		sortOrder: 1,
	},
	{
		id: 2,
		name: "ウォッカ",
		category: "スピリッツ",
		categoryName: "スピリッツ",
		actualNames: ["ウォッカ"],
		actualIds: [2],
		sortOrder: 2,
	},
	{
		id: 3,
		name: "カシスリキュール",
		category: "リキュール",
		categoryName: "リキュール",
		actualNames: ["カシスリキュール"],
		actualIds: [3],
		sortOrder: 3,
	},
	{
		id: 4,
		name: "ピーチリキュール",
		category: "リキュール",
		categoryName: "リキュール",
		actualNames: ["ピーチリキュール"],
		actualIds: [4],
		sortOrder: 4,
	},
	{
		id: 5,
		name: "オレンジジュース",
		category: "その他",
		categoryName: "その他",
		actualNames: ["オレンジジュース"],
		actualIds: [5],
		sortOrder: 5,
	},
	{
		id: 6,
		name: "トニックウォーター",
		category: "その他",
		categoryName: "その他",
		actualNames: ["トニックウォーター"],
		actualIds: [6],
		sortOrder: 6,
	},
];

const defaultProps = {
	selectedIngredientIds: [],
	selectedIngredientNames: [],
	ingredients: mockIngredients,
	categories: mockCategories,
	onIngredientsChange: vi.fn(),
	disabled: false,
	isInitialLoading: false,
};

describe("IngredientSelector", () => {
	test("isInitialLoadingがtrueの場合、スケルトンコンポーネントが表示される", () => {
		render(<IngredientSelector {...defaultProps} isInitialLoading={true} />);
		expect(screen.getByText("材料を選択してください")).toBeInTheDocument();
		// スケルトンコンポーネント内の要素をチェック
		const skeletonButtons = screen.getAllByRole("button");
		expect(skeletonButtons.length).toBeGreaterThan(0);
		for (const button of skeletonButtons) {
			expect(button).toBeDisabled();
		}
	});

	test("カテゴリと材料が正しく表示される", () => {
		render(<IngredientSelector {...defaultProps} />);
		expect(screen.getByText("スピリッツ")).toBeInTheDocument();
		expect(screen.getByText("リキュール")).toBeInTheDocument();
		expect(screen.getByLabelText("ジン")).toBeInTheDocument();
		expect(screen.getByLabelText("ウォッカ")).toBeInTheDocument();
	});

	test("材料をクリックするとonIngredientsChangeが呼び出される", async () => {
		const user = userEvent.setup();
		const onIngredientsChange = vi.fn();
		render(
			<IngredientSelector
				{...defaultProps}
				onIngredientsChange={onIngredientsChange}
			/>,
		);

		const ginCheckbox = screen.getByLabelText("ジン");
		await user.click(ginCheckbox);

		expect(onIngredientsChange).toHaveBeenCalledWith([1], ["ジン"]);
	});

	test("選択済みの材料をクリックすると選択が解除される", async () => {
		const user = userEvent.setup();
		const onIngredientsChange = vi.fn();
		render(
			<IngredientSelector
				{...defaultProps}
				selectedIngredientIds={[1]}
				selectedIngredientNames={["ジン"]}
				onIngredientsChange={onIngredientsChange}
			/>,
		);

		const ginCheckbox = screen.getByLabelText("ジン");
		expect(ginCheckbox).toBeChecked();

		await user.click(ginCheckbox);

		expect(onIngredientsChange).toHaveBeenCalledWith([], []);
	});

	test("材料が5つ選択されると、他の材料は選択できなくなる", async () => {
		const user = userEvent.setup();
		const selectedIds = [1, 2, 3, 4, 5];
		const selectedNames = [
			"ジン",
			"ウォッカ",
			"カシスリキュール",
			"ピーチリキュール",
			"オレンジジュース",
		];
		render(
			<IngredientSelector
				{...defaultProps}
				selectedIngredientIds={selectedIds}
				selectedIngredientNames={selectedNames}
			/>,
		);

		const tonicCheckbox = screen.getByLabelText("トニックウォーター");
		expect(tonicCheckbox).toBeDisabled();

		// 既に選択されているものは解除できる
		const ginCheckbox = screen.getByLabelText("ジン");
		expect(ginCheckbox).toBeChecked();
		expect(ginCheckbox).not.toBeDisabled();
	});

	test("disabledがtrueの場合、全ての操作が無効になる", async () => {
		const onIngredientsChange = vi.fn();
		const user = userEvent.setup();
		render(
			<IngredientSelector
				{...defaultProps}
				selectedIngredientIds={[1]}
				selectedIngredientNames={["ジン"]}
				disabled={true}
				onIngredientsChange={onIngredientsChange}
			/>,
		);

		// チェックボックスが無効
		const ginCheckbox = screen.getByLabelText("ジン");
		expect(ginCheckbox).toBeDisabled();

		// アコーディオンが無効
		const accordionSummary = screen.getByRole("button", { name: "スピリッツ" });
		expect(accordionSummary).toHaveClass("Mui-disabled");
	});

	test("同じ材料グループ内で複数の詳細材料を選択できる", async () => {
		const user = userEvent.setup();
		const onIngredientsChange = vi.fn();
		const mockIngredientsWithDetails: Ingredient[] = [
			{
				id: 1,
				name: "ラム",
				category: "スピリッツ",
				categoryName: "スピリッツ",
				actualNames: ["ホワイト・ラム", "ダーク・ラム", "ゴールド・ラム"],
				sortOrder: 1,
			},
		];

		// 初期状態: ホワイト・ラムを選択中
		render(
			<IngredientSelector
				{...defaultProps}
				ingredients={mockIngredientsWithDetails}
				selectedIngredientIds={[1]}
				selectedIngredientNames={["ホワイト・ラム"]}
				onIngredientsChange={onIngredientsChange}
			/>,
		);

		// 詳細を展開
		// AccordionSummaryの展開アイコンと、材料行の展開ボタンの両方がExpandMoreIconを持っているため、
		// 材料行のボタンを特定して取得する。
		// IconButtonはbutton要素なので、role="button"で取得し、その中からリストの2番目（1番目はアコーディオン自体の展開ボタン）を取得するか、
		// あるいはもっと具体的に親要素から辿る。
		// ここでは、"ラム"というテキストの近くにあるボタンを探す戦略をとる。

		// "ラム"のテキスト要素を見つける
		const rumText = screen.getByText("ラム");
		// その親の親の親...と辿って、同じ行にあるIconButtonを探すのが確実だが、テストが脆くなる。
		// 代わりに、getAllByTestId("ExpandMoreIcon")で取得し、ボタンの親を持つものを探す。

		// シンプルに、画面上の全てのボタンを取得し、最後のボタン（詳細展開用）をクリックする
		const buttons = screen.getAllByRole("button");
		// buttons[0] -> AccordionSummary
		// buttons[1] -> IconButton (詳細展開用)
		// ※ Searchのクリアボタンなどがなければ。
		// 今回のケースでは IngredientSelector 内に AccordionSummary(1つ) と IconButton(1つ) があるはず。

		// AccordionSummaryはデフォルトでexpandedなので、ボタンとしては認識される。
		// 念のため、aria-labelなどを設定していないので、順番に依存するが、
		// モックデータが1つだけなので、2番目のボタンが詳細展開用と特定できる。
		const expandDetailButton = buttons[buttons.length - 1];
		await user.click(expandDetailButton);

		// チップが表示されるのを待つ（Collapseの展開）
		const darkRumChip = await screen.findByText("ダーク・ラム");
		await user.click(darkRumChip);

		// 期待される動作: IDは変わらず(1のまま)、名前リストにダーク・ラムが追加される
		expect(onIngredientsChange).toHaveBeenCalledWith(
			[1],
			["ホワイト・ラム", "ダーク・ラム"],
		);
	});

	test("詳細材料が選択されている状態で親グループのチェックを外すと、全選択が解除される", async () => {
		const user = userEvent.setup();
		const onIngredientsChange = vi.fn();
		const mockIngredientsWithDetails: Ingredient[] = [
			{
				id: 1,
				name: "ラム",
				category: "スピリッツ",
				categoryName: "スピリッツ",
				actualNames: ["ホワイト・ラム", "ダーク・ラム"],
				sortOrder: 1,
			},
		];

		// 初期状態: ホワイト・ラムを選択中
		render(
			<IngredientSelector
				{...defaultProps}
				ingredients={mockIngredientsWithDetails}
				selectedIngredientIds={[1]}
				selectedIngredientNames={["ホワイト・ラム"]}
				onIngredientsChange={onIngredientsChange}
			/>,
		);

		const rumCheckbox = screen.getByLabelText("ラム");
		// Checkboxはchecked状態のはず（IDが含まれているため）
		expect(rumCheckbox).toBeChecked();

		await user.click(rumCheckbox);

		// 期待される動作: IDも名前も空になる
		expect(onIngredientsChange).toHaveBeenCalledWith([], []);
	});
});
