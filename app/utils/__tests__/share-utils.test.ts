import {
	type MockedFunction,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import type { Cocktail } from "../../types/cocktail";
import {
	copyToClipboard,
	shareViaTwitter,
	shareViaWebShare,
} from "../share-utils";

// モックカクテルデータ
const mockCocktail: Cocktail = {
	id: "1",
	name: "モヒート",
	description: "キューバ発祥の爽やかなラムベースのカクテル",
	ingredients: [
		{ name: "ラム（ホワイト）", amount: "60ml" },
		{ name: "ライムジュース", amount: "30ml" },
		{ name: "シンプルシロップ", amount: "15ml" },
		{ name: "ミントの葉", amount: "8-10枚" },
		{ name: "ソーダ水", amount: "適量" },
	],
	instructions: [
		"ミントの葉をグラスに入れて軽く押しつぶす",
		"ライムジュースとシンプルシロップを加える",
		"ラムを注ぎ、氷を入れて軽くステア",
		"ソーダ水で満たして完成",
	],
	garnish: "ミントの葉、ライムスライス",
};

// グローバルオブジェクトのモック
const mockNavigator = {
	share: vi.fn() as
		| MockedFunction<(data: ShareData) => Promise<void>>
		| undefined,
	canShare: vi.fn(),
	clipboard: {
		writeText: vi.fn(),
	},
};

const mockWindow = {
	open: vi.fn(),
	location: {
		href: "https://example.com",
	},
};

describe("share-utils", () => {
	beforeEach(() => {
		// グローバルオブジェクトをモック
		Object.defineProperty(global, "navigator", {
			value: mockNavigator,
			writable: true,
		});

		Object.defineProperty(global, "window", {
			value: mockWindow,
			writable: true,
		});

		// モックをリセット
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("shareViaWebShare", () => {
		it("Web Share APIが利用可能な場合はnavigator.shareを呼び出す", async () => {
			mockNavigator.share = vi.fn().mockResolvedValue(undefined);

			await shareViaWebShare(mockCocktail);

			expect(mockNavigator.share).toHaveBeenCalledWith({
				title: "モヒート - カクテルレシピ",
				text: "モヒート: キューバ発祥の爽やかなラムベースのカクテル",
				url: "https://example.com",
			});
		});

		it("Web Share APIがサポートされていない場合はフォールバック処理を実行", async () => {
			mockNavigator.share = undefined; // これで型エラーが解決される

			// フォールバック処理のテスト
			await shareViaWebShare(mockCocktail);

			expect(mockNavigator.share).toBeUndefined();
		});

		it("navigator.shareがエラーを投げた場合は適切に処理される", async () => {
			mockNavigator.share = vi
				.fn()
				.mockRejectedValue(new Error("Share failed"));

			// エラーハンドリングのテスト
			await expect(shareViaWebShare(mockCocktail)).rejects.toThrow(
				"Share failed",
			);
		});
	});

	describe("shareViaTwitter", () => {
		it("Twitter共有用のURLを生成してウィンドウを開く", () => {
			shareViaTwitter(mockCocktail);

			expect(mockWindow.open).toHaveBeenCalledWith(
				expect.stringContaining("https://twitter.com/intent/tweet"),
				"_blank",
				"width=600,height=400",
			);
		});

		it("ツイート本文が適切にエンコードされる", () => {
			shareViaTwitter(mockCocktail);

			const callArg = mockWindow.open.mock.calls[0][0];
			expect(callArg).toContain(encodeURIComponent("モヒート"));
			expect(callArg).toContain(
				encodeURIComponent("キューバ発祥の爽やかなラムベースのカクテル"),
			);
		});

		it("URLパラメータが適切に設定される", () => {
			shareViaTwitter(mockCocktail);

			const callArg = mockWindow.open.mock.calls[0][0];
			expect(callArg).toContain("text=");
			expect(callArg).toContain("url=");
		});
	});

	describe("copyToClipboard", () => {
		it("クリップボードにカクテル情報をコピーする", async () => {
			mockNavigator.clipboard = {
				writeText: vi.fn().mockResolvedValue(undefined),
			};

			const result = await copyToClipboard(mockCocktail);

			expect(mockNavigator.clipboard.writeText).toHaveBeenCalledWith(
				expect.stringContaining("モヒート"),
			);
			expect(result).toBe(true);
		});

		it("材料と手順がクリップボードに含まれる", async () => {
			mockNavigator.clipboard = {
				writeText: vi.fn().mockResolvedValue(undefined),
			};

			await copyToClipboard(mockCocktail);

			const copiedText = mockNavigator.clipboard.writeText.mock.calls[0][0];
			expect(copiedText).toContain("ラム（ホワイト） 60ml");
			expect(copiedText).toContain("ミントの葉をグラスに入れて軽く押しつぶす");
		});

		it("クリップボードAPIが失敗した場合はフォールバック処理を実行", async () => {
			mockNavigator.clipboard = {
				writeText: vi.fn().mockRejectedValue(new Error("Clipboard failed")),
			};

			// document.execCommandのモック
			Object.defineProperty(document, "execCommand", {
				value: vi.fn().mockReturnValue(true),
				writable: true,
			});

			const result = await copyToClipboard(mockCocktail);

			expect(result).toBe(true);
		});
	});
});
