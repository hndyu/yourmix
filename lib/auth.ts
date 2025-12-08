import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import getDb from "@/app/db/db";
import { user, session, account, verification } from "@/app/db/schema";

export function getAuth() {
	return betterAuth({
		database: drizzleAdapter(getDb(), {
			provider: "sqlite",
			schema: {
				user,
				session,
				account,
				verification,
			},
		}),
		emailAndPassword: {
			enabled: true,
		},
		trustedOrigins: [
			"http://127.0.0.1:3000",
			"http://localhost:3000",
			"http://127.0.0.1:8787",
			"http://localhost:8787",
		],
	});
}
