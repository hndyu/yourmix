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

// Drizzle ORMのモック
const mockFindFirst = vi.fn();
const mockSelect = vi.fn();

const mockDb = {
	query: {
		cocktails: {
			findFirst: mockFindFirst,
		},
	},
	select: mockSelect,
};

describe("GET /api/cocktails/[slug]", () => {
	// モックデータ
	const mockSlug = "gin-tonic";

	const mockCocktailResult = {
		id: "1",
		name: "ジン・トニック",
		slug: "gin-tonic",
		description: "ジンの代表的なカクテル",
		imageUrl: "https://example.com/gin-tonic.jpg",
		garnish: "ライム",
		cocktailIngredients: [
			{
				amount: "45ml",
				option_group: null,
				ingredient: {
					id: 101,
					name: "ジン",
					group: {
						category: {
							name: "蒸留酒",
						},
					},
				},
			},
			{
				amount: "120ml",
				option_group: 1,
				ingredient: {
					id: 201,
					name: "トニックウォーター",
					group: {
						category: {
							name: "ソフトドリンク",
						},
					},
				},
			},
		],
		cocktailTags: [
			{ tag: { name: "定番", description: "説明1" } },
			{ tag: { name: "さっぱり", description: "説明2" } },
		],
		instructions: [
			{ text: "氷を入れたグラスにジンを注ぐ" },
			{ text: "トニックウォーターで満たす" },
		],
	};

	beforeEach(() => {
		// biome-ignore lint/suspicious/noExplicitAny: テストのために部分的なDBオブジェクトをモックする必要があります
		vi.mocked(getDb).mockResolvedValue(mockDb as any);
		(getCloudflareContext as Mock).mockReturnValue({
			env: {
				DB: "mock-db-binding",
			},
		});

		mockFindFirst.mockResolvedValue(mockCocktailResult);

		mockSelect.mockImplementation(() => {
			return {
				from: () => ({
					where: () => Promise.resolve([{ count: 10, isLiked: 1 }]),
				}),
			};
		});

		mockGetSession.mockResolvedValue({ user: { id: "test-user-id" } });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("正常なリクエストで指定されたカクテルの詳細を整形して返す", async () => {
		const response = await GET({} as Request, {
			params: Promise.resolve({ slug: mockSlug }),
		});
		const data = (await response.json()) as { cocktail: Cocktail };

		expect(response.status).toBe(200);
		expect(data.cocktail.id).toBe("1");
		expect(data.cocktail.name).toBe("ジン・トニック");
		expect(data.cocktail.garnish).toBe("ライム");

		// 材料が正しく整形されているか
		expect(data.cocktail.ingredients).toHaveLength(2);
		expect(data.cocktail.ingredients).toEqual([
			{
				id: 101,
				name: "ジン",
				category: "蒸留酒",
				amount: "45ml",
				option_group: undefined,
			},
			{
				id: 201,
				name: "トニックウォーター",
				category: "ソフトドリンク",
				amount: "120ml",
				option_group: 1,
			},
		]);

		// タグが重複なく整形されているか
		expect(data.cocktail.tags).toHaveLength(2);
		expect(data.cocktail.tags).toEqual([
			{ name: "定番", description: "説明1" },
			{ name: "さっぱり", description: "説明2" },
		]);

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
		mockFindFirst.mockResolvedValue(null);
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
		mockFindFirst.mockRejectedValue(dbError);

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
