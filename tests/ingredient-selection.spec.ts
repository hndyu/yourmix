import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// Wait for ingredients to load before attempting to select them
	await page.waitForResponse("/api/ingredients");
});

test.describe("Ingredient Selection", () => {
	test("should not allow selecting more than 5 ingredients", async ({
		page,
	}) => {
		// 1. Select 5 ingredients
		await page.getByLabel("ジン").click();
		await page.getByLabel("ウォッカ").click();
		await page.getByLabel("ラム").click();
		await page.getByLabel("テキーラ").click();
		await page.getByLabel("リキュール").click();

		// 2. Assert that 5 ingredients are selected by checking the chips
		const selectedChips = page
			.locator(".MuiChip-root")
			.filter({ has: page.locator(".MuiChip-deleteIcon") });
		await expect(selectedChips).toHaveCount(5);

		// 3. Assert that the 6th ingredient's checkbox is disabled
		const sixthIngredientCheckbox = page.getByRole("checkbox", {
			name: "水",
			exact: true,
		});
		await expect(sixthIngredientCheckbox).toBeDisabled();
	});

	test("should clear all selected ingredients using the 'clear all' button", async ({
		page,
	}) => {
		// 1. Select some ingredients
		await page.getByLabel("ジン").click();
		await page.getByLabel("リキュール").click();

		// 2. Check that they are selected
		await expect(page.getByLabel("ジン")).toBeChecked();
		await expect(page.getByLabel("リキュール")).toBeChecked();
		const selectedChips = page
			.locator(".MuiChip-root")
			.filter({ has: page.locator(".MuiChip-deleteIcon") });
		await expect(selectedChips).toHaveCount(2);

		// 3. Click the 'clear all' button
		await page.getByRole("button", { name: "全解除" }).click();

		// 4. Assert that no ingredients are selected
		await expect(page.getByLabel("ジン")).not.toBeChecked();
		await expect(page.getByLabel("リキュール")).not.toBeChecked();
		await expect(selectedChips).toHaveCount(0);
	});
});
