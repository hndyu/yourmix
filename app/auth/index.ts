import { getDb } from "@/app/db/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { captcha, lastLoginMethod, openAPI } from "better-auth/plugins";
import type { DrizzleD1Database } from "drizzle-orm/d1";

// Define an asynchronous function to build your auth configuration
async function authBuilder() {
	const googleClientId = process.env.GOOGLE_CLIENT_ID;
	const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

	if (!googleClientId || !googleClientSecret) {
		throw new Error(
			"Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
		);
	}

	if (!turnstileSecretKey) {
		throw new Error(
			"Missing Cloudflare Turnstile Secret Key. Please set TURNSTILE_SECRET_KEY environment variables.",
		);
	}

	const dbInstance = await getDb(); // Get your D1 database instance
	return betterAuth(
		withCloudflare(
			{
				autoDetectIpAddress: true,
				geolocationTracking: true,
				cf: getCloudflareContext().cf, // OpenNext.js context access
				d1: {
					db: dbInstance, // Async database instance
					options: {
						usePlural: true,
						debugLogs: true,
					},
				},
			},
			{
				emailAndPassword: {
					enabled: true,
				},
				socialProviders: {
					google: {
						clientId: googleClientId,
						clientSecret: googleClientSecret,
					},
				},
				trustedOrigins: [
					"http://127.0.0.1:3000",
					"http://localhost:3000",
					"http://127.0.0.1:8787",
					"http://localhost:8787",
					// Configure social providers as needed
				],
				rateLimit: {
					enabled: true,
				},
				plugins: [
					openAPI(),
					lastLoginMethod(),
					captcha({
						provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
						secretKey: turnstileSecretKey,
					}),
				],
			},
		),
	);
}

// Singleton pattern to ensure a single auth instance
let authInstance: Awaited<ReturnType<typeof authBuilder>> | null = null;

// Asynchronously initializes and retrieves the shared auth instance
export async function initAuth() {
	if (!authInstance) {
		authInstance = await authBuilder();
	}
	return authInstance;
}

// This simplified configuration is used by the Better Auth CLI for schema generation.
// It's necessary because the main `authBuilder` performs async operations like `getDb()`
// which use `getCloudflareContext` (not available in CLI context).
export const auth = betterAuth({
	...withCloudflare(
		{
			autoDetectIpAddress: true,
			geolocationTracking: true,
			cf: {},
			// No actual database or KV instance needed, only schema-affecting options
		},
		{
			// Include only configurations that influence the Drizzle schema
			emailAndPassword: {
				enabled: true,
			},
			plugins: [openAPI(), lastLoginMethod()],
		},
	),

	// Used by the Better Auth CLI for schema generation
	database: drizzleAdapter(
		process.env.DATABASE as unknown as DrizzleD1Database,
		{
			provider: "sqlite",
			usePlural: true,
			debugLogs: true,
		},
	),
});
