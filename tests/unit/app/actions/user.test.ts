import { deleteAccountAction, updateProfileAction } from "@/app/actions/user";
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

vi.mock("drizzle-orm", async (importOriginal) => {
	const actual = await importOriginal<typeof import("drizzle-orm")>();
	return {
		...actual,
		and: vi.fn((...args) => ({ type: "and", args })),
		eq: vi.fn((...args) => ({ type: "eq", args })),
		ne: vi.fn((...args) => ({ type: "ne", args })),
	};
});

describe("user actions", () => {
	const mockUser = { id: "user-1", email: "test@example.com" };
	const mockSession = { user: mockUser };

	const mockDb = {
		delete: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		query: {
			users: {
				findFirst: vi.fn(),
			},
		},
	};

	const mockAuth = {
		api: {
			getSession: vi.fn(),
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockDb.delete.mockReturnThis();
		mockDb.update.mockReturnThis();
		mockDb.set.mockReturnThis();
		mockDb.where.mockResolvedValue(undefined);
		vi.mocked(initAuth).mockResolvedValue(
			mockAuth as unknown as Awaited<ReturnType<typeof initAuth>>,
		);
		vi.mocked(getDb).mockResolvedValue(mockDb as unknown as DB);
		vi.mocked(headers).mockResolvedValue(new Headers());
	});

	describe("deleteAccountAction", () => {
		it("ユーザー削除に成功する", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			const response = await deleteAccountAction();

			expect(mockDb.delete).toHaveBeenCalled();
			expect(response).toEqual({ success: true, data: undefined });
		});

		it("未認証の場合はエラーを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(null);
			const response = await deleteAccountAction();
			expect(response).toEqual({
				success: false,
				error: "認証されていません。",
			});
		});
	});

	describe("updateProfileAction", () => {
		it("プロフィール更新に成功する", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			mockDb.query.users.findFirst.mockResolvedValueOnce(null);

			const response = await updateProfileAction({
				name: "  New Name  ",
				email: "new@example.com",
			});

			expect(mockDb.update).toHaveBeenCalled();
			expect(mockDb.set).toHaveBeenCalledWith({
				name: "New Name",
				email: "new@example.com",
			});
			expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/my-page");
			expect(response).toEqual({ success: true, data: undefined });
		});

		it("メールアドレス重複時はエラーを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			mockDb.query.users.findFirst.mockResolvedValueOnce({ id: "user-2" });

			const response = await updateProfileAction({
				email: "taken@example.com",
			});

			expect(response).toEqual({
				success: false,
				error: "使用できないメールアドレスです。",
			});
		});

		it("無効なメールアドレスはエラーを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			const response = await updateProfileAction({ email: "invalid-email" });
			expect(response).toEqual({
				success: false,
				error: "無効なメールアドレスです。",
			});
		});

		it("更新内容が空の場合はエラーを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			const response = await updateProfileAction({});
			expect(response).toEqual({
				success: false,
				error: "変更内容がありません。",
			});
		});

		it("未認証の場合はエラーを返す", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(null);
			const response = await updateProfileAction({ name: "New Name" });
			expect(response).toEqual({
				success: false,
				error: "認証されていません。",
			});
		});
	});
});
