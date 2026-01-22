/**
 * Validates if a URL is safe to use as a callback/redirect URL.
 * Only allows relative paths that start with '/' but not '//' or '/\'.
 * This prevents open redirect vulnerabilities.
 */
export function isValidCallbackUrl(url: string | null | undefined): boolean {
	if (!url) return false;

	// Must start with /
	if (!url.startsWith("/")) return false;

	// Must not start with // (protocol-relative URL)
	if (url.startsWith("//")) return false;

	// Must not start with /\ (can be interpreted as // in some browsers)
	if (url.startsWith("/\\")) return false;

	return true;
}
