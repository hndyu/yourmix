import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";
import type { D1Database } from "@cloudflare/workers-types";

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

/**
 * Drizzleインスタンスを生成する
 * @param d1 - Cloudflare D1データベースインスタンス
 * @returns Drizzleインスタンス
 */
export const createDb = (d1: D1Database) => {
	return drizzle(d1, { schema });
};
