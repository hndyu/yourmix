import { safeJsonStringify } from "@/app/lib/security";
import { describe, expect, it } from "vitest";

describe("safeJsonStringify", () => {
	it("should stringify a simple object", () => {
		const data = { name: "test" };
		expect(safeJsonStringify(data)).toBe('{"name":"test"}');
	});

	it("should escape < characters to \\u003c", () => {
		const data = { name: "</script><script>alert(1)</script>" };
		const result = safeJsonStringify(data);
		expect(result).not.toContain("<");
		expect(result).toContain("\\u003c");
		expect(result).toBe(
			'{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}',
		);
	});

	it("should handle nested objects", () => {
		const data = { info: { bio: "I <3 cocktails" } };
		expect(safeJsonStringify(data)).toBe(
			'{"info":{"bio":"I \\u003c3 cocktails"}}',
		);
	});

	it("should return an empty string if JSON.stringify returns undefined", () => {
		expect(safeJsonStringify(() => {})).toBe("");
		expect(safeJsonStringify(undefined)).toBe("");
	});
});
