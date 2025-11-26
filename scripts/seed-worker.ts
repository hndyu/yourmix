import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // .env.localファイルを読み込むように修正

/**
 * APIエンドポイント経由でシードデータを投入するスクリプト
 *
 * 使用方法:
 *   npm run seed:local  - ローカル開発サーバー経由で投入
 *   npm run seed:remote - リモート環境経由で投入（デプロイ後）
 */

// async関数でラップしてtop-level awaitを回避
export async function runSeed({
	exitOnFinish = true,
}: { exitOnFinish?: boolean } = {}) {
	// Determine environment at invocation time to avoid module cache issues
	const environment = process.argv[2] || "local";
	const isLocal = environment === "local";

	console.log("🌱 Starting seed process via API endpoint...");
	console.log("");

	try {
		const baseUrl = isLocal
			? "http://localhost:3000"
			: process.env.NEXT_PUBLIC_APP_URL || "https://yourmix.hndyu.workers.dev";

		console.log(`📡 API Endpoint: ${baseUrl}/api/admin/seed`);
		console.log(`🌍 Environment: ${isLocal ? "Local" : "Remote"}`);
		console.log("");

		const seedSecret = process.env.SEED_SECRET;
		if (!seedSecret) {
			console.error("❌ SEED_SECRET is not defined in your environment.");
			console.error(
				"   Please add it to your .env.local file or environment variables.",
			);
			if (exitOnFinish) process.exit(1);
			return 1;
		}

		// APIエンドポイントを呼び出す
		const response = await fetch(`${baseUrl}/api/admin/seed`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// 認証ヘッダーを追加
				Authorization: `Bearer ${seedSecret}`,
			},
		});

		const result = (await response.json()) as {
			message?: string;
			error?: string;
			details?: string;
		};

		if (response.ok) {
			console.log("✅", result.message || "シードデータの投入が完了しました。");
			if (exitOnFinish) process.exit(0);
			return 0;
		}
		console.error("❌", result.error || "シードデータの投入に失敗しました。");
		if (result.details) {
			console.error("Details:", result.details);
		}
		// Respect `exitOnFinish`: only exit the process when requested.
		if (exitOnFinish) process.exit(1);
		return 1;
	} catch (error) {
		console.error("❌ Error:", error);
		if (error instanceof Error) {
			console.error("Error details:", error.message);
		}

		if (isLocal) {
			console.log("");
			console.log("💡 Make sure the development server is running:");
			console.log("   npm run dev");
			console.log("");
			console.log("   Then run this script again:");
			console.log("   npm run seed:local");
		}

		// Respect `exitOnFinish`: only exit the process when requested.
		if (exitOnFinish) process.exit(1);
		return 1;
	}
}

// Note: do not auto-run here so tests can import and call `runSeed()` safely.
// To run from CLI, call `node ./scripts/seed-worker.ts` with a runner that
// invokes the exported `runSeed()` function, or add a small wrapper script.

// このファイルが直接実行された場合のみrunSeedを実行する
if (
	typeof require !== "undefined" &&
	require.main === module &&
	typeof process !== "undefined"
) {
	runSeed();
}
