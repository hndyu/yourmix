import { DELETE, PATCH } from "@/app/api/user/route";
import { initAuth } from "@/app/auth";
import { type DB, getDb } from "@/app/db/db";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/app/auth", () => ({
	initAuth: vi.fn(),
}));

vi.mock("@/app/db/db", () => ({
	getDb: vi.fn(),
}));

// Mock NextResponse.json
type MockResponse = {
	data: {
		success?: boolean;
		error?: string;
	};
	options: { status: number };
};
vi.mock("next/server", () => ({
	NextRequest: Request,
	NextResponse: {
		json: vi.fn((data, options) => ({ data, options })),
	},
}));

describe("/api/user", () => {
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
		vi.mocked(initAuth).mockResolvedValue(
			mockAuth as unknown as Awaited<ReturnType<typeof initAuth>>,
		);
		vi.mocked(getDb).mockResolvedValue(mockDb as unknown as DB);
	});

	describe("DELETE", () => {
		it("should delete the user successfully", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			mockDb.delete.mockReturnThis();

			const req = new NextRequest("http://localhost/api/user", {
				method: "DELETE",
			});
			const response = (await DELETE(req)) as unknown as MockResponse;

			expect(mockDb.delete).toHaveBeenCalled();
			expect(response.data).toEqual({ success: true });
		});

		it("should return 401 if not authenticated", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(null);

			const req = new NextRequest("http://localhost/api/user", {
				method: "DELETE",
			});
			const response = (await DELETE(req)) as unknown as MockResponse;

			expect(response.options.status).toBe(401);
			expect(response.data.error).toBe("認証されていません。");
		});
	});

	describe("PATCH", () => {
		it("should update user profile successfully", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			mockDb.query.users.findFirst.mockResolvedValueOnce(null); // No existing user with same email

			const req = new NextRequest("http://localhost/api/user", {
				method: "PATCH",
				body: JSON.stringify({ name: "New Name", email: "new@example.com" }),
			});
			const response = (await PATCH(req)) as unknown as MockResponse;

			expect(mockDb.update).toHaveBeenCalled();
			expect(mockDb.set).toHaveBeenCalledWith({
				name: "New Name",
				email: "new@example.com",
			});
			expect(response.data).toEqual({ success: true });
		});

		it("should return 409 if email is already taken", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);
			mockDb.query.users.findFirst.mockResolvedValueOnce({ id: "user-2" }); // Email taken by someone else

			const req = new NextRequest("http://localhost/api/user", {
				method: "PATCH",
				body: JSON.stringify({ email: "taken@example.com" }),
			});
			const response = (await PATCH(req)) as unknown as MockResponse;

			expect(response.options.status).toBe(409);
			expect(response.data.error).toBe("使用できないメールアドレスです。");
		});

		it("should return 400 for invalid email", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);

			const req = new NextRequest("http://localhost/api/user", {
				method: "PATCH",
				body: JSON.stringify({ email: "invalid-email" }),
			});
			const response = (await PATCH(req)) as unknown as MockResponse;

			expect(response.options.status).toBe(400);
			expect(response.data.error).toBe("無効なメールアドレスです。");
		});

		it("should return 400 if no data provided", async () => {
			mockAuth.api.getSession.mockResolvedValueOnce(mockSession);

			const req = new NextRequest("http://localhost/api/user", {
				method: "PATCH",
				body: JSON.stringify({}),
			});
			const response = (await PATCH(req)) as unknown as MockResponse;

			expect(response.options.status).toBe(400);
			expect(response.data.error).toBe("変更内容がありません。");
		});
	});
});
