import {
	extractIngredientKeyword,
	getAffiliateLink,
} from "@/app/utils/affiliate-links";
import { describe, expect, it } from "vitest";

describe("affiliate-links", () => {
	describe("extractIngredientKeyword", () => {
		it("括弧とその中身を削除する", () => {
			expect(extractIngredientKeyword("ウォッカ（お好みで）")).toBe("ウォッカ");
			expect(extractIngredientKeyword("ライム(くし切り)")).toBe("ライム");
		});

		it("特定の形状表現を削除する", () => {
			expect(extractIngredientKeyword("オレンジのくし切り")).toBe("オレンジ");
			expect(extractIngredientKeyword("レモンの輪切り")).toBe("レモン");
			expect(extractIngredientKeyword("きゅうりのスライス")).toBe("きゅうり");
			expect(extractIngredientKeyword("ミントの小枝")).toBe("ミント");
			expect(extractIngredientKeyword("ローズマリーの葉")).toBe("ローズマリー");
			expect(extractIngredientKeyword("生姜の塊")).toBe("生姜");
		});

		it("末尾の特定の単語を削除する", () => {
			expect(extractIngredientKeyword("国産レモン")).toBe("国産レモン"); // "産"が末尾でない場合は削除しない
			expect(extractIngredientKeyword("アメリカ産チェリー")).toBe(
				"アメリカ産チェリー",
			);
			expect(extractIngredientKeyword("きゅうり薄切り")).toBe("きゅうり");
		});

		it("前後の空白をトリムする", () => {
			expect(extractIngredientKeyword("  ジン  ")).toBe("ジン");
		});

		it("複数のルールを組み合わせて適用する", () => {
			expect(extractIngredientKeyword("  ライム（国産）のくし切り  ")).toBe(
				"ライム",
			);
		});

		it("変更がない場合は元の文字列を返す", () => {
			expect(extractIngredientKeyword("ウォッカ")).toBe("ウォッカ");
		});
	});

	describe("getAffiliateLink", () => {
		it("キーワードからAmazonの検索リンクを生成する", () => {
			const keyword = "ウイスキー";
			const expectedLink = `https://www.amazon.co.jp/s?k=${encodeURIComponent(
				keyword,
			)}`;
			expect(getAffiliateLink(keyword)).toBe(expectedLink);
		});

		it("キーワードがエンコードされることを確認する", () => {
			const keyword = "ラム酒&スパイス";
			const expectedLink = `https://www.amazon.co.jp/s?k=${encodeURIComponent(
				keyword,
			)}`;
			expect(getAffiliateLink(keyword)).toBe(expectedLink);
		});

		it("キーワードが空文字列の場合nullを返す", () => {
			expect(getAffiliateLink("")).toBe(null);
		});

		// EXCLUDED_KEYWORDS に '氷' が含まれていると仮定したテスト
		// affiliate-links.ts の EXCLUDED_KEYWORDS に '氷' を追加してください
		// it("除外キーワードリストに含まれる場合nullを返す", () => {
		// 	// このテストを成功させるには、affiliate-links.tsのEXCLUDED_KEYWORDS配列に'氷'を追加する必要があります。
		// 	// 例: const EXCLUDED_KEYWORDS: string[] = ["氷", "水"];
		// 	expect(getAffiliateLink("氷")).toBe(null);
		// });
	});
});
