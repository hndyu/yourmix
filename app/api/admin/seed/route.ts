import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { runSeed } from "../../../../scripts/seed";

/**
 * データベースにシードデータを投入する管理用APIエンドポイント
 * 
 * 注意: 本番環境では認証を追加してください
 * 
 * 使用方法:
 *   POST /api/admin/seed
 */
export async function POST() {
	try {
		// Cloudflare環境からコンテキストを取得
		const context = getCloudflareContext();
		
		if (!context || !context.env) {
			console.error("Cloudflare context or env is not available");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}

		// D1データベースに接続
		const env = context.env as { DB?: D1Database };
		if (!env.DB) {
			console.error("DB binding is not available");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}

		// シードデータを投入
		await runSeed({ DB: env.DB });

		return NextResponse.json(
			{ message: "シードデータの投入が完了しました。" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error seeding database:", error);
		return NextResponse.json(
			{ 
				error: "シードデータの投入中にエラーが発生しました。",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

