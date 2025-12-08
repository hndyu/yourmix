import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { runSeed } from "../../../../scripts/seed";
import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../../app/db/schema";

/**
 * データベースにシードデータを投入する管理用APIエンドポイント
 *
 * 注意: 本番環境では認証を追加してください
 *
 * 使用方法:
 *   POST /api/admin/seed
 */
export async function POST(request: Request) {
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
		const env = context.env as { DB?: D1Database; SEED_SECRET?: string };
		if (!env.DB) {
			console.error("DB binding is not available");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}

		// Initialize Drizzle
		const db = drizzle(env.DB, { schema });

		// --- 認証処理の追加 ---
		const seedSecret = env.SEED_SECRET || process.env.SEED_SECRET;
		if (!seedSecret) {
			console.error("SEED_SECRET is not configured in environment variables.");
			return NextResponse.json(
				{ error: "サーバー設定エラーです。" },
				{ status: 500 },
			);
		}

		const authHeader = request.headers.get("Authorization");
		const token = authHeader?.split(" ")[1];

		if (token !== seedSecret) {
			return NextResponse.json(
				{ error: "認証に失敗しました。" },
				{ status: 401 },
			);
		}
		// --- 認証処理ここまで ---

		// シードデータを投入
		await runSeed(db);

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
