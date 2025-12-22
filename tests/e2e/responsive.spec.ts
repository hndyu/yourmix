import { devices, expect, test } from "@playwright/test";

// Use the viewport of an iPhone 13.
test.use({ ...devices["iPhone 13"] });

test.describe("Responsive Design - Mobile View", () => {
	test("should display the main components correctly on the homepage", async ({
		page,
	}) => {
		// 1. Navigate to the homepage
		await page.goto("/");

		// 2. Assert that the header is visible
		await expect(
			page.getByRole("heading", { name: "YourMix", level: 1 }),
		).toBeVisible();

		// 3. Assert that the main sections are visible
		await expect(
			page.getByRole("heading", {
				name: /あなただけのカクテルを.*作ってみよう/,
			}),
		).toBeVisible();

		// 4. Assert that the 'Mix!' button is initially disabled
		const mixButton = page.getByRole("button", { name: /Mix!/ });
		await expect(mixButton).toBeDisabled();

		// 5. Assert that ingredients are visible (using button role now)
		const ginButton = page.getByRole("button", { name: /^ワイン.*$/ }).first();
		await expect(ginButton).toBeVisible({ timeout: 10000 });

		// 6. Select an ingredient and assert that the 'Mix!' button becomes enabled
		await ginButton.click();
		await expect(mixButton).toBeEnabled();

		// 7. Assert that the footer is visible
		await expect(page.locator("footer")).toBeVisible();
	});
});
