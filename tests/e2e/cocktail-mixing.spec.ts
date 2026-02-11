import { expect, test } from "@playwright/test";

test("should be able to mix a gin-fizz", async ({ page }) => {
	// E2E用のモックモードを有効化
	await page.addInitScript(() => {
		window.__E2E__ = true;
		window.__E2E_SEARCH_RESULTS__ = [];
	});

	// 1. Navigate to the homepage
	await page.goto("/");

	// 2. Check for the main heading
	await expect(
		page.getByRole("heading", { name: "YourMix", level: 1 }),
	).toBeVisible();

	// 3. Select ingredients using search box
	const searchBox = page.getByPlaceholder("材料名で検索...");

	// Select first ingredient (ジン)
	await searchBox.fill("ジン");
	await page
		.getByRole("button", { name: /^ジン.*$/i })
		.first()
		.click();

	// Clear search and select second ingredient (リキュール)
	await searchBox.clear();
	await searchBox.fill("リキュール");
	await page
		.getByRole("button", { name: /^リキュール.*$/i })
		.first()
		.click();

	// 4. Click the mix button and wait for the result
	await page.getByRole("button", { name: "Mix!" }).click();

	// 5. Assert that the result is displayed
	// We check for the cocktail name in the heading
	await expect(
		page.getByRole("heading", { name: "ジン・フィズ", level: 2 }), // CocktailDisplay uses h2 on homepage
	).toBeVisible();
});
