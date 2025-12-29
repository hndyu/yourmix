import type { Cocktail } from "@/app/types/cocktail";
import { generateOriginalCocktail } from "@/app/utils/cocktail-generator";
import { afterEach, describe, expect, it, vi } from "vitest";

// fetchをグローバルにモック
global.fetch = vi.fn();

const mockCocktail: Cocktail = {
	id: "ai-1",
	name: "AIカクテル",
	description: "AIによって生成された特別なカクテルです。",
	ingredients: [{ id: 1, name: "ジン", category: "spirit", amount: "45ml" }],
	instructions: ["すべての材料をシェイクし、グラスに注ぐ。"],
	slug: "ai-cocktail",
};

describe("cocktail-generator", () => {
	afterEach(() => {
		vi.mocked(fetch).mockClear();
	});

	it("API呼び出しが成功し、有効なカクテルデータを返す", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockCocktail),
		} as Response);

		const ingredients = ["ジン", "トニックウォーター"];
		const result = await generateOriginalCocktail(ingredients);

		expect(result).toEqual(mockCocktail);
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith("/api/generate-cocktail", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ingredients }),
		});
	});

	it("APIがエラーレスポンスを返した場合、エラーをスローする", async () => {
		const errorResponse = { error: "APIエラーが発生しました" };
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
			json: () => Promise.resolve(errorResponse),
		} as Response);

		await expect(generateOriginalCocktail(["ウォッカ"])).rejects.toThrow(
			errorResponse.error,
		);
	});

	it("APIがエラーレスポンスを返したが、エラーメッセージがない場合、デフォルトのエラーをスローする", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
			json: () => Promise.resolve({}), // エラーメッセージなし
		} as Response);

		await expect(generateOriginalCocktail(["ラム"])).rejects.toThrow(
			"カクテルの生成に失敗しました。",
		);
	});

	it("APIが成功したが、不正な形式のデータを返した場合、エラーをスローする", async () => {
		const invalidData = { name: "不完全なカクテル" }; // ingredientsがない
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(invalidData),
		} as Response);

		await expect(generateOriginalCocktail(["テキーラ"])).rejects.toThrow(
			"受信したカクテルデータの形式が正しくありません。",
		);
	});

	it("fetchでネットワークエラーが発生した場合、そのエラーをスローする", async () => {
		const networkError = new Error("Network Failure");
		vi.mocked(fetch).mockRejectedValue(networkError);

		await expect(generateOriginalCocktail(["ウイスキー"])).rejects.toThrow(
			networkError,
		);
	});
});
