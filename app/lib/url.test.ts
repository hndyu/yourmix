import { describe, expect, it } from "vitest";
import { isValidCallbackUrl } from "./url";

describe("isValidCallbackUrl", () => {
	it("should return true for valid relative paths", () => {
		expect(isValidCallbackUrl("/")).toBe(true);
		expect(isValidCallbackUrl("/my-page")).toBe(true);
		expect(isValidCallbackUrl("/recipes/test")).toBe(true);
		expect(isValidCallbackUrl("/auth/sign-in?foo=bar")).toBe(true);
	});

	it("should return false for null or empty strings", () => {
		expect(isValidCallbackUrl(null)).toBe(false);
		expect(isValidCallbackUrl("")).toBe(false);
	});

	it("should return false for absolute URLs", () => {
		expect(isValidCallbackUrl("https://google.com")).toBe(false);
		expect(isValidCallbackUrl("http://localhost:3000")).toBe(false);
		expect(isValidCallbackUrl("javascript:alert(1)")).toBe(false);
	});

	it("should return false for protocol-relative URLs", () => {
		expect(isValidCallbackUrl("//google.com")).toBe(false);
	});

	it("should return false for paths not starting with /", () => {
		expect(isValidCallbackUrl("my-page")).toBe(false);
		expect(isValidCallbackUrl("?callbackUrl=/")).toBe(false);
	});
});
