import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { POST } from "@/app/api/admin/seed/route";
import { NextResponse } from "next/server";
import * as cloudflare from "@opennextjs/cloudflare";
import * as seedScript from "@/scripts/seed";
// Mock drizzle
import { drizzle } from "drizzle-orm/d1";

const { getCloudflareContext } = cloudflare;
const { runSeed } = seedScript;

// Mock the external dependencies
vi.mock("@opennextjs/cloudflare");
vi.mock("@/scripts/seed");
vi.mock("drizzle-orm/d1");

// Define a type for our mock response
type MockResponse = {
	data: { message: string } | { error: string; details?: string };
	options: { status: number };
};
// Mock NextResponse.json to capture its arguments
vi.mock("next/server", () => ({
	NextResponse: {
		json: vi.fn((data, options) => ({ data, options }) as MockResponse),
	},
}));

describe("POST /api/admin/seed", () => {
	const mockD1Database = {};
	const mockSecret = "test-seed-secret";
	const mockDb = {}; // Mock drizzle instance

	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, "error").mockImplementation(() => {});
		// Setup mock for drizzle
		(drizzle as Mock).mockReturnValue(mockDb);
	});

	const createMockRequest = (token?: string): Request => {
		return {
			headers: new Map([["Authorization", token ? `Bearer ${token}` : ""]]),
		} as unknown as Request;
	};

	it("should successfully seed the database", async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: { DB: mockD1Database, SEED_SECRET: mockSecret },
		});
		(runSeed as Mock).mockResolvedValue(true);

		const request = createMockRequest(mockSecret);
		const response = (await POST(request)) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(drizzle).toHaveBeenCalledWith(mockD1Database, expect.anything()); // Verify drizzle was initialized
		expect(runSeed).toHaveBeenCalledTimes(1);
		expect(runSeed).toHaveBeenCalledWith(mockDb); // Verify mocked db was passed, not D1
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ message: "シードデータの投入が完了しました。" },
			{ status: 200 },
		);
		expect(response.options.status).toBe(200);
	});

	it("should return an error if Cloudflare context is not available", async () => {
		(getCloudflareContext as Mock).mockReturnValue(null);

		const request = createMockRequest(mockSecret);
		const response = (await POST(request)) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(runSeed).not.toHaveBeenCalled(); // runSeed should not be called
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ error: "データベース接続に失敗しました。" },
			{ status: 500 },
		);
		expect(response.options.status).toBe(500);
	});

	it("should return an error if env.DB binding is not available", async () => {
		(getCloudflareContext as Mock).mockReturnValue({ env: {} }); // env exists, but DB is missing

		const request = createMockRequest(mockSecret);
		const response = (await POST(request)) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(runSeed).not.toHaveBeenCalled();
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ error: "データベース接続に失敗しました。" },
			{ status: 500 },
		);
		expect(response.options.status).toBe(500);
	});

	it("should return an error if runSeed fails", async () => {
		const errorMessage = "Failed to insert data";
		(getCloudflareContext as Mock).mockReturnValue({
			env: { DB: mockD1Database, SEED_SECRET: mockSecret },
		});
		(runSeed as Mock).mockRejectedValue(new Error(errorMessage));

		const request = createMockRequest(mockSecret);
		const response = (await POST(request)) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(drizzle).toHaveBeenCalledWith(mockD1Database, expect.anything());
		expect(runSeed).toHaveBeenCalledTimes(1);
		expect(runSeed).toHaveBeenCalledWith(mockDb);
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{
				error: "シードデータの投入中にエラーが発生しました。",
				details: errorMessage,
			},
			{ status: 500 },
		);
		expect(response.options.status).toBe(500);
	});

	it("should return an error if authentication fails (no Authorization header)", async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: { DB: mockD1Database, SEED_SECRET: mockSecret },
		});

		const request = createMockRequest(); // No token
		const response = (await POST(request)) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(runSeed).not.toHaveBeenCalled();
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ error: "認証に失敗しました。" },
			{ status: 401 },
		);
		expect(response.options.status).toBe(401);
	});

	it("should return an error if authentication fails (invalid token)", async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: { DB: mockD1Database, SEED_SECRET: mockSecret },
		});

		const request = createMockRequest("invalid-token");
		const response = (await POST(request)) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(runSeed).not.toHaveBeenCalled();
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ error: "認証に失敗しました。" },
			{ status: 401 },
		);
		expect(response.options.status).toBe(401);
	});

	it("should return an error if SEED_SECRET is not configured", async () => {
		(getCloudflareContext as Mock).mockReturnValue({
			env: { DB: mockD1Database }, // SEED_SECRET is missing
		});

		const request = createMockRequest(mockSecret);
		const response = (await POST(request)) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(runSeed).not.toHaveBeenCalled();
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ error: "サーバー設定エラーです。" },
			{ status: 500 },
		);
		expect(response.options.status).toBe(500);
	});
});
