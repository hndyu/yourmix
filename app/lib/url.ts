/**
 * Validates if a URL is safe for redirection.
 * Only allows relative paths starting with / and prevents protocol-relative URLs (starting with //).
 */
export function isValidCallbackUrl(
	url: string | null | undefined,
): url is string {
	if (!url) return false;

	// Only allow relative paths starting with /
	// Disallow protocol-relative URLs (starting with //)
	// Disallow backslashes which can be used to bypass some checks
	return url.startsWith("/") && !url.startsWith("//") && !url.includes("\\");
}
