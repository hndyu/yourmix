import { getDb } from "@/app/db/db";
import { passkey } from "@better-auth/passkey";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	captcha,
	lastLoginMethod,
	openAPI,
	twoFactor,
} from "better-auth/plugins";
import type { DrizzleD1Database } from "drizzle-orm/d1";

// Define an asynchronous function to build your auth configuration
async function authBuilder() {
	const googleClientId = process.env.GOOGLE_CLIENT_ID;
	const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

	if (!googleClientId || !googleClientSecret) {
		console.warn(
			"Google OAuth credentials not found. Google login will be disabled.",
		);
	}

	if (!turnstileSecretKey) {
		console.warn(
			"Cloudflare Turnstile Secret Key not found. Captcha will be disabled.",
		);
	}

	const dbInstance = await getDb(); // Get your D1 database instance
	const debugLogsEnabled = process.env.AUTH_DEBUG_LOGS === "true";
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
						debugLogs: debugLogsEnabled,
					},
				},
			},
			{
				emailAndPassword: {
					enabled: true,
				},
				socialProviders: {
					...(googleClientId && googleClientSecret
						? {
								google: {
									clientId: googleClientId,
									clientSecret: googleClientSecret,
								},
							}
						: {}),
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
				appName: "YourMix", // provide your app name. It'll be used as an issuer.
				plugins: [
					openAPI(),
					lastLoginMethod(),
					...(turnstileSecretKey
						? [
								captcha({
									provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
									secretKey: turnstileSecretKey,
								}),
							]
						: []),
					twoFactor({ issuer: "YourMix" }),
					passkey(),
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
			appName: "YourMix", // provide your app name. It'll be used as an issuer.
			plugins: [
				openAPI(),
				lastLoginMethod(),
				twoFactor({ issuer: "YourMix" }),
				passkey(),
			],
		},
	),

	// Used by the Better Auth CLI for schema generation
	database: drizzleAdapter(
		process.env.DATABASE as unknown as DrizzleD1Database,
		{
			provider: "sqlite",
			usePlural: true,
			debugLogs: process.env.AUTH_DEBUG_LOGS === "true",
		},
	),
});
