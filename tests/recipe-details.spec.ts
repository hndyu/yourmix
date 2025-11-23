import { test, expect } from "@playwright/test";

test("should navigate to the recipe details page after mixing a cocktail", async ({
	page,
}) => {
	// 1. Navigate to the homepage
	await page.goto("/");

	// Wait for ingredients to load before attempting to select them
	await page.waitForResponse("/api/ingredients");

	// 2. Select ingredients for a Gin Fizz
	await page.getByLabel("ジン").click();
	await page.getByLabel("炭酸水").click();

	// 3. Click the mix button
	await page.getByRole("button", { name: "Mix!" }).click();

	// Wait for the cocktail generation API response
	await page.waitForResponse("/api/generate-cocktail");

	// 4. Wait for the result and click on the "Gin Fizz" cocktail card/link
	const recipeCard = page.locator(".MuiPaper-root").filter({
		has: page.getByRole("heading", { name: /ジン・フィズ/i }),
	});

	const recipeLink = recipeCard.getByRole("link", { name: "詳細を見る" });

	await expect(recipeLink).toBeVisible();
	await recipeLink.click();

	// 5. Assert that the URL is the recipe details page
	await expect(page).toHaveURL(/.*\/recipes\/gin-fizz/);

	// 6. Assert that the main headings of the details page are visible
	await expect(
		page.getByRole("heading", { name: "ジン・フィズ", level: 1 }),
	).toBeVisible();
	await expect(page.getByRole("heading", { name: "材料" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "作り方" })).toBeVisible();
});
