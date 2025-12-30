// Example: src/lib/authClient.ts or similar client-side setup file

import { passkeyClient } from "@better-auth/passkey/client";
import { cloudflareClient } from "better-auth-cloudflare/client";
import {
	lastLoginMethodClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	plugins: [
		cloudflareClient(),
		lastLoginMethodClient(),
		twoFactorClient(),
		passkeyClient(),
	], // includes geolocation and R2 file features (if configured)
});

export default authClient;
