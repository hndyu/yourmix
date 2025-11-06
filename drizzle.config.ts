import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";

const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN } =
	process.env;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_DATABASE_ID || !CLOUDFLARE_D1_TOKEN) {
	throw new Error(
		"CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_D1_TOKEN must be set in .env",
	);
}

export default defineConfig({
	schema: "./schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: CLOUDFLARE_ACCOUNT_ID,
		databaseId: CLOUDFLARE_DATABASE_ID,
		token: CLOUDFLARE_D1_TOKEN,
	},
});