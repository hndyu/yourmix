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
		const searchBox = page.getByPlaceholder("材料を検索 (例: ジン、レモン...)");
		for (const name of ingredientsToSelect) {
			await searchBox.fill(name);
			await page.getByRole("option", { name: name }).first().click();
		}

		// 2. Assert that 5 ingredients are selected by checking the chips
		// The selected ingredients are displayed as chips.
		for (const name of ingredientsToSelect) {
			// Check if the chip with the ingredient name exists
			await expect(
				page.locator(".MuiChip-label").getByText(name),
			).toBeVisible();
		}

		// 3. Try to select the 6th ingredient
		await searchBox.fill(sixthIngredient);
		await page.getByRole("option", { name: sixthIngredient }).first().click();

		// 4. Assert that the warning message is displayed
		await expect(
			page.getByRole("alert").filter({ hasText: "材料は5つまでです" }),
		).toBeVisible();
	});
});
