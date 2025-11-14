/**
 * APIエンドポイント経由でシードデータを投入するスクリプト
 *
 * 使用方法:
 *   npm run seed:local  - ローカル開発サーバー経由で投入
 *   npm run seed:remote - リモート環境経由で投入（デプロイ後）
 */

const environment = process.argv[2] || "local";
const isLocal = environment === "local";

// async関数でラップしてtop-level awaitを回避
async function runSeed() {
	console.log(`🌱 Starting seed process via API endpoint...`);
	console.log("");

	try {
		const baseUrl = isLocal
			? "http://localhost:3000"
			: process.env.NEXT_PUBLIC_APP_URL || "https://your-app.workers.dev";

		console.log(`📡 API Endpoint: ${baseUrl}/api/admin/seed`);
		console.log(`🌍 Environment: ${isLocal ? "Local" : "Remote"}`);
		console.log("");

		// APIエンドポイントを呼び出す
		const response = await fetch(`${baseUrl}/api/admin/seed`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const result = (await response.json()) as {
			message?: string;
			error?: string;
			details?: string;
		};

		if (response.ok) {
			console.log("✅", result.message || "シードデータの投入が完了しました。");
			process.exit(0);
		} else {
			console.error("❌", result.error || "シードデータの投入に失敗しました。");
			if (result.details) {
				console.error("Details:", result.details);
			}
			process.exit(1);
		}
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

		process.exit(1);
	}
}

// 実行
runSeed();
