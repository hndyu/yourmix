import { getDb } from "@/app/db/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

// 外部モジュールのモック
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn(),
}));

const mockGenerateContent = vi.fn();
vi.mock("@google/genai", () => ({
	GoogleGenAI: vi.fn(() => ({
		models: {
			generateContent: mockGenerateContent,
		},
	})),
	Type: {
		ARRAY: "array",
		OBJECT: "object",
		STRING: "string",
	},
}));

vi.mock("next/server", () => ({
	NextResponse: {
		json: vi.fn((body: unknown, options?: ResponseInit) => ({
			json: () => Promise.resolve(body),
			status: options?.status || 200,
		})),
	},
}));

vi.mock("@/app/db/db", async () => {
	const actual =
		await vi.importActual<typeof import("@/app/db/db")>("@/app/db/db");
	return {
		...actual,
		getDb: vi.fn(),
	};
});

// Drizzle ORMのモック
const mockDb = {
	select: vi.fn(),
	selectDistinct: vi.fn(),
};

// Drizzleモックの実装をリセットするヘルパー関数
const resetDrizzleMocks = () => {
	mockDb.select.mockImplementation(() => ({
		from: vi.fn(() => ({
			where: vi.fn(() => ({
				limit: vi.fn(() => Promise.resolve([])), // デフォルトは空配列を返す
			})),
		})),
	}));
	mockDb.selectDistinct.mockImplementation(() => ({
		from: vi.fn(() => ({
			innerJoin: vi.fn(() => ({
				where: vi.fn(() => Promise.resolve([])), // デフォルトは空配列を返す
			})),
		})),
	}));
};

