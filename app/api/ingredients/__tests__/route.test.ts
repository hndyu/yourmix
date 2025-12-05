import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type Mock,
} from "vitest";
import { GET } from "../route";
import type { Category, GroupedIngredient } from "../../../types/cocktail";

// モジュールのモック
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn(),
}));

// Drizzle ORMのクエリチェーンをモック
const mockDb = {
	select: vi.fn().mockReturnThis(),
	from: vi.fn().mockReturnThis(),
	orderBy: vi.fn().mockReturnThis(),
	leftJoin: vi.fn().mockReturnThis(),
};

vi.mock("drizzle-orm/d1", () => ({
	drizzle: vi.fn((dbBinding) => {
		if (!dbBinding) {
			throw new Error("D1Database binding is required.");
		}
		return mockDb;
	}),
}));

describe("GET /api/ingredients", () => {
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

		// Drizzleのクエリ結果をモック
		// Promise.allの順序に合わせてモックを設定
		const orderByMock = vi.fn();
		orderByMock
			.mockResolvedValueOnce(mockCategories) // categoriesクエリ
			.mockResolvedValueOnce(mockIngredientsWithGroups); // ingredientsクエリ

		mockDb.orderBy = orderByMock;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("正常なリクエストで材料とカテゴリのリストを返す", async () => {
		// Drizzleをインスタンス化する部分をモック


		const response = await GET();
		const data = (await response.json()) as {
			categories: Category[];
			ingredients: GroupedIngredient[];
			groupMapping: Record<string, string[]>;
		};

		expect(response.status).toBe(200);
		expect(data.categories).toEqual(mockCategories);
		expect(data.ingredients).toHaveLength(3); // ジン、ウォッカ、ウイスキー(グループ化)

		// ウイスキーが正しくグループ化されているか確認
		const whiskeyGroup = data.ingredients.find(
			(ing) => ing.name === "ウイスキー",
		);
		if (whiskeyGroup) {
			expect(whiskeyGroup.actualNames).toEqual([
				"ライ・ウイスキー",
				"バーボン・ウイスキー",
			]);
		} else {
			// whiskeyGroupが見つからなかった場合はテストを失敗させる
			expect(whiskeyGroup).toBeDefined();
		}

		// groupMappingが正しく生成されているか確認
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		expect(data.groupMapping["ウイスキー"]).toEqual([
			"ライ・ウイスキー",
			"バーボン・ウイスキー",
		]);
	});

	it("DBバインディングが存在しない場合、500エラーを返す", async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: {}, // DBなし
		});

		const response = await GET();
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "材料の取得中にエラーが発生しました。" });
	});

	it("データ取得中にエラーが発生した場合、500エラーを返す", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		// Drizzleのクエリでエラーを発生させる
		const orderByMock = vi.fn().mockRejectedValue(new Error("DB query failed"));
		mockDb.orderBy = orderByMock;



		const response = await GET();
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "材料の取得中にエラーが発生しました。" });
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error fetching ingredients:",
			expect.any(Error),
		);

		consoleErrorSpy.mockRestore();
	});

	it("データが空の場合でも正常に空の配列を返す", async () => {
		// Drizzleのクエリ結果を空配列でモック
		const orderByMock = vi.fn();
		orderByMock.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
		mockDb.orderBy = orderByMock;



		const response = await GET();
		const data = (await response.json()) as {
			categories: unknown[];
			ingredients: unknown[];
			groupMapping: Record<string, unknown>;
		};

		expect(response.status).toBe(200);
		expect(data.categories).toEqual([]);
		expect(data.ingredients).toEqual([]);
		expect(data.groupMapping).toEqual({});
	});
});
