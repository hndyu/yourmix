import { render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "@mui/material"; // Tooltipのインポートを追加
import type { Cocktail } from "../../types/cocktail";
import * as affiliateLinks from "../../utils/affiliate-links";
import * as shareUtils from "../../utils/share-utils";
import CocktailDisplay from "../cocktail-display";

// モジュールのモック
vi.mock("../../utils/share-utils", () => ({
	canUseWebShare: vi.fn(),
	shareCocktail: vi.fn(),
}));

vi.mock("../../utils/affiliate-links", () => ({
	extractIngredientKeyword: vi.fn((name) => name),
	getAffiliateLink: vi.fn(),
}));

describe("CocktailDisplay Component", () => {
	// モックデータ
	const mockCocktail: Cocktail = {
		id: "1",
		slug: "test-cocktail",
		name: "テストカクテル",
		description: "これはテスト用のカクテルです。",
		ingredients: [
			{
				id: 101,
				category: "スピリッツ",
				name: "ジン",
				amount: "45ml",
				description: "ジンの説明",
			},
			{
				id: 102,
				name: "トニックウォーター",
				category: "ソフトドリンク",
				amount: "Full up",
			},
		],
		instructions: [
			"グラスに氷を入れる",
			"ジンとトニックウォーターを注ぐ",
			"軽く混ぜる",
		],
		garnish: "ライムウェッジ",
		tags: ["さっぱり", "定番"],
	};

	beforeEach(() => {
		// 各テストの前にモックをリセット
		vi.mocked(shareUtils.canUseWebShare).mockReturnValue(true);
		vi.mocked(shareUtils.shareCocktail).mockResolvedValue(true);
		vi.mocked(affiliateLinks.getAffiliateLink).mockImplementation(
			(keyword) => `https://example.com/shop/${keyword}`,
		);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("カクテルの基本情報が正しく表示される", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);

		// 名前と説明
		expect(screen.getByText(`🍹 ${mockCocktail.name}`)).toBeInTheDocument();
		expect(screen.getByText(mockCocktail.description)).toBeInTheDocument();

		// タグ
		expect(screen.getByText("さっぱり")).toBeInTheDocument();
		expect(screen.getByText("定番")).toBeInTheDocument();

		// 材料
		expect(screen.getByText("ジン")).toBeInTheDocument();
		expect(screen.getByText("45ml")).toBeInTheDocument();
		expect(screen.getByText("トニックウォーター")).toBeInTheDocument();
		expect(screen.getByText("Full up")).toBeInTheDocument();

		// 作り方
		expect(screen.getByText("1. グラスに氷を入れる")).toBeInTheDocument();
		expect(
			screen.getByText("2. ジンとトニックウォーターを注ぐ"),
		).toBeInTheDocument();
		expect(screen.getByText("3. 軽く混ぜる")).toBeInTheDocument();

		// ガーニッシュ
		expect(screen.getByText("🌿 飾り")).toBeInTheDocument();
		expect(
			screen.getByText(mockCocktail.garnish as string),
		).toBeInTheDocument();
	});

	it("isDetailPage=trueの場合、h1見出しとして名前が表示される", () => {
		render(<CocktailDisplay cocktail={mockCocktail} isDetailPage />);
		const heading = screen.getByRole("heading", { level: 1 });
		expect(heading).toHaveTextContent(`🍹 ${mockCocktail.name}`);
	});

	it("isDetailPage=falseの場合、h2見出しとして名前が表示される", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);
		const heading = screen.getByRole("heading", { level: 2 });
		expect(heading).toHaveTextContent(`🍹 ${mockCocktail.name}`);
	});

	it("onRemoveが渡された場合、削除ボタンが表示されクリックで関数が呼ばれる", async () => {
		const handleRemove = vi.fn();
		render(<CocktailDisplay cocktail={mockCocktail} onRemove={handleRemove} />);

		const removeButton = screen.getByRole("button", {
			name: "このレシピを削除",
		});
		expect(removeButton).toBeInTheDocument();

		await userEvent.click(removeButton);
		expect(handleRemove).toHaveBeenCalledTimes(1);
	});

	it("onRemoveが渡されない場合、削除ボタンは表示されない", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);
		const removeButton = screen.queryByRole("button", {
			name: "このレシピを削除",
		});
		expect(removeButton).not.toBeInTheDocument();
	});

	it("Web Share APIがサポートされている場合、共有ボタンでshareCocktailが呼ばれる", async () => {
		vi.mocked(shareUtils.canUseWebShare).mockReturnValue(true);
		render(<CocktailDisplay cocktail={mockCocktail} />);

		const shareButton = screen.getByRole("button", { name: "共有" });
		await userEvent.click(shareButton);

		expect(shareUtils.shareCocktail).toHaveBeenCalledWith(mockCocktail);
	});

	it("Web Share APIがサポートされていない場合、コピーボタンでshareCocktailが呼ばれ、スナックバーが表示される", async () => {
		vi.mocked(shareUtils.canUseWebShare).mockReturnValue(false);
		vi.mocked(shareUtils.shareCocktail).mockResolvedValue(true); // コピー成功をシミュレート

		render(<CocktailDisplay cocktail={mockCocktail} />);

		const copyButton = screen.getByRole("button", { name: "レシピをコピー" });
		await userEvent.click(copyButton);

		expect(shareUtils.shareCocktail).toHaveBeenCalledWith(mockCocktail);

		// スナックバーが表示されるのを待つ
		await waitFor(() => {
			expect(
				screen.getByText("レシピをクリップボードにコピーしました！"),
			).toBeInTheDocument();
		});
	});

	it("材料の購入リンクが正しく表示される", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);

		const links = screen.getAllByRole("link", { name: "材料を買う" });
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveAttribute("href", "https://example.com/shop/ジン");
		expect(links[1]).toHaveAttribute(
			"href",
			"https://example.com/shop/トニックウォーター",
		);
	});

	it("garnishがない場合、ガーニッシュセクションは表示されない", () => {
		const cocktailWithoutGarnish = { ...mockCocktail, garnish: undefined };
		render(<CocktailDisplay cocktail={cocktailWithoutGarnish} />);

		expect(screen.queryByText("🌿 飾り")).not.toBeInTheDocument();
	});

	it("材料の説明がある場合、ツールチップアイコンが表示される", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);

		// "ジン"のListItemを探す
		const ginListItem = screen.getByText("ジン").closest("li");
		expect(ginListItem).not.toBeNull();

		// `getByRole` は見つからないとエラーを投げるので、存在確認に使える
		// MUIのTooltipはすぐにはDOMに現れないことがあるため、`within`でスコープを絞る
		if (ginListItem) {
			const { getByLabelText } = render(
				<Tooltip title="ジンの説明">
					<div />
				</Tooltip>,
			);
			// このテストではアイコンの存在のみを確認
			const helpIcon = within(ginListItem).getByTestId("HelpOutlineIcon");
			expect(helpIcon).toBeInTheDocument();
		}
	});

	it("材料の説明がない場合、ツールチップアイコンは表示されない", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);

		// "トニックウォーター"のListItemを探す
		const tonicListItem = screen.getByText("トニックウォーター").closest("li");
		expect(tonicListItem).not.toBeNull();

		if (tonicListItem) {
			const helpIcon = within(tonicListItem).queryByTestId("HelpOutlineIcon");
			expect(helpIcon).not.toBeInTheDocument();
		}
	});
});

// `within` ヘルパー関数をインポートするか、ここで定義します。
// Vitest/JSDOM環境では、Testing Libraryの`within`がうまく機能しないことがあるため、
// 必要な場合はカスタム実装が必要になることがあります。
// ここでは、`@testing-library/react`からインポートすることを想定しています。
import { within } from "@testing-library/react";
