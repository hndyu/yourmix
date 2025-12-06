import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	shareCocktail,
	canUseWebShare,
	copyToClipboard,
} from "@/app/utils/share-utils";
import type { Cocktail } from "@/app/types/cocktail";

describe("share-utils", () => {
	// モック用のカクテルデータ
	const mockCocktail: Cocktail = {
		id: "1",
		name: "テストカクテル",
		description: "これはテスト用のカクテル説明です。",
		ingredients: [
			{ id: 1, name: "材料A", category: "spirit", amount: "30ml" },
			{ id: 2, name: "材料B", category: "liqueur", amount: "15ml" },
		],
		instructions: [
			"ステップ1: AとBを混ぜる。",
			"ステップ2: 冷やして提供する。",
		],
		garnish: "レモンツイスト",
		tags: ["クラシック", "簡単"],
		slug: "test-cocktail",
		imageUrl: "/images/test-cocktail.jpg",
	};

	// createShareText はエクスポートされていないため、直接テストできません。
	// 代わりに shareCocktail が内部で createShareText を呼び出すことを利用してテストします。

	// 各テストの後にグローバルモックをリセットします
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	describe("canUseWebShare", () => {
		it("navigator.shareが定義されている場合、trueを返す", () => {
			// JSDOM環境では isBrowser は常に true
			vi.stubGlobal("navigator", {
				share: vi.fn(),
			});
			expect(canUseWebShare()).toBe(true);
		});

		it("navigator.shareが定義されていない場合、falseを返す", () => {
			// JSDOM環境では isBrowser は常に true
			vi.stubGlobal("navigator", {
				// share プロパティを意図的に未定義にする
			});
			expect(canUseWebShare()).toBe(false);
		});

		// isBrowser が false のケース（Node.js環境など）は、
		// JSDOM環境でテストするのが複雑なため、ここでは省略します。
		// share-utils.ts の isBrowser 定数が正しく機能することを信頼します。
	});

	describe("copyToClipboard", () => {
		beforeEach(() => {
			// document.execCommand のフォールバックをモック
			vi.stubGlobal("document", {
				createElement: vi.fn(() => ({
					style: {},
					focus: vi.fn(),
					select: vi.fn(),
				})),
				body: {
					appendChild: vi.fn(),
					removeChild: vi.fn(),
				},
				execCommand: vi.fn(() => true),
			});
		});

		it("navigator.clipboard.writeTextを使用してクリップボードにテキストをコピーする", async () => {
			vi.stubGlobal("navigator", {
				clipboard: {
					writeText: vi.fn(() => Promise.resolve()),
				},
			});
			const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");
			const result = await copyToClipboard(mockCocktail);
			expect(result).toBe(true);
			expect(writeTextSpy).toHaveBeenCalledTimes(1);
			expect(writeTextSpy).toHaveBeenCalledWith(
				expect.stringContaining("テストカクテル"),
			);
		});

		it("navigator.clipboard.writeTextが失敗した場合、フォールバックメソッドを使用する", async () => {
			// console.errorをモックして、意図したエラー出力をテストの失敗とみなさないようにする
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			vi.stubGlobal("navigator", {
				clipboard: {
					writeText: vi.fn(() =>
						Promise.reject(new Error("Clipboard write failed")),
					),
				},
			});
			const execCommandSpy = vi.spyOn(document, "execCommand");
			const result = await copyToClipboard(mockCocktail);
			expect(result).toBe(true);
			expect(execCommandSpy).toHaveBeenCalledWith("copy");

			// モックを元に戻す
			consoleErrorSpy.mockRestore();
		});
	});

	describe("shareCocktail", () => {
		beforeEach(() => {
			vi.stubGlobal("window", {
				location: {
					href: "http://localhost/",
				},
			});
		});

		it("Web Share APIが利用可能な場合、それを使用する", async () => {
			vi.stubGlobal("navigator", {
				share: vi.fn(() => Promise.resolve()),
				clipboard: { writeText: vi.fn() }, // 念のため定義
			});
			const shareSpy = vi.spyOn(navigator, "share");
			const result = await shareCocktail(mockCocktail);
			expect(result).toBe(true);
			expect(shareSpy).toHaveBeenCalledTimes(1);
			expect(shareSpy).toHaveBeenCalledWith({
				title: "テストカクテル - カクテルレシピ",
				text: expect.stringContaining("テストカクテル"),
				url: "http://localhost/",
			});
		});

		it("Web Share APIが利用できない場合、copyToClipboardにフォールバックする", async () => {
			vi.stubGlobal("navigator", {
				// share API を未定義にする
				clipboard: {
					writeText: vi.fn(() => Promise.resolve()),
				},
			});
			const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");
			const result = await shareCocktail(mockCocktail);
			expect(result).toBe(true);
			expect(writeTextSpy).toHaveBeenCalledTimes(1);
		});

		it("Web Share APIがAbortError以外のエラーをスローした場合、falseを返す", async () => {
			// console.error をモック
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			vi.stubGlobal("navigator", {
				share: vi.fn(() => Promise.reject(new Error("Some other error"))),
				clipboard: { writeText: vi.fn() },
			});
			const result = await shareCocktail(mockCocktail);
			expect(result).toBe(false);

			// モックを元に戻す
			consoleErrorSpy.mockRestore();
		});

		it("Web Share APIがAbortErrorをスローした場合（ユーザーがキャンセル）、falseを返す", async () => {
			vi.stubGlobal("navigator", {
				share: vi.fn(() =>
					Promise.reject(new DOMException("Aborted", "AbortError")),
				),
				clipboard: { writeText: vi.fn() },
			});
			const result = await shareCocktail(mockCocktail);
			expect(result).toBe(false);
		});
	});
});
