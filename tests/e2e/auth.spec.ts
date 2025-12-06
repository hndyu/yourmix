import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
	// Unique user for each test run to avoid conflicts
	const timestamp = new Date().getTime();
	const user = {
		name: `Test User ${timestamp}`,
		email: `test${timestamp}@example.com`,
		password: "Password123!",
	};

	test("should allow a user to sign up and then sign in", async ({ page }) => {
		// 1. Sign Up
		await page.goto("/auth/sign-up");

		await page.getByTestId("name-input").fill(user.name);
		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(user.password);

		await page.getByTestId("sign-up-button").click();

		// Should redirect to Sign In page upon success
		await expect(page).toHaveURL(/\/auth\/sign-in/);

		// 2. Sign In
		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(user.password);

		await page.getByTestId("sign-in-button").click();

		// Should redirect to Home page
		await expect(page).toHaveURL("/");

		// Verify logged in state (e.g., check for user menu or absence of login button)
		// Since we don't have exact text for user menu, checking non-existence of login button or existence of avatar is good.
		// Assuming AuthControls shows an avatar or user name.
		// Let's check if "ログイン" button is gone or "ログアウト" is available in menu (requires click).

		// Wait for hydration and auth check
		await expect(page.getByTestId("sign-in-button")).not.toBeVisible();
	});
});
