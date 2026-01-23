/**
 * Validates that the callbackUrl is a safe relative path within the same domain.
 * Ensures it starts with a single '/' and not '//' to prevent Open Redirect.
 */
export function isValidCallbackUrl(url: string | null): url is string {
	if (!url) return false;
	// Check if it starts with '/' but not '//' (Open Redirect protection)
	return url.startsWith("/") && !url.startsWith("//");
}
