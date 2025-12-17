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
		sortOrder: 1,
	},
	{
		id: 2,
		name: "ウォッカ",
		category: "スピリッツ",
		categoryName: "スピリッツ",
		sortOrder: 2,
	},
	{
		id: 3,
		name: "カシスリキュール",
		category: "リキュール",
		categoryName: "リキュール",
		sortOrder: 3,
	},
	{
		id: 4,
		name: "ピーチリキュール",
		category: "リキュール",
		categoryName: "リキュール",
		sortOrder: 4,
	},
	{
		id: 5,
		name: "オレンジジュース",
		category: "その他",
		categoryName: "その他",
		sortOrder: 5,
	},
	{
		id: 6,
		name: "トニックウォーター",
		category: "その他",
		categoryName: "その他",
		sortOrder: 6,
	},
];

const defaultProps = {
	selectedIngredientIds: [],
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
		render(
			<IngredientSelector
				{...defaultProps}
				selectedIngredientIds={selectedIds}
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
});