describe("POST /api/generate-cocktail", () => {
	const mockCocktailResponse = {
		name: "モックカクテル",
		description: "これはモックのカクテルです。",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "トニックウォーター", amount: "90ml" },
		],
		instructions: ["混ぜる", "飲む"],
		garnish: "レモンスライス",
	};

	beforeEach(async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: {
				DB: "mock-db-binding",
			},
		});
		vi.mocked(getDb).mockResolvedValue(
			await (mockDb as unknown as ReturnType<typeof getDb>),
		);

		mockGenerateContent.mockResolvedValue({
			text: JSON.stringify([mockCocktailResponse]),
		});

		resetDrizzleMocks(); // 各テストの前にDrizzleモックをリセット
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs(); // スタブした環境変数をクリーンアップ
		vi.resetModules(); // モジュールキャッシュをリセットし、異なる環境変数で再インポートできるようにする
	});

	it("正常なリクエストでカクテルレシピを返す", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		// 材料検証用のDBクエリをモック
		// 1. ingredientGroups
		mockDb.select.mockReturnValueOnce({
			from: vi.fn().mockResolvedValue([{ displayName: "ジン" }]),
		});
		// 2. ingredients
		mockDb.select.mockReturnValueOnce({
			from: vi.fn().mockResolvedValue([{ name: "トニックウォーター" }]),
		});

		const requestBody = { ingredients: ["ジン", "トニックウォーター"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual(mockCocktailResponse);
		expect(mockGenerateContent).toHaveBeenCalledTimes(1);
		expect(mockGenerateContent).toHaveBeenCalledWith(
			expect.objectContaining({
				contents:
					"ジン、トニックウォーターをすべて材料として使い、独創的で美味しいオリジナルカクテルのレシピを1つ提案してください。回答は必ず日本語で行ってください。",
			}),
		);
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			mockCocktailResponse,
		);
	});

	it("特定の材料名（グループ名以外）も正常に受け付ける", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		// 材料検証用のDBクエリをモック
		// 1. ingredientGroups (ジンジャーエールはここにはない)
		mockDb.select.mockReturnValueOnce({
			from: vi.fn().mockResolvedValue([{ displayName: "ジン" }]),
		});
		// 2. ingredients (ジンジャーエールはここにある)
		mockDb.select.mockReturnValueOnce({
			from: vi.fn().mockResolvedValue([{ name: "ジンジャーエール" }]),
		});

		const requestBody = { ingredients: ["ジン", "ジンジャーエール"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(mockGenerateContent).toHaveBeenCalledWith(
			expect.objectContaining({
				contents:
					"ジン、ジンジャーエールをすべて材料として使い、独創的で美味しいオリジナルカクテルのレシピを1つ提案してください。回答は必ず日本語で行ってください。",
			}),
		);
	});

	it("APIキーが設定されていない場合、500エラーを返す", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		vi.stubEnv("GEMINI_API_KEY", undefined); // APIキーを未定義に設定
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		const requestBody = { ingredients: ["ジン"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "APIキーが設定されていません。" });
		expect(mockGenerateContent).not.toHaveBeenCalled();
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			{ error: "APIキーが設定されていません。" },
			{ status: 500 },
		);
		expect(consoleErrorSpy).toHaveBeenCalledWith("GEMINI_API_KEY is not set.");

		consoleErrorSpy.mockRestore();
	});

	it("DBバインディングが存在しない場合、500エラーを返す", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		(getCloudflareContext as Mock).mockReturnValue({
			env: {}, // DBなし
		});
		vi.mocked(getDb).mockImplementationOnce(async () => {
			throw new Error("D1Database binding is required.");
		});

		const requestBody = { ingredients: ["ジン"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "カクテルの生成中にエラーが発生しました。" });
		expect(mockGenerateContent).not.toHaveBeenCalled();
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			{ error: "カクテルの生成中にエラーが発生しました。" },
			{ status: 500 },
		);
	});

	it("材料が指定されていない場合、400エラーを返す (空配列)", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		const requestBody = { ingredients: [] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toEqual({ error: "材料が指定されていません。" });
		expect(mockGenerateContent).not.toHaveBeenCalled();
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			{ error: "材料が指定されていません。" },
			{ status: 400 },
		);
	});

	it("材料が指定されていない場合、400エラーを返す (プロパティなし)", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		const requestBody = {}; // 'ingredients'プロパティなし
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toEqual({ error: "材料が指定されていません。" });
		expect(mockGenerateContent).not.toHaveBeenCalled();
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			{ error: "材料が指定されていません。" },
			{ status: 400 },
		);
	});

	it("DBクエリ中にエラーが発生した場合、500エラーを返す", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		// DBクエリ中にエラーを発生させる (バリデーションの段階でエラー)
		mockDb.select.mockReturnValue({
			from: vi.fn().mockRejectedValue(new Error("DB query failed")),
		});

		const requestBody = { ingredients: ["ジン"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "カクテルの生成中にエラーが発生しました。" });
		expect(mockGenerateContent).not.toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error generating cocktail:",
			expect.any(Error),
		);
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			{ error: "カクテルの生成中にエラーが発生しました。" },
			{ status: 500 },
		);

		consoleErrorSpy.mockRestore();
	});

	it("AIからの応答が空の場合、500エラーを返す", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		// 材料検証用のDBクエリをモック
		mockDb.select.mockReturnValue({
			from: vi.fn().mockResolvedValue([{ displayName: "ジン" }]),
		});

		mockGenerateContent.mockResolvedValue({
			text: "", // 空の応答
		});

		const requestBody = { ingredients: ["ジン"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "AIからの応答を解析できませんでした。" });
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			{ error: "AIからの応答を解析できませんでした。" },
			{ status: 500 },
		);
	});

	it("AIからの応答が不正なJSONの場合、500エラーを返す", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");
		vi.mocked(NextResponse.json).mockClear();

		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		// 材料検証用のDBクエリをモック
		mockDb.select.mockReturnValue({
			from: vi.fn().mockResolvedValue([{ displayName: "ジン" }]),
		});

		mockGenerateContent.mockResolvedValue({
			text: "this is not valid json", // 不正なJSON
		});

		const requestBody = { ingredients: ["ジン"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toEqual({ error: "AIからの応答を解析できませんでした。" });
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Failed to parse Gemini response:",
			"this is not valid json",
		);
		expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
			{ error: "AIからの応答を解析できませんでした。" },
			{ status: 500 },
		);

		consoleErrorSpy.mockRestore();
	});

	it("「その他の蒸留酒」が正しく処理され、プロンプトに反映される", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");

		// DBクエリをモック
		mockDb.select
			// 1. 材料検証 (Groups)
			.mockReturnValueOnce({
				from: vi
					.fn()
					.mockResolvedValue([
						{ displayName: "その他の蒸留酒" },
						{ displayName: "レモン" },
					]),
			})
			// 2. 材料検証 (Ingredients)
			.mockReturnValueOnce({
				from: vi.fn().mockResolvedValue([]),
			})
			// 3. "蒸留酒"カテゴリIDを取得
			.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue([{ id: 1 }]), // spiritsCategory
					}),
				}),
			});

		// 4. "その他の蒸留酒"を除く蒸留酒グループを取得
		mockDb.selectDistinct.mockReturnValueOnce({
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValue([
							{ displayName: "ジン" },
							{ displayName: "ウォッカ" },
							{ displayName: "ウイスキー" },
						]),
				}),
			}),
		});

		const requestBody = { ingredients: ["その他の蒸留酒", "レモン"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		await POST(request);

		expect(mockGenerateContent).toHaveBeenCalledTimes(1);
		expect(mockGenerateContent).toHaveBeenCalledWith(
			expect.objectContaining({
				contents:
					"ジン・ウォッカ・ウイスキー以外の蒸留酒、レモンをすべて材料として使い、独創的で美味しいオリジナルカクテルのレシピを1つ提案してください。回答は必ず日本語で行ってください。",
			}),
		);
	});

	it("「その他」が正しく処理され、プロンプトに反映される", async () => {
		vi.stubEnv("GEMINI_API_KEY", "test-api-key");
		const { POST } = await import("@/app/api/generate-cocktail/route");

		// DBクエリをモック
		mockDb.select
			// 1. 材料検証 (Groups)
			.mockReturnValueOnce({
				from: vi
					.fn()
					.mockResolvedValue([
						{ displayName: "その他" },
						{ displayName: "砂糖" },
					]),
			})
			// 2. 材料検証 (Ingredients)
			.mockReturnValueOnce({
				from: vi.fn().mockResolvedValue([]),
			})
			// 3. "その他"を除くカテゴリを取得
			.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValue([{ name: "蒸留酒" }, { name: "醸造酒" }]),
				}),
			});

		const requestBody = { ingredients: ["その他", "砂糖"] };
		const request = {
			json: () => Promise.resolve(requestBody),
		} as Request;

		await POST(request);

		expect(mockGenerateContent).toHaveBeenCalledTimes(1);
		expect(mockGenerateContent).toHaveBeenCalledWith(
			expect.objectContaining({
				contents:
					"蒸留酒・醸造酒など以外のもの、砂糖をすべて材料として使い、独創的で美味しいオリジナルカクテルのレシピを1つ提案してください。回答は必ず日本語で行ってください。",
			}),
		);
	});
});
