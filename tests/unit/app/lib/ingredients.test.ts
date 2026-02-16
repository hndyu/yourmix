import type { DB } from "@/app/db/db";
import { getIngredientsMasterData } from "@/app/lib/ingredients";
import type { Category, Ingredient } from "@/app/types/cocktail";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

// モジュールのモック
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn(),
}));

vi.mock("@/app/db/db", () => ({
	getDb: vi.fn(),
}));

import { getDb } from "@/app/db/db";

describe("getIngredientsMasterData", () => {
	// モックデータ
	const mockCategories = [
		{ id: 1, name: "蒸留酒", sortOrder: 1, icon: "Liquor", description: "..." },
		{
			id: 2,
			name: "醸造酒",
			sortOrder: 2,
			icon: "WineBar",
			description: "...",
		},
	];

	const mockIngredientsWithGroups = [
		{
			id: 101,
			name: "ジン",
			categoryName: "蒸留酒",
			groupId: 20,
			groupDisplayName: "ジン",
			groupSortOrder: 20,
			groupDescription: "ジンの説明",
		},
		{
			id: 102,
			name: "ウォッカ",
			categoryName: "蒸留酒",
			groupId: 21,
			groupDisplayName: "ウォッカ",
			groupSortOrder: 21,
			groupDescription: "ウォッカの説明",
		},
		{
			id: 103,
			name: "ライ・ウイスキー",
			categoryName: "蒸留酒",
			groupId: 22,
			groupDisplayName: "ウイスキー",
			groupSortOrder: 22,
			groupDescription: "ウイスキーの説明",
		},
		{
			id: 104,
			name: "バーボン・ウイスキー",
			categoryName: "蒸留酒",
			groupId: 22,
			groupDisplayName: "ウイスキー",
			groupSortOrder: 22,
			groupDescription: "ウイスキーの説明",
		},
	];

	beforeEach(() => {
		// getCloudflareContextのモックをセットアップ
		(getCloudflareContext as Mock).mockReturnValue({
			env: {
				DB: "mock-db-binding",
			},
		});

		const orderByMock = vi
			.fn()
			.mockResolvedValueOnce(mockCategories) // categoriesクエリ
			.mockResolvedValueOnce(mockIngredientsWithGroups); // ingredientsクエリ

		vi.mocked(getDb).mockResolvedValue({
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			orderBy: orderByMock,
			leftJoin: vi.fn().mockReturnThis(),
		} as unknown as DB);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("正常に材料とカテゴリのリストを取得し、グループ化が正しいことを確認する", async () => {
		const data = await getIngredientsMasterData();

		expect(data.categories).toEqual(mockCategories);
		expect(data.ingredients).toHaveLength(3); // ジン、ウォッカ、ウイスキー(グループ化)

		// ウイスキーが正しくグループ化されているか確認
		const whiskeyGroup = data.ingredients.find(
			(ing) => ing.name === "ウイスキー",
		);
		expect(whiskeyGroup).toBeDefined();
		if (whiskeyGroup) {
			expect(whiskeyGroup.actualNames).toEqual([
				"ライ・ウイスキー",
				"バーボン・ウイスキー",
			]);
			expect(whiskeyGroup.actualIds).toEqual([103, 104]);
		}

		// groupMappingが正しく生成されているか確認 (O(N)化されたロジックの検証)
		// biome-ignore lint/complexity/useLiteralKeys: 日本語キーなので文字列リテラルを使う
		expect(data.groupMapping["ウイスキー"]).toEqual([
			"ライ・ウイスキー",
			"バーボン・ウイスキー",
		]);
		// biome-ignore lint/complexity/useLiteralKeys: 日本語キーなので文字列リテラルを使う
		expect(data.groupMapping["ジン"]).toEqual(["ジン"]);
		// biome-ignore lint/complexity/useLiteralKeys: 日本語キーなので文字列リテラルを使う
		expect(data.groupMapping["ウォッカ"]).toEqual(["ウォッカ"]);
	});

	it("データが空の場合でも正常に動作することを確認する", async () => {
		const orderByMock = vi
			.fn()
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([]);

		vi.mocked(getDb).mockResolvedValue({
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			orderBy: orderByMock,
			leftJoin: vi.fn().mockReturnThis(),
		} as unknown as DB);

		const data = await getIngredientsMasterData();

		expect(data.categories).toEqual([]);
		expect(data.ingredients).toEqual([]);
		expect(data.groupMapping).toEqual({});
	});
});
