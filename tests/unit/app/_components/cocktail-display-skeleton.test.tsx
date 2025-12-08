import { render, screen, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import CocktailDisplaySkeleton from "@/app/_components/cocktail-display-skeleton";

describe("CocktailDisplaySkeleton", () => {
	it("コンポーネントが正しくレンダリングされる", () => {
		const { container } = render(<CocktailDisplaySkeleton />);

		// 主要なラッパー要素が存在することを確認
		// ルート要素であるCardコンポーネントは .MuiCard-root クラスを持つため、それで存在を確認
		expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
	});

	it("ヘッダーセクションのスケルトン要素がレンダリングされる", () => {
		render(<CocktailDisplaySkeleton />);

		// ヘッダーのスケルトン要素
		// h2内のSkeleton (タイトル)
		const headingSkeletons = screen.getAllByRole("heading", { level: 2 });
		expect(
			headingSkeletons[0].querySelector(".MuiSkeleton-root"),
		).toBeInTheDocument();

		// タグのスケルトン (roundedスケルトン)
		const roundedSkeletons = screen
			.getAllByRole("generic", {
				name: "",
			})
			.filter((el) => el.querySelector(".MuiSkeleton-rounded"));
		expect(roundedSkeletons.length).toBeGreaterThanOrEqual(1);
	});

	it("材料セクションのスケルトン要素がレンダリングされる", () => {
		render(<CocktailDisplaySkeleton />);

		// 材料セクションのタイトルスケルトン
		const ingredientHeading = screen.getAllByRole("heading", { level: 6 })[0];
		expect(
			ingredientHeading.querySelector(".MuiSkeleton-root"),
		).toBeInTheDocument();

		// 材料リストのスケルトン (3行)
		// 材料セクションのタイトルを持つ heading を起点に、その親要素内を検索する
		const ingredientHeadingElement = screen.getAllByRole("heading", {
			level: 6,
		})[0];
		const ingredientSection = ingredientHeadingElement.parentElement;
		if (!ingredientSection) {
			throw new Error("Ingredient section not found");
		}
		const ingredientListItems = within(ingredientSection)
			.getAllByRole("generic")
			.filter((el) => el.querySelectorAll(".MuiSkeleton-text").length === 2);

		// 3つの材料項目があるので、3つのBoxが見つかるはず
		expect(ingredientListItems.length).toBe(3);
	});

	it("作り方セクションのスケルトン要素がレンダリングされる", () => {
		render(<CocktailDisplaySkeleton />);

		// 作り方セクションのタイトルスケルトン
		const instructionHeading = screen.getAllByRole("heading", { level: 6 })[1];
		expect(
			instructionHeading.querySelector(".MuiSkeleton-root"),
		).toBeInTheDocument();

		// 作り方リストのスケルトン (4行)
		const instructionSection = instructionHeading.parentElement;
		if (!instructionSection) {
			throw new Error("Instruction section not found");
		}

		// 親要素のスコープ内でスケルトン要素を検索
		// `getAllByRole`で名前のないgeneric要素をすべて取得し、構造上の2番目の要素を選択します。
		// 1番目は見出し(`h6`)、2番目が目的のコンテナ(`Box`)です。
		const allGenericElements = within(instructionSection).getAllByRole(
			"generic",
			{
				name: "",
			},
		);
		const instructionListContainer = allGenericElements[1];

		// コンテナ内に4つのスケルトン要素があることを確認します。
		// Skeletonコンポーネントは 'MuiSkeleton-root' クラスを持つspanとしてレンダリングされます。
		const skeletons =
			instructionListContainer.querySelectorAll(".MuiSkeleton-root");
		expect(skeletons).toHaveLength(4);
	});
});
