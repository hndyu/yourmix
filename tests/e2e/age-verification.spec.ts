import { expect, test } from "@playwright/test";

test.describe("Age Verification", () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage before each test to ensure fresh state
		await page.goto("/");
		await page.evaluate(() => localStorage.removeItem("age-verified"));
		await page.reload();
	});

	test("should show the age verification modal on initial visit", async ({
		page,
	}) => {
		const modal = page.getByTestId("age-verification-modal");
		await expect(modal).toBeVisible();
		await expect(page.getByText("あなたは20歳以上ですか？")).toBeVisible();
	});

	test("should allow access when the user agrees", async ({ page }) => {
		const modal = page.getByTestId("age-verification-modal");
		const agreeButton = page.getByTestId("age-agree-button");

		await agreeButton.click();

		// Modal should disappear
		await expect(modal).not.toBeVisible();

		// Verify localStorage is set
		const verified = await page.evaluate(() =>
			localStorage.getItem("age-verified"),
		);
		expect(verified).toBe("true");

		// Refresh and verify modal doesn't reappear
		await page.reload();
		await expect(modal).not.toBeVisible();
	});

	test("should deny access when the user clicks 'No'", async ({ page }) => {
		const denyButton = page.getByTestId("age-deny-button");

		await denyButton.click();

		// Should show denied content
		await expect(page.getByTestId("age-denied-content")).toBeVisible();
		await expect(page.getByText("アクセスできません")).toBeVisible();
		await expect(page.getByTestId("leave-site-button")).toBeVisible();

		// Verify 'Yes' button is no longer visible
		await expect(page.getByTestId("age-agree-button")).not.toBeVisible();
	});

	test("should persist verification state across different pages", async ({
		page,
	}) => {
		// Agree on home page
		await page.getByTestId("age-agree-button").click();
		await expect(page.getByTestId("age-verification-modal")).not.toBeVisible();

		// Navigate to a recipe page (assuming one exists or using a dummy path)
		await page.goto("/privacy-policy");
		await expect(page.getByTestId("age-verification-modal")).not.toBeVisible();
	});
});
