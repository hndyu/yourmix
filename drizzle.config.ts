import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
const CLOUDFLARE_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID ?? "";
const CLOUDFLARE_D1_TOKEN = process.env.CLOUDFLARE_D1_TOKEN ?? "";

export default defineConfig({
	schema: ["./app/db/schema.ts", "./app/db/auth.schema.ts"],
	out: "./drizzle",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: CLOUDFLARE_ACCOUNT_ID,
		databaseId: CLOUDFLARE_DATABASE_ID,
		token: CLOUDFLARE_D1_TOKEN,
	},
});
