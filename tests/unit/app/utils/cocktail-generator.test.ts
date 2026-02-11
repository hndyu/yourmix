import { generateCocktailAction } from "@/app/actions/generate-cocktail";
import type { Cocktail } from "@/app/types/cocktail";
import { generateOriginalCocktail } from "@/app/utils/cocktail-generator";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/generate-cocktail", () => ({
	generateCocktailAction: vi.fn(),
}));

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
		vi.clearAllMocks();
	});

	it("サーバーアクションが成功し、有効なカクテルデータを返す", async () => {
		vi.mocked(generateCocktailAction).mockResolvedValue(mockCocktail);

		const ingredients = ["ジン", "トニックウォーター"];
		const result = await generateOriginalCocktail(ingredients);

		expect(result).toEqual(mockCocktail);
		expect(generateCocktailAction).toHaveBeenCalledTimes(1);
		expect(generateCocktailAction).toHaveBeenCalledWith(ingredients, {
			mock: false,
		});
	});

	it("サーバーアクションがエラーを返した場合、エラーをスローする", async () => {
		const error = new Error("APIエラーが発生しました");
		vi.mocked(generateCocktailAction).mockRejectedValue(error);

		await expect(generateOriginalCocktail(["ウォッカ"])).rejects.toThrow(error);
	});

	it("不正な形式のデータを返した場合、エラーをスローする", async () => {
		const invalidData = { name: "不完全なカクテル" } as Cocktail;
		vi.mocked(generateCocktailAction).mockResolvedValue(invalidData);

		await expect(generateOriginalCocktail(["テキーラ"])).rejects.toThrow(
			"受信したカクテルデータの形式が正しくありません。",
		);
	});
});
