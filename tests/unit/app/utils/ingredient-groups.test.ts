import type { DB } from "@/app/db/db";
import type * as schema from "@/app/db/schema";
import {
	getGroupDisplayName,
	getIngredientNamesByGroup,
} from "@/app/utils/ingredient-groups";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

// DrizzleD1Database<typeof schema> の型をモックします。
// 関数の型シグネチャに合わせるため as unknown as を使用しています。
const mockDb = {
	query: {
		ingredients: {
			findFirst: vi.fn(),
		},
		ingredientGroups: {
			findFirst: vi.fn(),
		},
	},
} as unknown as DB;

describe("ingredient-groups", () => {
	beforeEach(() => {
		// 各テストの前にモックをリセットします
		vi.resetAllMocks();
	});

	describe("getGroupDisplayName", () => {
		it("材料名に紐づくグループ表示名が見つかった場合、その表示名を返す", async () => {
			// モック: DBがグループ情報を持つ材料を返す
			(mockDb.query.ingredients.findFirst as Mock).mockResolvedValue({
				group: {
					displayName: "ラム",
				},
			});

			const displayName = await getGroupDisplayName(mockDb, "ホワイト・ラム");
			expect(displayName).toBe("ラム");
			expect(mockDb.query.ingredients.findFirst).toHaveBeenCalledTimes(1);
		});

		it("材料は見つかったがグループに紐づいていない場合、nullを返す", async () => {
			// モック: DBがグループ情報を持たない材料を返す
			(mockDb.query.ingredients.findFirst as Mock).mockResolvedValue({
				group: null,
			});

			const displayName = await getGroupDisplayName(mockDb, "ウォッカ");
			expect(displayName).toBe(null);
		});

		it("材料名に紐づくデータが見つからない場合、nullを返す", async () => {
			// モック: DBが何も返さない
			(mockDb.query.ingredients.findFirst as Mock).mockResolvedValue(undefined);

			const displayName = await getGroupDisplayName(mockDb, "存在しない材料");
			expect(displayName).toBe(null);
		});
	});

	describe("getIngredientNamesByGroup", () => {
		it("グループ表示名に紐づく材料名のリストを返す", async () => {
			// モック: DBが材料リストを持つグループを返す
			(mockDb.query.ingredientGroups.findFirst as Mock).mockResolvedValue({
				ingredients: [{ name: "ホワイト・ラム" }, { name: "ダーク・ラム" }],
			});

			const ingredients = await getIngredientNamesByGroup(mockDb, "ラム");
			expect(ingredients).toEqual(["ホワイト・ラム", "ダーク・ラム"]);
			expect(mockDb.query.ingredientGroups.findFirst).toHaveBeenCalledTimes(1);
		});

		it("グループ表示名に紐づく材料が見つからない場合、空の配列を返す", async () => {
			// モック: DBが何も返さない
			(mockDb.query.ingredientGroups.findFirst as Mock).mockResolvedValue(
				undefined,
			);

			const ingredients = await getIngredientNamesByGroup(
				mockDb,
				"存在しないグループ",
			);
			expect(ingredients).toEqual([]);
		});
	});
});
