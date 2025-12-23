import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test.describe("Ingredient Selection", () => {
	test("should not allow selecting more than 5 ingredients", async ({
		page,
	}) => {
		const ingredientsToSelect = [
			"ジン",
			"ウォッカ",
			"ラム",
			"テキーラ",
			"ライ・ウイスキー",
		];
		const sixthIngredient = "ブランデー";

		// 1. Select 5 ingredients
		const searchBox = page.getByPlaceholder("材料名で検索...");
		for (const name of ingredientsToSelect) {
			await searchBox.fill(name);

			// Try to find and click the button (use regex to handle description text)
			const button = page
				.getByRole("button", { name: new RegExp(`^${name}.*$`, "i") })
				.first();

			// Check if button is visible, if not, we need to expand details
			const isVisible = await button
				.isVisible({ timeout: 1000 })
				.catch(() => false);

			if (!isVisible) {
				// Click the expand button to reveal detail ingredients
				await page
					.getByText(/銘柄・詳細/)
					.first()
					.click();
				// Wait a moment for expansion animation
				await page.waitForTimeout(300);
			}

			// Now click the ingredient button
			await button.click();
			// Wait for state to update
			await page.waitForTimeout(100);
		}

		// 2. Try to select the 6th ingredient
		await searchBox.fill(sixthIngredient);
		await page
			.getByRole("button", { name: new RegExp(`^${sixthIngredient}.*$`, "i") })
			.first()
			.click();

		// 3. Assert that the warning message is displayed
		await expect(page.getByText("材料は5つまでです")).toBeVisible();
	});
});
