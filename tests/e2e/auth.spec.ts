import { expect, test } from "@playwright/test";
import { installMockTurnstile } from "./helpers/mockTurnstile";

test.describe("Authentication Flow", () => {
	// Inject Turnstile mock before each test to bypass CAPTCHA in E2E
	test.beforeEach(async ({ page }) => {
		await installMockTurnstile(page);

		// Relay browser console messages to terminal to aid debugging
		page.on("console", (msg) => {
			try {
				console.log(`[browser:${msg.type()}] ${msg.text()}`);
			} catch (e) {
				console.log("[browser] console message error", e);
			}
		});
	});

	// Unique user for each test run to avoid conflicts
	const timestamp = new Date().getTime();
	const user = {
		name: `Test User ${timestamp}`,
		email: `test${timestamp}@example.com`,
		password: "Password123!",
	};

	test("should allow a user to sign up with a callbackUrl", async ({
		page,
	}) => {
		// Sign Up
		await page.goto("/auth/sign-up?callbackUrl=/test-callback");

		await page.getByTestId("name-input").fill(user.name);
		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(user.password);

		await page.getByTestId("terms-agreement-checkbox").click();

		await page.getByTestId("sign-up-button").click();

		// Handle race condition: if CAPTCHA token wasn't ready yet, an error appears.
		// Retry if we see the CAPTCHA error.
		const captchaError = page.getByText("CAPTCHAの認証が必要です");
		if (await captchaError.isVisible()) {
			await page.waitForTimeout(1000); // Wait for the mock token to be set
			await page.getByTestId("sign-up-button").click();
		}

		// Should redirect to the specified callbackUrl
		await expect(page).toHaveURL("/test-callback");

		// Click the user menu button (aria-label="User menu")
		await page.getByRole("button", { name: "User menu" }).click();

		// The user's name should be visible after sign-up
		await expect(page.getByText("マイページ")).toBeVisible();
	});

	test("should allow a user to sign up, sign out, and then sign in", async ({
		page,
	}) => {
		// --- 1. Sign Up ---
		await page.goto("/auth/sign-up");

		await page.getByTestId("name-input").fill(user.name);
		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(user.password);

		await page.getByTestId("terms-agreement-checkbox").click();

		await page.getByTestId("sign-up-button").click();

		// Handle race condition: if CAPTCHA token wasn't ready yet, an error appears.
		// Retry if we see the CAPTCHA error.
		const captchaError = page.getByText("CAPTCHAの認証が必要です");
		if (await captchaError.isVisible()) {
			await page.waitForTimeout(1000); // Wait for the mock token to be set
			await page.getByTestId("sign-up-button").click();
		}

		// Should redirect to the home page
		await expect(page).toHaveURL("/");

		// Click the user menu button
		await page.getByRole("button", { name: "User menu" }).click();

		// The user's name should be visible in the header
		await expect(page.getByText("マイページ")).toBeVisible();

		// --- 2. Sign Out ---
		// Click the sign out button (it's a button, not menuitem)
		await page.getByRole("button", { name: "ログアウト" }).click();

		// Should be back on the home page and see the sign-in button
		await expect(page.getByRole("link", { name: "ログイン" })).toBeVisible();
		await expect(page.getByText("マイページ")).not.toBeVisible();

		// --- 3. Sign In ---
		await page.goto("/auth/sign-in");

		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(user.password);

		await page.getByTestId("sign-in-button").click();

		// Should redirect back to the home page
		await expect(page).toHaveURL("/");

		// The user's name should be visible again
		await page.getByRole("button", { name: "User menu" }).click();
		await expect(page.getByText("マイページ")).toBeVisible();
		await expect(
			page.getByRole("link", { name: "ログイン" }),
		).not.toBeVisible();
	});

	test("should show a dialog when trying to sign up without agreeing to the terms", async ({
		page,
	}) => {
		await page.goto("/auth/sign-up");

		await page.getByTestId("name-input").fill(user.name);
		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(user.password);

		await page.getByTestId("sign-up-button").click();

		await expect(
			page.getByText("登録には利用規約への同意が必要です").nth(0),
		).toBeVisible();
		await expect(page).toHaveURL("/auth/sign-up");
	});
});
