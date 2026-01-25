/**
 * Safely stringifies an object to JSON for use in <script> tags.
 * Escapes < characters to \u003c to prevent XSS (terminating the script tag).
 */
export function safeJsonStringify(data: unknown): string {
	const json = JSON.stringify(data);
	if (json === undefined) return "";
	return json.replace(/</g, "\\u003c");
}
