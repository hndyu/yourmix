import { toggleLikeAction } from "@/app/actions/likes";
import { initAuth } from "@/app/auth";
import { type DB, getDb } from "@/app/db/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/auth", () => ({
	initAuth: vi.fn(),
}));

vi.mock("@/app/db/db", () => ({
	getDb: vi.fn(),
}));

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
	headers: vi.fn(),
}));

describe("likes actions", () => {
	const mockUser = { id: "user-1" };
	const mockSession = { user: mockUser };

	// Setup a more sophisticated mock that can handle chained calls and batch
	const createMockDb = () => {
		// biome-ignore lint/suspicious/noExplicitAny: mock
		const mock: any = {
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn(),
			insert: vi.fn().mockReturnThis(),
			values: vi.fn().mockReturnThis(),
			delete: vi.fn().mockReturnThis(),
			batch: vi
				.fn()
				.mockImplementation((queries: unknown[]) => Promise.all(queries)),
		};
		// Set return values for chained calls that don't use 'where' at the end
		mock.values.mockReturnValue(mock);
		return mock;
	};

	// biome-ignore lint/suspicious/noExplicitAny: mock
	let mockDb: any;
	const mockAuth = {
		api: {
			getSession: vi.fn(),
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockDb = createMockDb();
		vi.mocked(initAuth).mockResolvedValue(
			mockAuth as unknown as Awaited<ReturnType<typeof initAuth>>,
		);
		vi.mocked(getDb).mockResolvedValue(mockDb as unknown as DB);
		vi.mocked(headers).mockResolvedValue(new Headers());
	});

	describe("toggleLikeAction", () => {
		it("未認証の場合はエラーを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(null);
			const response = await toggleLikeAction("cocktail-1");
			expect(response).toEqual({
				success: false,
				error: "ログインが必要です。",
			});
		});

		it("まだ「おいしい！」していない場合、追加してカウントを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);

			// 1. Initial check: not liked, current count 5
			// 2. Insert execution (part of batch) - insert().values() is called
			// 3. Final count retrieval (part of batch)
			mockDb.where
				.mockResolvedValueOnce([{ isLiked: 0, currentCount: 5 }]) // Call 1: initial check
				.mockResolvedValueOnce([{ count: 6 }]); // Call 2: select count in batch (insert has no where)

			const response = await toggleLikeAction("cocktail-1");

			expect(mockDb.insert).toHaveBeenCalled();
			expect(mockDb.batch).toHaveBeenCalled();
			expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith(
				"/recipes/cocktail-1",
			);
			expect(response).toEqual({
				success: true,
				data: { isLiked: true, count: 6 },
			});
		});

		it("すでに「おいしい！」している場合、削除してカウントを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);

			// 1. Initial check: already liked, current count 5
			// 2. Delete execution (part of batch) - delete().where()
			// 3. Final count retrieval (part of batch) - select().from().where()
			mockDb.where
				.mockResolvedValueOnce([{ isLiked: 1, currentCount: 5 }]) // Call 1: initial check
				.mockResolvedValueOnce({}) // Call 2: delete().where() result
				.mockResolvedValueOnce([{ count: 4 }]); // Call 3: select().where() result

			const response = await toggleLikeAction("cocktail-1");

			expect(mockDb.delete).toHaveBeenCalled();
			expect(mockDb.batch).toHaveBeenCalled();
			expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith(
				"/recipes/cocktail-1",
			);
			expect(response).toEqual({
				success: true,
				data: { isLiked: false, count: 4 },
			});
		});
	});
});
