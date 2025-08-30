import { describe, it, expect } from "vitest";
import {
	filterCocktailsByIngredients,
	sortCocktailsByMatchScore,
	calculateMatchScore,
} from "../cocktail-filter";
import { shareViaWebShare, shareViaTwitter } from "../share-utils";
import { getAffiliateLink } from "../affiliate-links";
import { mockCocktails } from "../../types/cocktail";

describe("統合テスト", () => {
	describe("カクテル検索と共有の統合", () => {
		it("材料でフィルタリングして、結果を共有できる", async () => {
			// 1. 材料でフィルタリング
			const filtered = filterCocktailsByIngredients(mockCocktails, ["ラム"]);
			expect(filtered.length).toBeGreaterThan(0);

			// 2. マッチ度でソート
			const sorted = sortCocktailsByMatchScore(filtered, ["ラム"]);
			expect(sorted[0].name).toBe("モヒート");

			// 3. 共有機能をテスト（ブラウザ環境でのみ実行）
			if (typeof window !== "undefined") {
				// Web Share APIのテスト
				await expect(shareViaWebShare(sorted[0])).resolves.not.toThrow();

				// Twitter共有のテスト
				expect(() => shareViaTwitter(sorted[0])).not.toThrow();
			}
		});

		it("複数の材料で検索して、アフィリエイトリンクを取得できる", () => {
			// 1. 複数材料でフィルタリング
			const filtered = filterCocktailsByIngredients(mockCocktails, [
				"ラム",
				"ライム",
			]);
			expect(filtered.length).toBeGreaterThan(0);

			// 2. 各カクテルのマッチ度を計算
			const matchScores = filtered.map((cocktail) =>
				calculateMatchScore(cocktail, ["ラム", "ライム"]),
			);

			// 3. アフィリエイトリンクを取得
			for (const cocktail of filtered) {
				// 各材料についてアフィリエイトリンクを確認
				for (const ingredient of cocktail.ingredients) {
					const affiliateLink = getAffiliateLink(ingredient);
					// 一部の材料にはアフィリエイトリンクが存在することを確認
					if (ingredient.includes("ラム") || ingredient.includes("ライム")) {
						expect(affiliateLink).toBeTruthy();
					}
				}
			}
		});
	});

	describe("エラーハンドリングの統合", () => {
		it("存在しない材料で検索しても適切に処理される", () => {
			const filtered = filterCocktailsByIngredients(mockCocktails, [
				"存在しない材料",
			]);
			expect(filtered).toEqual([]);

			// 空の結果でもソートは正常に動作する
			const sorted = sortCocktailsByMatchScore(filtered, ["存在しない材料"]);
			expect(sorted).toEqual([]);
		});

		it("空の材料配列でも適切に処理される", () => {
			const filtered = filterCocktailsByIngredients(mockCocktails, []);
			expect(filtered).toEqual(mockCocktails);

			const sorted = sortCocktailsByMatchScore(filtered, []);
			expect(sorted).toEqual(mockCocktails);
		});
	});
});
