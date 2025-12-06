import { test, expect } from "@playwright/test";

test("should navigate to the recipe details page after mixing a cocktail", async ({
	page,
}) => {
	// Mock the ingredients API
	await page.route("/api/ingredients", async (route) => {
		const json = {
			ingredients: [
				{ id: 1, name: "ジン", categoryId: 1, groupId: 1 },
				{ id: 2, name: "炭酸水", categoryId: 2, groupId: 3 },
			],
			categories: [
				{ id: 1, name: "スピリッツ", sortOrder: 1 },
				{ id: 2, name: "割り材", sortOrder: 2 },
			],
		};
		await route.fulfill({ json });
	});

	// Mock the cocktail generation API (not strictly needed if we only test search results, but good to have)
	await page.route("/api/generate-cocktail", async (route) => {
		await route.fulfill({ json: {} }); // Return empty or dummy, we focus on search results here
	});

	// Mock the search API to return a specific cocktail
	await page.route("/api/cocktails?*", async (route) => {
		const json = {
			cocktails: [
				{
					id: 100,
					name: "ジン・フィズ",
					slug: "gin-fizz",
					description: "Classic Gin Fizz",
					ingredients: [
						{ name: "ジン", amount: "45ml" },
						{ name: "炭酸水", amount: "Full" },
					],
					instructions: ["Mix"],
				},
			],
		};
		await route.fulfill({ json });
	});

	// 1. Navigate to the homepage
	await page.goto("/");

	// Wait for ingredients to load
	await page.waitForResponse("/api/ingredients");

	// 2. Select ingredients for a Gin Fizz
	await page.getByLabel("ジン").click();
	await page.getByLabel("炭酸水").click();

	// 3. Click the mix button and wait for the search API response simultaneously
	await Promise.all([
		page.waitForResponse((resp) => resp.url().includes("/api/cocktails")),
		page.getByRole("button", { name: "🍹 Mix!" }).click(),
	]);

	// 4. Wait for the result and click on the "Gin Fizz" cocktail card/link
	// First, wait for a key element inside the card (like the heading) to be visible.
	// This ensures the client-side rendering is complete before we proceed.
	const heading = page.getByRole("heading", { name: "ジン・フィズ" });
	await expect(heading).toBeVisible();

	// The heading is visible. Now, find its parent element which acts as the card.
	// Using XPath '..' selector is a robust way to select the parent of a located element.
	const recipeCard = heading.locator("xpath=..");
	await expect(recipeCard).toBeVisible();

	const recipeLink = recipeCard.getByRole("link", { name: "詳細を見る" });
	await expect(recipeLink).toBeVisible();

	// Note: We don't click and verify the details page content deeply because it's a Server Component
	// and we can't easily mock the server-side data fetching without a test DB or more complex setup.
	// We verify the link href is correct.
	await expect(recipeLink).toHaveAttribute("href", "/recipes/gin-fizz");

	// Optional: Navigate and check URL
	await recipeLink.click();
	await expect(page).toHaveURL(/.*\/recipes\/gin-fizz/);
});
