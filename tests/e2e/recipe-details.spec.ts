import { expect, test } from "@playwright/test";

test("should navigate to the recipe details page after mixing a cocktail", async ({
	page,
}) => {
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

	// 2. Select ingredients for a Gin Fizz using search box
	const searchBox = page.getByPlaceholder("材料名で検索...");
	const ingredients = ["ジン", "炭酸水"];
	for (const name of ingredients) {
		await searchBox.fill(name);

		// Try to find the button
		const button = page
			.getByRole("button", { name: new RegExp(`^${name}$`) })
			.first();

		// Check if button is visible, if not, expand details
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
		await searchBox.clear();
	}

	// 3. Click the mix button and wait for the search API response simultaneously
	await Promise.all([
		page.waitForResponse((resp) => resp.url().includes("/api/cocktails")),
		page.getByRole("button", { name: "Mix!" }).click(),
	]);

	// 4. Wait for the result and click on the "Gin Fizz" cocktail card/link
	// First, wait for a key element inside the card (like the heading) to be visible.
	// This ensures the client-side rendering is complete before we proceed.
	const heading = page.getByRole("heading", { name: "ジン・フィズ" });
	await expect(heading).toBeVisible();

	// The heading is visible. Now, find its parent element which acts as the card/link.
	// The link wraps the heading.
	const recipeLink = heading.locator("xpath=ancestor::a[1]");
	await expect(recipeLink).toBeVisible();

	// Note: We don't click and verify the details page content deeply because it's a Server Component
	// and we can't easily mock the server-side data fetching without a test DB or more complex setup.
	// We verify the link href is correct.
	await expect(recipeLink).toHaveAttribute("href", "/recipes/gin-fizz");

	// Optional: Navigate and check URL
	await recipeLink.click();
	await expect(page).toHaveURL(/.*\/recipes\/gin-fizz/);
});
