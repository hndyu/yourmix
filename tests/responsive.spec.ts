import { test, expect, devices } from "@playwright/test";

// Use the viewport of an iPhone 13.
test.use({ ...devices["iPhone 13"] });

test.describe("Responsive Design - Mobile View", () => {
	test("should display the main components correctly on the homepage", async ({
		page,
	}) => {
		// Mock the ingredients API to ensure ingredients are displayed for the test
		await page.route("/api/ingredients", async (route) => {
			const json = {
				ingredients: [
					{ id: 1, name: "ジン", categoryId: 1, groupId: 1 },
					{ id: 2, name: "ウォッカ", categoryId: 1, groupId: 1 },
					{ id: 3, name: "炭酸水", categoryId: 2, groupId: 3 },
				],
				categories: [
					{ id: 1, name: "スピリッツ", sortOrder: 1 },
					{ id: 2, name: "割り材", sortOrder: 2 },
				],
			};
			await route.fulfill({ json });
		});

		// 1. Navigate to the homepage
		await page.goto("/");

		// 2. Assert that the header is visible
		await expect(
			page.getByRole("heading", { name: "YourMix", level: 1 }),
		).toBeVisible();

		// 3. Assert that the main sections are visible
		await expect(
			page.getByRole("heading", { name: "材料を選択してください" }),
		).toBeVisible();

		// 4. Assert that the 'Mix!' button is initially disabled
		const mixButton = page.getByRole("button", { name: /Mix!/ });
		await expect(mixButton).toBeDisabled();

		// 5. Assert that ingredients are visible after API response
		await page.waitForResponse("/api/ingredients");
		await expect(page.getByLabel("ジン")).toBeVisible({ timeout: 10000 });

		// 6. Select an ingredient and assert that the 'Mix!' button becomes enabled
		await page.getByLabel("ジン").click();
		await expect(mixButton).toBeEnabled();

		// 7. Assert that the footer is visible
		await expect(page.locator("footer")).toBeVisible();
	});
});
