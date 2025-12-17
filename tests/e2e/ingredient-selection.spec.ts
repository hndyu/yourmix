import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// Mock the ingredients API
	await page.route("/api/ingredients", async (route) => {
		const ingredients = Array.from({ length: 6 }, (_, i) => ({
			id: i + 1,
			name: `Ingredient ${i + 1}`,
			categoryId: 1,
			groupId: i + 1,
		}));
		const json = {
			ingredients,
			categories: [{ id: 1, name: "Test Category", sortOrder: 1 }],
		};
		await route.fulfill({ json });
	});

	await page.goto("/");
	// Wait for ingredients to load
	await page.waitForResponse("/api/ingredients");
});

test.describe("Ingredient Selection", () => {
	test("should not allow selecting more than 5 ingredients", async ({
		page,
	}) => {
		// 1. Select 5 ingredients
		for (let i = 1; i <= 5; i++) {
			await page.getByRole("checkbox", { name: `Ingredient ${i}` }).click();
		}

		// 2. Assert that 5 ingredients are selected by checking the chips
		// The selected ingredients are displayed as buttons with their names.
		for (let i = 1; i <= 5; i++) {
			await expect(page.getByText(`Ingredient ${i}`)).toBeVisible();
		}

		// 3. Assert that the 6th ingredient's checkbox is disabled
		const sixthIngredientCheckbox = page.getByRole("checkbox", {
			name: "Ingredient 6",
		});
		await expect(sixthIngredientCheckbox).toBeDisabled();
	});
});
