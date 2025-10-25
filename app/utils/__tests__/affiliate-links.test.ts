import { describe, it, expect } from "vitest";
import { getAffiliateLink, extractIngredientKeyword } from "../affiliate-links";
import type { Cocktail } from "../../types/cocktail";

// モックカクテルデータ
const mockCocktail: Cocktail = {
	id: "1",
	name: "モヒート",
	description: "キューバ発祥の爽やかなラムベースのカクテル",
	ingredients: [
		"ラム（ホワイト） 60ml",
		"ライムジュース 30ml",
		"シンプルシロップ 15ml",
		"ミントの葉 8-10枚",
		"ソーダ水 適量",
	],
	instructions: [
		"ミントの葉をグラスに入れて軽く押しつぶす",
		"ライムジュースとシンプルシロップを加える",
		"ラムを注ぎ、氷を入れて軽くステア",
		"ソーダ水で満たして完成",
	],
	garnish: "ミントの葉、ライムスライス",
};

describe("affiliate-links", () => {
	describe("getAffiliateLink", () => {
		it("材料名からアフィリエイトリンクを取得する", () => {
			const link = getAffiliateLink("ラム");
			expect(link).toBe("https://amzn.to/example-rum");
		});

		it("存在しない材料の場合はnullを返す", () => {
			const link = getAffiliateLink("存在しない材料");
			expect(link).toBeNull();
		});

		it("大文字小文字を区別しない", () => {
			const link = getAffiliateLink("ラム");
			expect(link).toBe("https://amzn.to/example-rum");
		});

		it("部分一致でマッチする", () => {
			const link = getAffiliateLink("ホワイトラム");
			expect(link).toBe("https://amzn.to/example-rum");
		});
	});

	describe("extractIngredientKeyword", () => {
		it("材料名からキーワードを抽出する", () => {
			const keyword = extractIngredientKeyword("ラム（ホワイト） 60ml");
			expect(keyword).toBe("ラム");
		});

		it("量や単位を除去する", () => {
			const keyword = extractIngredientKeyword("ライムジュース 30ml");
			expect(keyword).toBe("ライムジュース");
		});

		it("範囲表記を除去する", () => {
			const keyword = extractIngredientKeyword("ミントの葉 8-10枚");
			expect(keyword).toBe("ミントの葉");
		});

		it("説明文を除去する", () => {
			const keyword = extractIngredientKeyword("ラム（ホワイト）");
			expect(keyword).toBe("ラム");
		});

		it("適量などの表現を除去する", () => {
			const keyword = extractIngredientKeyword("ソーダ水 適量");
			expect(keyword).toBe("ソーダ水");
		});
	});
});
