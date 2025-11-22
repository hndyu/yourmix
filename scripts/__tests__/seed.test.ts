import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Env } from "../../cloudflare-env";
import type * as SeedModule from "../../scripts/seed";
import * as schema from "../../schema";

// Drizzle ORMとUUIDをモック化
const mockDbClient = {
	delete: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	values: vi.fn().mockReturnThis(),
	returning: vi.fn().mockResolvedValue([{ id: 1 }]),
};

vi.mock("drizzle-orm/d1", () => ({
	drizzle: vi.fn(() => mockDbClient),
}));

vi.mock("uuid", () => ({
	v4: vi.fn(() => "mock-uuid"),
}));

describe("scripts/seed.ts", () => {
	let mockEnv: Env;

	beforeEach(() => {
		// モックのEnvオブジェクトを作成
		mockEnv = {
			DB: {} as D1Database, // D1Database自体はモック不要
		};

		// 各テストの前にモックの呼び出し履歴をリセット
		vi.clearAllMocks();

		// returningのデフォルトのモック実装
		mockDbClient.returning.mockImplementation((fields) => {
			if ("id" in fields) {
				return Promise.resolve([{ id: Math.floor(Math.random() * 1000) }]);
			}
			return Promise.resolve([{}]);
		});
	});

	describe("seed()", () => {
		it("正常にシード処理が実行され、各テーブルのデータが作成されること", async () => {
			const { seed } = await import("../../scripts/seed");
			await seed(mockEnv);

			// 1. 既存データの削除が呼ばれるか
			expect(mockDbClient.delete).toHaveBeenCalledWith(schema.cocktailTags);
			expect(mockDbClient.delete).toHaveBeenCalledWith(schema.tags);
			expect(mockDbClient.delete).toHaveBeenCalledWith(schema.instructions);
			expect(mockDbClient.delete).toHaveBeenCalledWith(
				schema.cocktailIngredients,
			);
			expect(mockDbClient.delete).toHaveBeenCalledWith(schema.ingredients);
			expect(mockDbClient.delete).toHaveBeenCalledWith(schema.cocktails);
			expect(mockDbClient.delete).toHaveBeenCalledWith(schema.categories);

			// 2. 各マスターデータが挿入されるか
			expect(mockDbClient.insert).toHaveBeenCalledWith(schema.categories);
			expect(mockDbClient.insert).toHaveBeenCalledWith(schema.tags);
			expect(mockDbClient.insert).toHaveBeenCalledWith(schema.ingredientGroups);
			expect(mockDbClient.insert).toHaveBeenCalledWith(schema.ingredients);

			// 3. カクテル関連データが挿入されるか
			expect(mockDbClient.insert).toHaveBeenCalledWith(schema.cocktails);
			expect(mockDbClient.insert).toHaveBeenCalledWith(schema.instructions);
			expect(mockDbClient.insert).toHaveBeenCalledWith(
				schema.cocktailIngredients,
			);
			expect(mockDbClient.insert).toHaveBeenCalledWith(schema.cocktailTags);

			// カクテルの数だけcocktailsテーブルへのinsertが呼ばれることを確認
			const totalCocktails = 102; // 34 (contemporary) + 34 (new era) + 28 (unforgettables)
			const cocktailInsertCalls = mockDbClient.insert.mock.calls.filter(
				(call) => call[0] === schema.cocktails,
			);
			expect(cocktailInsertCalls.length).toBe(totalCocktails);
		});

		it("材料に紐づく材料グループが存在しない場合にエラーをスローすること", async () => {
			const { seed } = await import("../../scripts/seed");
			await expect(
				seed(mockEnv, {
					unforgettables: [],
					newEra: [],
					contemporaryClassics: [
						{
							name: "Invalid Cocktail",
							description: "...",
							ingredients: [
								{ name: "Invalid Ingredient", amount: "1", category: "蒸留酒" },
							],
							instructions: [],
							garnish: "",
							tags: [],
							imageUrl: "invalid.jpg",
						},
					],
				}),
			).rejects.toThrow(
				"Ingredient group not found for ingredient: Invalid Ingredient",
			);
		});
	});

	describe("runSeed()", () => {
		it("seed()が成功した場合、成功メッセージを出力しtrueを返すこと", async () => {
			const consoleLogSpy = vi
				.spyOn(console, "log")
				.mockImplementation(() => {});
			const { runSeed } = await import("../../scripts/seed");
			const result = await runSeed(mockEnv);

			expect(result).toBe(true);
			expect(consoleLogSpy).toHaveBeenCalledWith(
				"✅ Seed script completed successfully.",
			);

			consoleLogSpy.mockRestore();
		});

		it("seed()が失敗した場合、エラーメッセージを出力し例外をスローすること", async () => {
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});
			const errorMessage = "Test error";

			// drizzleのinsertを意図的に失敗させる
			mockDbClient.insert.mockImplementation(() => {
				throw new Error(errorMessage);
			});

			const { runSeed } = await import("../../scripts/seed");
			await expect(runSeed(mockEnv)).rejects.toThrow(errorMessage);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"❌ Seed script failed:",
				expect.any(Error),
			);
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error details:",
				errorMessage,
			);

			consoleErrorSpy.mockRestore();
		});
	});
});
