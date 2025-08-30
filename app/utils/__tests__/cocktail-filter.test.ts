import { describe, it, expect } from "vitest";
import {
	calculateMatchScore,
	sortCocktailsByMatchScore,
	filterCocktailsByIngredients,
} from "../cocktail-filter";
import type { Cocktail } from "../../types/cocktail";

// テスト用のカクテルデータ
const mockCocktails: Cocktail[] = [
	{
		id: "1",
		name: "モヒート",
		description: "ラムベースの爽やかなカクテル",
		ingredients: [
			"ラム（ホワイト） 60ml",
			"ライムジュース 30ml",
			"ミント 8枚",
			"砂糖 2tsp",
		],
		instructions: [
			"グラスにミントと砂糖を入れて軽く潰す",
			"ラムとライムジュースを加えて混ぜる",
		],
		glassType: "タンブラー",
		garnish: "ミントの葉",
		difficulty: "easy",
		prepTime: "5分",
	},
	{
		id: "2",
		name: "マルガリータ",
		description: "テキーラベースの定番カクテル",
		ingredients: [
			"テキーラ 50ml",
			"ライムジュース 25ml",
			"トリプルセック 25ml",
		],
		instructions: ["シェイカーに材料を入れてシェイク", "グラスに注ぐ"],
		glassType: "カクテルグラス",
		garnish: "ライムのくし切り",
		difficulty: "medium",
		prepTime: "3分",
	},
	{
		id: "3",
		name: "ジントニック",
		description: "ジンとトニックウォーターの組み合わせ",
		ingredients: ["ジン 45ml", "トニックウォーター 適量"],
		instructions: ["グラスにジンを注ぐ", "トニックウォーターを加える"],
		glassType: "タンブラー",
		garnish: "ライムのくし切り",
		difficulty: "easy",
		prepTime: "2分",
	},
];

describe("cocktail-filter", () => {
	describe("calculateMatchScore", () => {
		it("材料が選択されていない場合は0を返す", () => {
			const score = calculateMatchScore(mockCocktails[0], []);
			expect(score).toBe(0);
		});

		it("完全一致の場合は1を返す", () => {
			const score = calculateMatchScore(mockCocktails[0], [
				"ラム（ホワイト）",
				"ライムジュース",
				"ミント",
				"砂糖",
			]);
			expect(score).toBe(1);
		});

		it("部分一致の場合は適切なスコアを返す", () => {
			const score = calculateMatchScore(mockCocktails[0], [
				"ラム（ホワイト）",
				"ライムジュース",
			]);
			expect(score).toBe(0.5); // 2/4 = 0.5
		});

		it("量を含む材料名でも正しくマッチする", () => {
			const score = calculateMatchScore(mockCocktails[0], ["ラム", "ライム"]);
			expect(score).toBe(0.5); // 2/4 = 0.5
		});
	});

	describe("sortCocktailsByMatchScore", () => {
		it("マッチ度順にソートされる", () => {
			const selectedIngredients = ["ラム", "ライム"];
			const sorted = sortCocktailsByMatchScore(
				mockCocktails,
				selectedIngredients,
			);

			// モヒートが最も高いスコア（0.5）を持つはず
			expect(sorted[0].name).toBe("モヒート");

			// マルガリータが2番目（0.5）
			expect(sorted[1].name).toBe("マルガリータ");

			// ジントニックが最後（0.0）
			expect(sorted[2].name).toBe("ジントニック");
		});

		it("同じスコアの場合は元の順序を保持", () => {
			const selectedIngredients = ["ライム"];
			const sorted = sortCocktailsByMatchScore(
				mockCocktails,
				selectedIngredients,
			);

			// モヒートとマルガリータは同じスコア（0.25）を持つ
			expect(sorted[0].name).toBe("モヒート");
			expect(sorted[1].name).toBe("マルガリータ");
		});
	});

	describe("filterCocktailsByIngredients", () => {
		it("選択された材料に基づいてフィルタリングされる", () => {
			const filtered = filterCocktailsByIngredients(mockCocktails, ["ラム"]);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe("モヒート");
		});

		it("材料が選択されていない場合は全てのカクテルを返す", () => {
			const filtered = filterCocktailsByIngredients(mockCocktails, []);
			expect(filtered).toHaveLength(3);
		});
	});
});
