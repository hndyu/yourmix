import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";


/**
 * Drizzleインスタンスを生成する
 * @returns Drizzleインスタンス
 */
export default function getDb() {
	// Cloudflare環境からコンテキストを取得
	const context = getCloudflareContext();
	const env = context.env as Env;
	return drizzle(env.DB, { schema });
}


