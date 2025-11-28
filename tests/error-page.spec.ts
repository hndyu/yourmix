import { test, expect } from "@playwright/test";

test.describe("Error Page", () => {
	test("should display the error page when an error is thrown and allow retrying", async ({
		page,
	}) => {
		// 1. テスト用のエラーページにアクセス
		await page.goto("/test-error");
		await expect(
			page.getByRole("heading", { name: "Test Error Page" }),
		).toBeVisible();

		// 2. ボタンをクリックしてクライアントサイドでエラーを発生させる
		await page.getByRole("button", { name: "Click to throw error" }).click();

		// 3. エラーページが表示されるのを待つ
		await page.waitForSelector("text=予期せぬエラーが発生しました");

		// 4. エラーページの主要な要素が表示されていることを確認
		await expect(
			page.getByRole("heading", { name: "予期せぬエラーが発生しました" }),
		).toBeVisible();
		await expect(
			page.getByText("ご迷惑をおかけしております。時間をおいて再度お試しください。"),
		).toBeVisible();
		const retryButton = page.getByRole("button", { name: "再試行" });
		await expect(retryButton).toBeVisible();

		// 5. 「再試行」ボタンをクリック
		await retryButton.click();

		// 6. ページがリセットされ、元のテストページが再度表示されるのを待つ
		await expect(
			page.getByRole("heading", { name: "Test Error Page" }),
		).toBeVisible();

		// 7. エラーメッセージがもう表示されていないことを確認
		await expect(
			page.getByRole("heading", { name: "予期せぬエラーが発生しました" }),
		).not.toBeVisible();
	});
});
