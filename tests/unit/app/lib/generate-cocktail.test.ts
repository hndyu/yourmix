import type { DB } from "@/app/db/db";
import { generateCocktailFromIngredients } from "@/app/lib/generate-cocktail";
import type { GeneratedCocktail } from "@/app/types/cocktail";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const generateContentMock = vi.hoisted(() => vi.fn());

vi.mock("@google/genai", () => ({
	GoogleGenAI: vi.fn().mockImplementation(() => ({
		models: {
			generateContent: generateContentMock,
		},
	})),
}));

vi.mock("@/app/db/db", () => ({
	getDb: vi.fn(),
}));

import { getDb } from "@/app/db/db";

describe("generateCocktailFromIngredients", () => {
	const mockCocktail: GeneratedCocktail = {
		name: "ネオン・ジンフィズ",
		description: "夜風に映える爽やかなジンベースのカクテルです。",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "ソーダ", amount: "適量" },
		],
		instructions: ["材料をシェイクし、グラスに注ぐ", "ソーダで満たす"],
		garnish: "レモンピール",
	};

	beforeEach(() => {
		process.env.GEMINI_API_KEY = "test-api-key";

		vi.mocked(getDb).mockResolvedValue({
			// 2回のselect呼び出しに対して順に返す
			select: vi
				.fn()
				.mockReturnValueOnce({
					from: vi.fn().mockResolvedValue([
						{
							displayName: "スピリッツ（その他）",
							description: "特別なスピリッツの説明",
						},
					]),
				})
				.mockReturnValueOnce({
					from: vi
						.fn()
						.mockResolvedValue([
							{ name: "ジン" },
							{ name: "トニックウォーター" },
						]),
				}),
		} as unknown as DB);
	});

	afterEach(() => {
		vi.clearAllMocks();
		process.env.GEMINI_API_KEY = undefined;
	});

	it("最新モデル順でフォールバックし、生成結果を返す", async () => {
		// 1回目はリトライ可能エラーで失敗させる
		generateContentMock
			.mockRejectedValueOnce({ status: 503 })
			.mockResolvedValueOnce({
				text: JSON.stringify(mockCocktail),
				candidates: [],
			});

		const result = await generateCocktailFromIngredients(["ジン"]);

		expect(result).toEqual(mockCocktail);
		// モデルが最新の優先順で試行されているかを確認
		expect(generateContentMock).toHaveBeenCalledTimes(2);
		expect(generateContentMock.mock.calls[0]?.[0]?.model).toBe(
			"gemini-3.5-flash",
		);
		expect(generateContentMock.mock.calls[1]?.[0]?.model).toBe(
			"gemini-3-flash-preview",
		);
	});

	it("未登録の材料が含まれる場合はエラーを返す", async () => {
		await expect(
			generateCocktailFromIngredients(["未登録の材料"]),
		).rejects.toThrow("不正な材料名です: 未登録の材料");
	});
});
