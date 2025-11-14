import { describe, it, expect, vi } from "vitest";
import {
	calculateMatchScore,
	sortCocktailsByMatchScore,
	filterCocktailsByIngredients,
	findExactMatchCocktails,
	getDailyRecommendation,
} from "../cocktail-filter";
import type { Cocktail } from "../../types/cocktail";

// テスト用のカクテルデータ
const mockCocktails: Cocktail[] = [
	{
		id: "1",
		name: "モヒート",
		description: "ラムベースの爽やかなカクテル",
		ingredients: [
			{ name: "ラム（ホワイト）", amount: "60ml" },
			{ name: "ライムジュース", amount: "30ml" },
			{ name: "ミント", amount: "8枚" },
			{ name: "砂糖", amount: "2tsp" },
		],
		instructions: [
			"グラスにミントと砂糖を入れて軽く潰す",
			"ラムとライムジュースを加えて混ぜる",
		],
		garnish: "ミントの葉",
	},
	{
		id: "2",
		name: "マルガリータ",
		description: "テキーラベースの定番カクテル",
		ingredients: [
			{ name: "テキーラ", amount: "50ml" },
			{ name: "ライムジュース", amount: "25ml" },
			{ name: "トリプルセック", amount: "25ml" },
		],
		instructions: ["シェイカーに材料を入れてシェイク", "グラスに注ぐ"],
		garnish: "ライムのくし切り",
	},
	{
		id: "3",
		name: "ジントニック",
		description: "ジンとトニックウォーターの組み合わせ",
		ingredients: [
            { name: "ジン", amount: "45ml" },
            { name: "トニックウォーター", amount: "適量" },
        ],
		instructions: ["グラスにジンを注ぐ", "トニックウォーターを加える"],
		garnish: "ライムのくし切り",
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

		it("大文字小文字を区別しない", () => {
			const score = calculateMatchScore(mockCocktails[0], ["RUM", "LIME"]);
			expect(score).toBe(0.5);
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

		it("空の材料配列の場合は元の順序を保持", () => {
			const sorted = sortCocktailsByMatchScore(mockCocktails, []);
			expect(sorted).toEqual(mockCocktails);
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

		it("複数の材料でフィルタリングされる", () => {
			const filtered = filterCocktailsByIngredients(mockCocktails, [
				"ラム",
				"ライム",
			]);
			expect(filtered).toHaveLength(2); // モヒートとマルガリータ
		});

		it("存在しない材料の場合は空配列を返す", () => {
			const filtered = filterCocktailsByIngredients(mockCocktails, [
				"存在しない材料",
			]);
			expect(filtered).toHaveLength(0);
		});
	});

	describe("findExactMatchCocktails", () => {
		it("完全一致するカクテルを返す", () => {
			const selectedIngredients = [
				"ラム（ホワイト）",
				"ライムジュース",
				"ミント",
				"砂糖",
			];
			const matches = findExactMatchCocktails(
				mockCocktails,
				selectedIngredients,
			);
			expect(matches).toHaveLength(1);
			expect(matches[0].name).toBe("モヒート");
		});

		it("材料が選択されていない場合は空配列を返す", () => {
			const matches = findExactMatchCocktails(mockCocktails, []);
			expect(matches).toHaveLength(0);
		});

		it("完全一致しない場合は空配列を返す", () => {
			const selectedIngredients = ["ラム", "ライム"];
			const matches = findExactMatchCocktails(
				mockCocktails,
				selectedIngredients,
			);
			expect(matches).toHaveLength(0);
		});

		it("材料の順序は考慮しない", () => {
			const selectedIngredients = [
				"砂糖",
				"ミント",
				"ライムジュース",
				"ラム（ホワイト）",
			];
			const matches = findExactMatchCocktails(
				mockCocktails,
				selectedIngredients,
			);
			expect(matches).toHaveLength(1);
			expect(matches[0].name).toBe("モヒート");
		});
	});

	describe("generateOriginalCocktail", () => {
		it("選択された材料に基づいてオリジナルカクテルを生成する", async () => {
			const selectedIngredients = ["ラム", "ライム"];
			const cocktail = await generateOriginalCocktail(selectedIngredients);

			expect(cocktail.name).toBe("ラム & ライム オリジナル");
			expect(cocktail.ingredients).toEqual([
                { name: "ラム", amount: "適量" },
                { name: "ライム", amount: "適量" },
            ]);
		});

		it("空の材料配列でもカクテルを生成する", async () => {
			const cocktail = await generateOriginalCocktail([]);
			expect(cocktail.name).toBe(" オリジナル");
			expect(cocktail.ingredients).toEqual([]);
		});

		it("生成されたカクテルに一意のIDが設定される", async () => {
			const cocktail1 = await generateOriginalCocktail(["ラム"]);
			const cocktail2 = await generateOriginalCocktail(["ラム"]);
			expect(cocktail1.id).not.toBe(cocktail2.id);
		});
	});

	describe("getDailyRecommendation", () => {
		it("日付に基づいてカクテルを選択する", () => {
			const recommendation = getDailyRecommendation(mockCocktails);
			expect(mockCocktails).toContain(recommendation);
		});

		it("同じ日付では同じカクテルが選択される", () => {
			const recommendation1 = getDailyRecommendation(mockCocktails);
			const recommendation2 = getDailyRecommendation(mockCocktails);
			expect(recommendation1).toBe(recommendation2);
		});

		it("空の配列の場合はundefinedを返す", () => {
			const recommendation = getDailyRecommendation([]);
			expect(recommendation).toBeUndefined();
		});
	});
});
