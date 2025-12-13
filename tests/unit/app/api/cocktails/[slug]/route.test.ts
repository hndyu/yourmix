import { GET } from "@/app/api/cocktails/[slug]/route";
import type { Cocktail } from "@/app/types/cocktail";
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
vi.mock("@/app/db/db");
import { getDb } from "@/app/db/db";

// 外部モジュールのモック
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn(),
}));
vi.mock("@/app/db/db");

// Auth関連のモック
const mockGetSession = vi.fn();
vi.mock("@/app/auth", async (importOriginal) => {
	const mod = await importOriginal<typeof import("@/app/auth")>();
	return {
		...mod,
		initAuth: vi.fn(async () => ({
			api: {
				getSession: mockGetSession,
			},
			requestContext: {
				cf: {
					// ダミーのCloudflare context
					country: "US",
					colo: "LAX",
				},
			},
		})),
	};
});

// Drizzle ORMのクエリチェーンをモック
const mockOrderBy = vi.fn();
const mockMainWhere = vi.fn();
const mockCountWhere = vi.fn();
const mockLikeWhere = vi.fn();
const mockSelect = vi.fn();

const mockDb = {
	select: mockSelect,
};

describe("GET /api/cocktails/[slug]", () => {
	// モックデータ
	const mockSlug = "gin-tonic";
	const mockDbResult = [
		{
			cocktails: {
				id: 1,
				name: "ジン・トニック",
				slug: "gin-tonic",
				description: "ジンの代表的なカクテル",
				imageUrl: "https://example.com/gin-tonic.jpg",
				garnish: "ライム",
			},
			cocktail_ingredients: {
				cocktailId: 1,
				ingredientId: 101,
				amount: "45ml",
				option_group: null,
			},
			ingredients: {
				id: 101,
				name: "ジン",
				categoryId: 1,
				groupId: 20,
			},
			cocktail_tags: { cocktailId: 1, tagId: 1 },
			tags: { id: 1, name: "定番" },
			instructions: {
				cocktailId: 1,
				step: 1,
				text: "氷を入れたグラスにジンを注ぐ",
			},
			categories: { id: 1, name: "蒸留酒", sortOrder: 1 },
			ingredient_groups: { id: 20, name: "ジン", sortOrder: 20 },
		},
		{
			cocktails: {
				id: 1,
				name: "ジン・トニック",
				slug: "gin-tonic",
				description: "ジンの代表的なカクテル",
				imageUrl: "https://example.com/gin-tonic.jpg",
				garnish: "ライム",
			},
			cocktail_ingredients: {
				cocktailId: 1,
				ingredientId: 201,
				amount: "120ml",
				option_group: "g1",
			},
			ingredients: {
				id: 201,
				name: "トニックウォーター",
				categoryId: 5,
				groupId: 50,
			},
			cocktail_tags: { cocktailId: 1, tagId: 2 },
			tags: { id: 2, name: "さっぱり" },
			instructions: {
				cocktailId: 1,
				step: 2,
				text: "トニックウォーターで満たす",
			},
			categories: { id: 5, name: "ソフトドリンク", sortOrder: 5 },
			ingredient_groups: { id: 50, name: "炭酸飲料", sortOrder: 50 },
		},
		// 同じタグや材料が複数行あっても重複しないことを確認するためのデータ
		{
			cocktails: { id: 1, name: "ジン・トニック", slug: "gin-tonic" },
			tags: { id: 1, name: "定番" }, // 重複タグ
			ingredients: { id: 101, name: "ジン" }, // 重複材料
			instructions: { text: "氷を入れたグラスにジンを注ぐ" }, // 重複手順
		},
	];

	beforeEach(() => {
		// biome-ignore lint/suspicious/noExplicitAny: テストのために部分的なDBオブジェクトをモックする必要があります
		vi.mocked(getDb).mockResolvedValue(mockDb as any);
		(getCloudflareContext as Mock).mockReturnValue({
			env: {
				DB: "mock-db-binding",
			},
		});

		// Drizzleのselectメソッドのモックを実装
		const mainQueryChain = {
			leftJoin: vi.fn().mockReturnThis(),
			orderBy: mockOrderBy,
		};
		const countQueryChain = vi.fn();
		const likeQueryChain = vi.fn();

		mockSelect.mockImplementation((fields) => {
			// select() - Main or Like Query
			if (!fields) {
				// 1回目のselect()呼び出し (Main Query)
				if (mockSelect.mock.calls.length === 1) {
					return {
						from: () => ({
							where: () => mainQueryChain,
						}),
					};
				}
				// 2回目のselect()呼び出し (Like Query)
				return {
					from: () => ({
						where: () => likeQueryChain,
					}),
				};
			}

			// select({ count: ... }) - Count Query
			return {
				from: () => ({
					where: () => countQueryChain,
				}),
			};
		});

		// 各where句の先のモックを設定
		mockOrderBy.mockResolvedValue(mockDbResult);
		countQueryChain.mockResolvedValue([{ count: 10 }]);
		likeQueryChain.mockResolvedValue([{ userId: "test-user-id" }]);

		mockGetSession.mockResolvedValue({ user: { id: "test-user-id" } });
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks(); // モックをリセット
	});

	it("正常なリクエストで指定されたカクテルの詳細を整形して返す", async () => {
		const response = await GET({} as Request, {
			params: Promise.resolve({ slug: mockSlug }),
		});
		const data = (await response.json()) as { cocktail: Cocktail };

		expect(response.status).toBe(200);
		expect(data.cocktail.id).toBe(1);
		expect(data.cocktail.name).toBe("ジン・トニック");
		expect(data.cocktail.garnish).toBe("ライム");

		// 材料が正しく整形されているか
		expect(data.cocktail.ingredients).toHaveLength(2);
		expect(data.cocktail.ingredients).toEqual([
			{
				id: 101,
				name: "ジン",
				categoryId: 1,
				groupId: 20,
				category: "蒸留酒",
				amount: "45ml",
				option_group: undefined,
			},
			{
				id: 201,
				name: "トニックウォーター",
				categoryId: 5,
				groupId: 50,
				category: "ソフトドリンク",
				amount: "120ml",
				option_group: "g1",
			},
		]);

		// タグが重複なく整形されているか
		expect(data.cocktail.tags).toHaveLength(2);
		expect(data.cocktail.tags).toEqual(["定番", "さっぱり"]);

		// 手順が重複なく整形されているか
		expect(data.cocktail.instructions).toHaveLength(2);
		expect(data.cocktail.instructions).toEqual([
			"氷を入れたグラスにジンを注ぐ",
			"トニックウォーターで満たす",
		]);

		// いいね数といいね状態が正しくセットされているか
		expect(data.cocktail.deliciousCount).toBe(10);
		expect(data.cocktail.isLiked).toBe(true);
	});

	it("slugが指定されていない場合、400エラーを返す", async () => {
		const response = await GET({} as Request, {
			params: Promise.resolve({} as { slug: string }),
		});
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toEqual({ error: "スラグが指定されていません。" });
	});

	it("指定されたslugのカクテルが見つからない場合、404エラーを返す", async () => {
		mockOrderBy.mockResolvedValue([]); // DBからの応答を空にする
		const response = await GET({} as Request, {
			params: Promise.resolve({ slug: "invalid-slug" }),
		});
		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data).toEqual({ error: "指定されたカクテルが見つかりません。" });
	});

	it("DBバインディングが存在しない場合に500エラーを返す", async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: {}, // DBなし
		});
		// getDbのモックを上書き
		vi.mocked(getDb).mockImplementationOnce(async () => {
			throw new Error("D1Database binding is required.");
		});

		const response = await GET({} as Request, {
			params: Promise.resolve({ slug: mockSlug }),
		});
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "カクテルの取得中にエラーが発生しました。" });
	});

	it("データ取得中にエラーが発生した場合、500エラーを返す", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		const dbError = new Error("DB query failed");
		mockOrderBy.mockRejectedValue(dbError);

		const response = await GET({} as Request, {
			params: Promise.resolve({ slug: mockSlug }),
		});
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "カクテルの取得中にエラーが発生しました。" });
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error fetching cocktail for slug:",
			dbError,
		);

		consoleErrorSpy.mockRestore();
	});
});
