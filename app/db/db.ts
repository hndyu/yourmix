import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "./schema";

export async function getDb() {
	try {
		// Retrieves Cloudflare-specific context, including environment variables and bindings
		const { env } = await getCloudflareContext({ async: true });

		// Initialize Drizzle with your D1 binding (e.g., "DB" or "DATABASE" from wrangler.toml)
		return drizzle(env.DB, {
			// Ensure "DATABASE" matches your D1 binding name in wrangler.toml
			schema,
		});
	} catch (error) {
		console.error("❌ データベース接続エラー:", error);
		throw error;
	}
}

// getDbの戻り値の型をエクスポート (Promiseが解決した後の型)
export type DB = Awaited<ReturnType<typeof getDb>>;
