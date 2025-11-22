import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { D1Database } from "@cloudflare/workers-types";

/**
 * Drizzleインスタンスを生成する
 * @param d1 - Cloudflare D1データベースインスタンス
 * @returns Drizzleインスタンス
 */
export const createDb = (d1: D1Database) => {
	return drizzle(d1, { schema });
};
