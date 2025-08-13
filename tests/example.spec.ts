import { test, expect } from "@playwright/test";

test.describe("ホーム画面", () => {
	test("タイトル/ヘッダー/案内が表示され、初期はMixが無効", async ({
		page,
	}) => {
		await page.goto("/");

		await expect(page).toHaveTitle(/YourMix/);

		await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
		await expect(page.getByRole("banner").getByText("YourMix")).toBeVisible();

		await expect(
			page.getByRole("heading", { name: "あなただけのカクテルを作ってみよう" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "材料を選択してください" }),
		).toBeVisible();

		await expect(page.getByRole("button", { name: /Mix/ })).toBeDisabled();
	});
});
