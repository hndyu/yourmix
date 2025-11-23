import { test, expect } from "@playwright/test";

test("should be able to mix a gin-fizz", async ({ page }) => {
	// 1. Navigate to the homepage
	await page.goto("/");

	// 2. Check for the main heading
	await expect(
		page.getByRole("heading", { name: "YourMix", level: 1 }),
	).toBeVisible();

	// Wait for ingredients to load before attempting to select them
	await page.waitForResponse("/api/ingredients");

	// 3. Select ingredients
	await page.getByLabel("ジン").click();
	await page.getByLabel("リキュール").click();

	// 4. Click the mix button
	await page.getByRole("button", { name: "Mix!" }).click();

	// Wait for the cocktail generation API response
	await page.waitForResponse("/api/generate-cocktail");

	// 5. Assert that the result is displayed
	await expect(page.getByText("ジン・フィズ")).toBeVisible();
});

