import { describe, expect, it } from "vitest";
import { isValidCallbackUrl } from "./url";

describe("isValidCallbackUrl", () => {
	it("should return true for relative paths", () => {
		expect(isValidCallbackUrl("/")).toBe(true);
		expect(isValidCallbackUrl("/home")).toBe(true);
		expect(isValidCallbackUrl("/my-page?id=123")).toBe(true);
		expect(isValidCallbackUrl("/auth/sign-in")).toBe(true);
	});

	it("should return false for absolute URLs", () => {
		expect(isValidCallbackUrl("https://google.com")).toBe(false);
		expect(isValidCallbackUrl("http://localhost:3000")).toBe(false);
		expect(isValidCallbackUrl("ftp://files.com")).toBe(false);
		expect(isValidCallbackUrl("//google.com")).toBe(false);
	});

	it("should return false for null or undefined or empty strings", () => {
		expect(isValidCallbackUrl(null)).toBe(false);
		expect(isValidCallbackUrl(undefined)).toBe(false);
		expect(isValidCallbackUrl("")).toBe(false);
	});

	it("should return false for protocol-relative URLs", () => {
		expect(isValidCallbackUrl("//attacker.com")).toBe(false);
		expect(isValidCallbackUrl("///attacker.com")).toBe(false);
	});

	it("should return false for URLs with backslashes", () => {
		expect(isValidCallbackUrl("/\\google.com")).toBe(false);
		expect(isValidCallbackUrl("\\\\google.com")).toBe(false);
	});
});
