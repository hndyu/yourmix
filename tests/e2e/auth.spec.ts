import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
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

		// Should redirect to the specified callbackUrl
		await expect(page).toHaveURL("/test-callback");

		await page.getByRole("button", { name: "Account settings" }).click();

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

		// Should redirect to the home page
		await expect(page).toHaveURL("/");

		await page.getByRole("button", { name: "Account settings" }).click();

		// The user's name should be visible in the header
		await expect(page.getByText("マイページ")).toBeVisible();

		// --- 2. Sign Out ---
		// Click the sign out button
		await page.getByRole("menuitem", { name: "ログアウト" }).click();

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
		await page.getByRole("button", { name: "Account settings" }).click();
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
			page.getByText("利用規約への同意が必要です").nth(0),
		).toBeVisible();
		await expect(page).toHaveURL("/auth/sign-up");
	});
});
