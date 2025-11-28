import { test, expect, devices } from "@playwright/test";

// Use the viewport of an iPhone 13.
test.use({ ...devices["iPhone 13"] });

test.describe("Responsive Design - Mobile View", () => {

	test("should display the main components correctly on the homepage", async ({
		page,
	}) => {
		// 1. Navigate to the homepage
		await page.goto("/");

		// 2. Assert that the header is visible
		await expect(
			page.getByRole("heading", { name: "YourMix", level: 1 }),
		).toBeVisible();

		// 3. Assert that the main sections are visible
		await expect(page.getByRole("heading", { name: "材料を選択してください" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "あなただけのカクテルを作ってみよう" })).toBeVisible();

		// 4. Assert that at least one ingredient is visible
		await page.waitForResponse("/api/ingredients");
		await expect(page.getByLabel("ジン")).toBeVisible({ timeout: 10000 });

		// 5. Assert that the 'Mix!' button is visible
		await expect(page.getByRole("button", { name: "Mix!" })).toBeVisible();

		// 6. Assert that the footer is visible
		await expect(page.locator("footer")).toBeVisible();
	});
});
