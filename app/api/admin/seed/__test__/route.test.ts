import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { POST } from "../route"; // Assuming POST is the function to test
import { NextResponse } from "next/server";

// Mock the external dependencies
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: vi.fn(),
}));

vi.mock("../../../../scripts/seed", () => ({
	runSeed: vi.fn(),
}));

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

// Import the mocked functions
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { runSeed } from "../../../../../scripts/seed";

describe("POST /api/admin/seed", () => {
	const mockD1Database = {}; // A simple mock for D1Database

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();
		// Suppress console.error output during tests
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("should successfully seed the database", async () => {
		// Setup mocks for a successful scenario
		(getCloudflareContext as Mock).mockReturnValue({
			env: { DB: mockD1Database },
		});
		(runSeed as Mock).mockResolvedValue(true);

		// Call the POST function
		const response = (await POST()) as unknown as MockResponse;

		// Assertions
		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(runSeed).toHaveBeenCalledTimes(1);
		expect(runSeed).toHaveBeenCalledWith({ DB: mockD1Database });
		expect(NextResponse.json).toHaveBeenCalledTimes(1);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ message: "シードデータの投入が完了しました。" },
			{ status: 200 },
		);
		expect(response.options.status).toBe(200);
	});

	it("should return an error if Cloudflare context is not available", async () => {
		(getCloudflareContext as Mock).mockReturnValue(null);

		const response = (await POST()) as unknown as MockResponse;

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

		const response = (await POST()) as unknown as MockResponse;

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
			env: { DB: mockD1Database },
		});
		(runSeed as Mock).mockRejectedValue(new Error(errorMessage));

		const response = (await POST()) as unknown as MockResponse;

		expect(getCloudflareContext).toHaveBeenCalledTimes(1);
		expect(runSeed).toHaveBeenCalledTimes(1);
		expect(runSeed).toHaveBeenCalledWith({ DB: mockD1Database });
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
});
