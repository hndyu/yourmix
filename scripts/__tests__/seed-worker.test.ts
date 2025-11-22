import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

describe("scripts/seed-worker.ts", () => {
	const originalArgv = process.argv;
	const originalEnv = process.env;

	// consoleとprocess.exitをモック化
	const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	const consoleErrorSpy = vi
		.spyOn(console, "error")
		.mockImplementation(() => {});
	const processExitSpy = vi
		.spyOn(process, "exit")
		.mockImplementation(() => undefined as never);

	// fetchをモック化
	const mockFetch = vi.fn();
	vi.stubGlobal("fetch", mockFetch);

	beforeEach(() => {
		// 各テストの前にモックの状態をリセット
		vi.resetAllMocks();
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		// テスト後に元の実装に戻す
		process.argv = originalArgv;
		process.env = originalEnv;
	});

	const runScript = async () => {
		const mod = await import("../../scripts/seed-worker");
		const seedMod = mod as unknown as {
			runSeed?: (opts?: { exitOnFinish?: boolean }) => Promise<number>;
		};
		if (typeof seedMod.runSeed === "function") {
			return await seedMod.runSeed({ exitOnFinish: false });
		}
		throw new Error("runSeed is not exported from seed-worker");
	};

	it("ローカル環境でシードが成功した場合、成功ログを出力しexit(0)で終了すること", async () => {
		process.argv = ["node", "seed-worker.ts", "local"];
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ message: "Success" }),
		});

		const code = await runScript();

		expect(mockFetch).toHaveBeenCalledWith(
			"http://localhost:3000/api/admin/seed",
			expect.any(Object),
		);
		expect(consoleLogSpy).toHaveBeenCalledWith("✅", "Success");
		expect(code).toBe(0);
	});

	it("リモート環境でシードが成功した場合、成功ログを出力しexit(0)で終了すること", async () => {
		process.argv = ["node", "seed-worker.ts", "remote"];
		process.env.NEXT_PUBLIC_APP_URL = "https://example.com";
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ message: "Remote Success" }),
		});

		const code = await runScript();

		expect(mockFetch).toHaveBeenCalledWith(
			"https://example.com/api/admin/seed",
			expect.any(Object),
		);
		expect(consoleLogSpy).toHaveBeenCalledWith("✅", "Remote Success");
		expect(code).toBe(0);
	});

	it("APIがエラーを返した場合、エラーログを出力しexit(1)で終了すること", async () => {
		process.argv = ["node", "seed-worker.ts", "local"];
		mockFetch.mockResolvedValue({
			ok: false,
			json: async () => ({
				error: "API Error",
				details: "Something went wrong",
			}),
		});

		const code = await runScript();

		expect(consoleErrorSpy).toHaveBeenCalledWith("❌", "API Error");
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Details:",
			"Something went wrong",
		);
		expect(code).toBe(1);
	});

	it("fetchが例外をスローした場合、エラーログを出力しexit(1)で終了すること", async () => {
		process.argv = ["node", "seed-worker.ts", "local"];
		const error = new Error("Network Error");
		mockFetch.mockRejectedValue(error);

		const code = await runScript();

		expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Error:", error);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error details:",
			"Network Error",
		);
		expect(code).toBe(1);
	});

	it("ローカル環境でfetchが失敗した場合、開発サーバー起動のヒントを表示すること", async () => {
		process.argv = ["node", "seed-worker.ts", "local"];
		const error = new Error("ECONNREFUSED");
		mockFetch.mockRejectedValue(error);

		const code = await runScript();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			"💡 Make sure the development server is running:",
		);
		expect(code).toBe(1);
	});

	it("リモート環境でfetchが失敗した場合、ヒントを表示しないこと", async () => {
		process.argv = ["node", "seed-worker.ts", "remote"];
		const error = new Error("ECONNREFUSED");
		mockFetch.mockRejectedValue(error);

		const code = await runScript();

		expect(consoleLogSpy).not.toHaveBeenCalledWith(
			"💡 Make sure the development server is running:",
		);
		expect(code).toBe(1);
	});
});
