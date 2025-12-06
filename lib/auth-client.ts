import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	// baseURL is optional if same origin, but good to be explicit if needed.
	// relying on default relative path for now.
});

export const { signIn, signUp, useSession, signOut } = authClient;
