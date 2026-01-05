import { expect, test } from "@playwright/test";
import { installMockTurnstile } from "./helpers/mockTurnstile";

test.describe("Account Management", () => {
	test.beforeEach(async ({ page }) => {
		await installMockTurnstile(page);
	});

	const timestamp = new Date().getTime();
	const user = {
		name: `User ${timestamp}`,
		email: `user${timestamp}@example.com`,
		password: "Password123!",
	};

	test("should allow updating profile and changing password", async ({
		page,
	}) => {
		// 1. Sign Up
		await page.goto("/auth/sign-up");
		await page.getByTestId("name-input").fill(user.name);
		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(user.password);
		await page.getByTestId("terms-agreement-checkbox").click();
		await page.getByTestId("sign-up-button").click();
		await expect(page).toHaveURL("/");

		// 2. Go to My Page
		await page.getByRole("button", { name: "User menu" }).click();
		await page.getByText("マイページ").click();
		await expect(page).toHaveURL("/my-page");

		// 3. Update Profile
		await page.getByRole("button", { name: "編集" }).click();
		const newName = `${user.name} Updated`;
		await page.locator("#name").fill(newName);
		await page.getByRole("button", { name: "保存する" }).click();

		await page.getByRole("button", { name: "閉じる" }).click();
		await expect(page.getByText(newName)).toBeVisible();

		// 4. Change Password
		await page.getByRole("button", { name: "パスワードを変更" }).click();
		await page.locator("#current-password").fill(user.password);
		const newPassword = "NewPassword456!";
		await page.locator("#new-password").fill(newPassword);
		await page.locator("#confirm-new-password").fill(newPassword);
		await page.getByRole("button", { name: "更新する" }).click();

		await page.getByRole("button", { name: "閉じる" }).click();

		// 5. Verify new password works by re-logging
		await page.getByRole("button", { name: "User menu" }).click();
		await page.getByRole("button", { name: "ログアウト" }).click();

		await page.goto("/auth/sign-in");
		await page.getByTestId("email-input").fill(user.email);
		await page.getByTestId("password-input").fill(newPassword);
		await page.getByTestId("sign-in-button").click();

		await expect(page).toHaveURL("/");
	});

	test("should allow account deletion", async ({ page }) => {
		// 1. Sign Up
		const deleteUser = {
			name: `Delete ${timestamp}`,
			email: `delete${timestamp}@example.com`,
			password: "Password123!",
		};
		await page.goto("/auth/sign-up");
		await page.getByTestId("name-input").fill(deleteUser.name);
		await page.getByTestId("email-input").fill(deleteUser.email);
		await page.getByTestId("password-input").fill(deleteUser.password);
		await page.getByTestId("terms-agreement-checkbox").click();
		await page.getByTestId("sign-up-button").click();

		// 2. Go to My Page
		await page.getByRole("button", { name: "User menu" }).click();
		await page.getByText("マイページ").click();

		// 3. Delete Account
		await page.getByRole("button", { name: "アカウントを削除" }).click();
		await page.getByRole("button", { name: "削除する" }).click();

		await page.getByRole("button", { name: "閉じる" }).click();

		// 4. Verify redirected and signed out
		// Note: Redirects to sign-in due to the session guard on MyPage triggering during sign out
		await expect(page).toHaveURL(/\/auth\/sign-in/);
		await expect(page.getByRole("link", { name: "ログイン" })).toBeVisible();

		// 5. Verify can't sign in anymore
		await page.goto("/auth/sign-in");
		await page.getByTestId("email-input").fill(deleteUser.email);
		await page.getByTestId("password-input").fill(deleteUser.password);
		await page.getByTestId("sign-in-button").click();

		// Should show error (better-auth standard error message)
		await expect(
			page.getByText(/Invalid/i).or(page.getByText(/失敗/)),
		).toBeVisible();
	});
});
