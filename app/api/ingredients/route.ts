import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { ingredients } from "../../../schema";

/**
 * カクテルの材料一覧を取得するAPIエンドポイント
 * GET /api/ingredients
 */
export async function GET() {
	try {
		// Cloudflare環境からコンテキストを取得
		const context = getCloudflareContext();
		
		// コンテキストまたはenvが存在しない場合のエラーハンドリング
		if (!context || !context.env) {
			console.error("Cloudflare context or env is not available");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}

		// D1データベースに接続（型アサーションを使用してDBバインディングにアクセス）
		// Cloudflare Workers環境では、env.DBがD1Databaseとして利用可能
		const env = context.env as { DB?: D1Database };
		if (!env.DB) {
			console.error("DB binding is not available");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}
		const db = drizzle(env.DB);

		// 材料テーブルから全データを取得
		const allIngredients = await db.select().from(ingredients);

		// 取得したデータをJSON形式で返す
		return NextResponse.json(allIngredients, { status: 200 });
	} catch (error) {
		// エラーが発生した場合のログ出力とエラーレスポンス
		console.error("Error fetching ingredients:", error);
		return NextResponse.json(
			{ error: "材料の取得中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}

