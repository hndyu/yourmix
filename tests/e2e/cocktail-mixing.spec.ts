import { expect, test } from "@playwright/test";

test("should be able to mix a gin-fizz", async ({ page }) => {
	// Mock the ingredients API
	await page.route("**/api/ingredients", async (route) => {
		console.log("Mocking /api/ingredients hit");
		const json = {
			ingredients: [
				{ id: 1, name: "ジン", categoryId: 1, groupId: 1 },
				{ id: 2, name: "リキュール", categoryId: 1, groupId: 2 },
			],
			categories: [{ id: 1, name: "スピリッツ", sortOrder: 1 }],
		};
		await route.fulfill({ json });
	});

	// Mock the cocktail generation API
	await page.route("/api/generate-cocktail", async (route) => {
		const json = {
			name: "ジン・フィズ",
			description: "さっぱりとした味わいのカクテルです。",
			ingredients: [
				{ name: "ジン", amount: "45ml" },
				{ name: "レモンジュース", amount: "30ml" },
				{ name: "砂糖", amount: "2tsp" },
				{ name: "ソーダ", amount: "適量" },
			],
			instructions: ["シェイクしてグラスに注ぐ", "ソーダで満たす"],
		};
		await route.fulfill({ json });
	});

	// Mock the search API (to return empty or specific results if needed, here empty to focus on generation)
	await page.route("/api/cocktails?*", async (route) => {
		await route.fulfill({ json: { cocktails: [] } });
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

	// 4. Click the mix button and wait for the cocktail generation API response
	await Promise.all([
		page.waitForResponse((resp) =>
			resp.url().includes("/api/generate-cocktail"),
		),
		page.getByRole("button", { name: "Mix!" }).click(),
	]);

	// 5. Assert that the result is displayed
	// We check for the cocktail name in the heading
	await expect(
		page.getByRole("heading", { name: "ジン・フィズ", level: 2 }), // CocktailDisplay uses h2 on homepage
	).toBeVisible();
});
