import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import MixSection from "@/app/_components/mix-section";

// 子コンポーネントをモック化
vi.mock("@/app/_components/ingredient-selector", () => ({
	default: ({
		selectedIngredientIds,
		onIngredientsChange,
		disabled,
		isInitialLoading,
	}: {
		selectedIngredientIds: number[];
		onIngredientsChange: (ids: number[], names: string[]) => void;
		disabled: boolean;
		isInitialLoading: boolean;
	}) => (
		<div data-testid="ingredient-selector">
			<p>isInitialLoading: {isInitialLoading.toString()}</p>
			<p>disabled: {disabled.toString()}</p>
			<button
				type="button"
				onClick={() => onIngredientsChange([1], ["Ingredient 1"])}
			>
				Select Ingredient
			</button>
			<span>Selected: {selectedIngredientIds.length}</span>
		</div>
	),
}));

vi.mock("@/app/_components/mix-button", () => ({
	default: ({
		onClick,
		disabled,
		isLoading,
	}: {
		onClick: () => void;
		disabled: boolean;
		isLoading: boolean;
	}) => (
		<button
			type="button"
			data-testid="mix-button"
			onClick={onClick}
			disabled={disabled || isLoading}
		>
			{isLoading ? "Mixing..." : "Mix!"}
		</button>
	),
}));

describe("MixSection", () => {
	const mockOnMixClick = vi.fn();
	const mockOnIngredientsChange = vi.fn();

	const defaultProps = {
		onMixClick: mockOnMixClick,
		ingredients: [],
		categories: [],
		selectedIngredientIds: [],
		onIngredientsChange: mockOnIngredientsChange,
		isMixing: false,
		isInitialLoading: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("初期状態が正しくレンダリングされること", () => {
		render(<MixSection {...defaultProps} />);

		expect(
			screen.getByRole("heading", {
				name: "あなただけのカクテルを作ってみよう",
			}),
		).toBeInTheDocument();
		expect(screen.getByTestId("ingredient-selector")).toBeInTheDocument();
		expect(screen.getByTestId("mix-button")).toBeInTheDocument();
		expect(
			screen.getByText("材料を選択してからMixボタンを押してください"),
		).toBeInTheDocument();
		expect(screen.getByTestId("mix-button")).toBeDisabled();
	});

	it("isInitialLoadingがtrueの場合、ローディング状態が表示され、コンポーネントが無効化されること", () => {
		render(<MixSection {...defaultProps} isInitialLoading />);

		expect(screen.getByText("材料を読み込んでいます...")).toBeInTheDocument();
		expect(screen.getByTestId("ingredient-selector")).toHaveTextContent(
			"isInitialLoading: true",
		);
		expect(screen.getByTestId("ingredient-selector")).toHaveTextContent(
			"disabled: true",
		);
		expect(screen.getByTestId("mix-button")).toBeDisabled();
	});

	it("材料が選択されると、Mixボタンが有効になり、メッセージが更新されること", () => {
		const props = { ...defaultProps, selectedIngredientIds: [1] };
		render(<MixSection {...props} />);

		expect(screen.getByTestId("mix-button")).toBeEnabled();
		expect(
			screen.getByText("選択された材料 (1個) からレシピを生成します"),
		).toBeInTheDocument();
	});

	it("isMixingがtrueの場合、ミキシング状態が表示され、コンポーネントが無効化されること", () => {
		render(
			<MixSection {...defaultProps} selectedIngredientIds={[1]} isMixing />,
		);

		expect(screen.getByText("カクテルを生成中です...")).toBeInTheDocument();
		expect(screen.getByTestId("ingredient-selector")).toHaveTextContent(
			"disabled: true",
		);
		expect(screen.getByTestId("mix-button")).toBeDisabled();
		expect(screen.getByTestId("mix-button")).toHaveTextContent("Mixing...");
	});

	it("MixボタンをクリックするとonMixClickが呼び出されること", async () => {
		const user = userEvent.setup();
		render(<MixSection {...defaultProps} selectedIngredientIds={[1]} />);

		const mixButton = screen.getByTestId("mix-button");
		expect(mixButton).toBeEnabled();

		await user.click(mixButton);

		expect(mockOnMixClick).toHaveBeenCalledTimes(1);
	});

	it("材料が選択されていない場合、Mixボタンは無効であり、クリックしてもonMixClickは呼び出されないこと", async () => {
		const user = userEvent.setup();
		render(<MixSection {...defaultProps} />);

		const mixButton = screen.getByTestId("mix-button");
		expect(mixButton).toBeDisabled();

		await user.click(mixButton);

		expect(mockOnMixClick).not.toHaveBeenCalled();
	});
});
