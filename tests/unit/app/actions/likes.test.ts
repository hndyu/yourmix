import { toggleLikeAction } from "@/app/actions/likes";
import { initAuth } from "@/app/auth";
import { type DB, getDb } from "@/app/db/db";
import { deliciousLikes } from "@/app/db/schema";
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

// mock drizzle-orm functions
vi.mock("drizzle-orm", async (importOriginal) => {
	const actual = await importOriginal<typeof import("drizzle-orm")>();
	return {
		...actual,
		and: vi.fn((...args) => ({ type: "and", args })),
		eq: vi.fn((...args) => ({ type: "eq", args })),
		sql: vi.fn((...args) => ({ type: "sql", args })),
	};
});

describe("likes actions", () => {
	const mockUser = { id: "user-1" };
	const mockSession = { user: mockUser };

	const mockDb = {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		batch: vi.fn(),
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
	};

	const mockAuth = {
		api: {
			getSession: vi.fn(),
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(initAuth).mockResolvedValue(
			mockAuth as unknown as Awaited<ReturnType<typeof initAuth>>,
		);
		vi.mocked(getDb).mockResolvedValue(mockDb as unknown as DB);
		vi.mocked(headers).mockResolvedValue(new Headers());
	});

	describe("toggleLikeAction", () => {
		const cocktailId = "cocktail-1";

		it("should add a like when not already liked", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			// First select for statusInfo
			mockDb.where.mockResolvedValueOnce([{ isLiked: 0, totalCount: 5 }]);
			// Batch result [delete/insert, count]
			mockDb.batch.mockResolvedValueOnce([{}, [{ count: 6 }]]);

			const response = await toggleLikeAction(cocktailId);

			expect(mockDb.insert).toHaveBeenCalledWith(deliciousLikes);
			expect(mockDb.batch).toHaveBeenCalled();
			expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith(
				`/recipes/${cocktailId}`,
			);
			expect(response).toEqual({
				success: true,
				data: { isLiked: true, count: 6 },
			});
		});

		it("should remove a like when already liked", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			// First select for statusInfo
			mockDb.where.mockResolvedValueOnce([{ isLiked: 1, totalCount: 6 }]);
			// Batch result [delete/insert, count]
			mockDb.batch.mockResolvedValueOnce([{}, [{ count: 5 }]]);

			const response = await toggleLikeAction(cocktailId);

			expect(mockDb.delete).toHaveBeenCalledWith(deliciousLikes);
			expect(mockDb.batch).toHaveBeenCalled();
			expect(response).toEqual({
				success: true,
				data: { isLiked: false, count: 5 },
			});
		});

		it("should return error when not authenticated", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(null);

			const response = await toggleLikeAction(cocktailId);

			expect(response).toEqual({
				success: false,
				error: "ログインが必要です。",
			});
		});
	});
});
