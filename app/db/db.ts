import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

/**
 * Drizzleインスタンスを生成する
 * @returns Drizzleインスタンス
 * @throws エラー Cloudflareコンテキストまたはデータベース接続が利用できない場合
 */
export default function getDb() {
	try {
		// Cloudflare環境からコンテキストを取得
		const context = getCloudflareContext();

		if (!context || !context.env) {
			throw new Error(
				"Cloudflare コンテキストが利用できません。\n" +
					"開発環境では `npm run dev:test` を使用してください。\n" +
					"本番環境では Cloudflare Workers 上で実行されていることを確認してください。",
			);
		}

		const env = context.env as Env;

		if (!env.DB) {
			throw new Error(
				"D1 データベース接続が利用できません。\n" +
					"wrangler.jsonc で D1 データベースが正しく設定されているか確認してください。",
			);
		}

		return drizzle(env.DB, { schema });
	} catch (error) {
		console.error("❌ データベース接続エラー:", error);
		throw error;
	}
}
