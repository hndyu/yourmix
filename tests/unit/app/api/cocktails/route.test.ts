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
import { GET } from "@/app/api/cocktails/route";
import type { Cocktail } from "@/app/types/cocktail";

// 外部モジュールのモック
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn(),
}));

// Drizzle ORMのクエリをモック
const mockFindMany = vi.fn();
const mockDb = {
	query: {
		cocktails: {
			findMany: mockFindMany,
		},
	},
};

vi.mock("drizzle-orm/d1", () => ({
	drizzle: vi.fn((dbBinding) => {
		if (!dbBinding) {
			throw new Error("D1Database binding is required.");
		}
		return mockDb;
	}),
}));

describe("GET /api/cocktails", () => {
	// モックデータ
	const mockCocktailsData = [
		{
			id: 1,
			name: "ジン・トニック",
			description: "ジンの代表的なカクテル",
			imageUrl: "https://example.com/gin-tonic.jpg",
			garnish: "ライム",
			cocktailIngredients: [
				{
					ingredient: { id: 101, name: "ジン", categoryId: 1 },
					amount: "45ml",
				},
				{
					ingredient: { id: 201, name: "トニックウォーター", categoryId: 5 },
					amount: "120ml",
				},
			],
			instructions: [
				{ step: 1, text: "氷を入れたグラスにジンを注ぐ" },
				{ step: 2, text: "トニックウォーターで満たす" },
			],
			cocktailTags: [{ tag: { name: "定番" } }, { tag: { name: "さっぱり" } }],
		},
		{
			id: 2,
			name: "モスコミュール",
			description: null, // descriptionがnullの場合
			imageUrl: null, // imageUrlがnullの場合
			garnish: null, // garnishがnullの場合
			cocktailIngredients: [
				{
					ingredient: { id: 102, name: "ウォッカ", categoryId: 1 },
					amount: "45ml",
				},
				{
					ingredient: { id: 202, name: "ジンジャーエール", categoryId: 5 },
					amount: "120ml",
				},
			],
			instructions: [{ step: 1, text: "混ぜる" }],
			cocktailTags: [{ tag: { name: "定番" } }],
		},
	];

	beforeEach(() => {
		// getCloudflareContextのモックをセットアップ
		(getCloudflareContext as Mock).mockReturnValue({
			env: {
				DB: "mock-db-binding",
			},
		});
		// デフォルトで全カクテルデータを返すように設定
		mockFindMany.mockResolvedValue(mockCocktailsData);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("正常なリクエストでカクテルリストを整形して返す", async () => {
		const request = new Request("http://localhost/api/cocktails");
		const response = await GET(request);
		const data = (await response.json()) as { cocktails: Cocktail[] };

		expect(response.status).toBe(200);
		expect(data.cocktails).toHaveLength(2);

		// 1件目のデータ整形確認
		const firstCocktail = data.cocktails[0];
		expect(firstCocktail.name).toBe("ジン・トニック");
		expect(firstCocktail.description).toBe("ジンの代表的なカクテル");
		expect(firstCocktail.imageUrl).toBe("https://example.com/gin-tonic.jpg");
		expect(firstCocktail.garnish).toBe("ライム");
		expect(firstCocktail.ingredients).toEqual([
			{ id: 101, name: "ジン", amount: "45ml", category: 1 },
			{
				id: 201,
				name: "トニックウォーター",
				amount: "120ml",
				category: 5,
			},
		]);
		expect(firstCocktail.instructions).toEqual([
			"氷を入れたグラスにジンを注ぐ",
			"トニックウォーターで満たす",
		]);
		expect(firstCocktail.tags).toEqual(["定番", "さっぱり"]);

		// 2件目のデータ整形確認 (null値が正しく処理されるか)
		const secondCocktail = data.cocktails[1];
		expect(secondCocktail.description).toBe("");
		expect(secondCocktail.imageUrl).toBeUndefined();
		expect(secondCocktail.garnish).toBeUndefined();
	});

	it("ingredientsクエリパラメータでカクテルをフィルタリングする", async () => {
		const request = new Request(
			"http://localhost/api/cocktails?ingredients=101,201",
		);
		await GET(request);

		// findManyが正しい引数で呼ばれたか確認
		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.any(Function), // where句が設定されていること
			}),
		);
	});

	it("データが存在しない場合、空の配列を返す", async () => {
		mockFindMany.mockResolvedValue([]); // DBからの応答を空にする
		const request = new Request("http://localhost/api/cocktails");
		const response = await GET(request);
		const data = (await response.json()) as { cocktails: unknown[] };

		expect(response.status).toBe(200);
		expect(data.cocktails).toEqual([]);
	});

	it("DBバインディングが存在しない場合、500エラーを返す", async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: {}, // DBなし
		});

		const request = new Request("http://localhost/api/cocktails");
		const response = await GET(request);
		const data = (await response.json()) as { error: string };

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "カクテルの取得中にエラーが発生しました。" });
	});

	it("データ取得中にエラーが発生した場合、500エラーを返す", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		// DBクエリでエラーを発生させる
		mockFindMany.mockRejectedValue(new Error("DB query failed"));

		const request = new Request("http://localhost/api/cocktails");
		const response = await GET(request);
		const data = (await response.json()) as { error: string };

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "カクテルの取得中にエラーが発生しました。" });
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error fetching cocktails:",
			expect.any(Error),
		);

		consoleErrorSpy.mockRestore();
	});
});
