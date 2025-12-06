import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, test } from "vitest";
import IngredientSelectorSkeleton from "@/app/_components/ingredient-selector-skeleton";

describe("IngredientSelectorSkeleton", () => {
	test("コンポーネントが正しくレンダリングされる", () => {
		const { container } = render(<IngredientSelectorSkeleton />);

		// ヘッダーテキストが表示されることを確認
		expect(screen.getByText("材料を選択してください")).toBeInTheDocument();

		// アコーディオンのスケルトンが5つ表示されることを確認
		const accordions = screen.getAllByRole("button");
		expect(accordions).toHaveLength(5);
		for (const accordion of accordions) {
			expect(accordion).toBeDisabled();
		}

		// 材料アイテムのスケルトンが 5 * 4 = 20個表示されることを確認
		// 各アコーディオン内に4つのアイテムスケルトンがある
		const rectangularSkeletons = container.querySelectorAll(
			".MuiSkeleton-rectangular",
		);
		expect(rectangularSkeletons).toHaveLength(20);
	});
});
