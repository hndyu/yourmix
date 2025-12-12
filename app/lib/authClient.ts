// Example: src/lib/authClient.ts or similar client-side setup file

import { cloudflareClient } from "better-auth-cloudflare/client";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	plugins: [cloudflareClient()], // includes geolocation and R2 file features (if configured)
});

export default authClient;
