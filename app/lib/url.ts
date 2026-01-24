/**
 * Validates a callback URL to prevent open redirect vulnerabilities.
 * A valid callback URL must be a relative path starting with a single "/".
 * It must not start with "//" to avoid protocol-relative URL redirects.
 *
 * @param url The URL to validate
 * @returns true if the URL is a safe relative path, false otherwise
 */
export function isValidCallbackUrl(url: string | null): boolean {
	if (!url) return false;

	// Only allow relative URLs starting with /
	// Avoid // which can be used for protocol-relative redirects (e.g., //google.com)
	return url.startsWith("/") && !url.startsWith("//");
}
