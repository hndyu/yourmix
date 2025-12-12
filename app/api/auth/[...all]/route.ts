// Example: src/app/api/auth/[...all]/route.ts
// Adjust the path based on your project structure (e.g., Next.js App Router)

import { initAuth } from "@/app/auth"; // Adjust path to your auth/index.ts

export async function POST(req: Request) {
	const auth = await initAuth();
	return auth.handler(req);
}

export async function GET(req: Request) {
	const auth = await initAuth();
	return auth.handler(req);
}

// You can also add handlers for PUT, DELETE, PATCH if needed by your auth flows
