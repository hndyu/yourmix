import { test, expect, type Page } from "@playwright/test";
import type { Cocktail } from "../app/types/cocktail";

/**
 * テストデータと期待されるテキストを生成するヘルパー関数
 * @param page Playwright の Page オブジェクト
 * @returns カクテルデータと期待されるクリップボードのテキスト
 */
async function getExpectedText(
	page: Page,
): Promise<{ cocktail: Cocktail; expectedText: string }> {
	// APIからテスト対象のカクテルのデータを取得
	const apiResponse = await page.request.get("/api/cocktails/gin-fizz");
	const { cocktail } = (await apiResponse.json()) as { cocktail: Cocktail };

	const ingredientsText = cocktail.ingredients
		.map((i) => `${i.name} ${i.amount}`)
		.join("\n");
	const instructionsText = cocktail.instructions
		.map((instruction, index) => `${index + 1}. ${instruction}`)
		.join("\n");
	// テスト実行時のURLを取得
	const url = page.url();

	// share-utils.tsのcreateShareTextロジックを再現
	const expectedText = `${cocktail.name} - カクテルレシピ\n\n${cocktail.description}\n\n材料:\n${ingredientsText}\n\n作り方:\n${instructionsText}\n\n${url}`;

	return { cocktail, expectedText };
}

test.describe("Share Functionality", () => {
	// クリップボードへのアクセス許可
	test.beforeEach(async ({ context, browserName }) => {
		// FirefoxとWebKitは現時点で 'clipboard-read'/'clipboard-write' の権限付与に完全対応していないためスキップ
		if (browserName === "firefox" || browserName === "webkit") {
			test.skip(
				true,
				`${browserName} does not support clipboard permissions.`,
			);
		}
		// Chromiumのために権限を付与
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	});

	test("should copy the recipe to the clipboard when Web Share API is not supported", async ({
		page,
	}) => {
		// 1. レシピ詳細ページに直接アクセス (例: ジン・フィズ)
		await page.goto("/recipes/gin-fizz");
		await page.waitForLoadState("networkidle");

		// 2. ツールチップが "レシピをコピー" になっていることを確認
		const copyButton = page.getByRole("button", { name: "レシピをコピー" });
		await expect(copyButton).toBeVisible();

		// 3. ボタンをクリック
		await copyButton.click();

		// 4. "レシピをクリップボードにコピーしました！" というスナックバーが表示されることを確認
		const snackbar = page.locator("div[role='alert']", {
			hasText: "レシピをクリップボードにコピーしました！",
		});
		await expect(snackbar).toBeVisible();

		// 5. クリップボードの内容を検証
		const { expectedText } = await getExpectedText(page);
		const clipboardText = await page.evaluate(() =>
			navigator.clipboard.readText(),
		);

		// 正規化して比較（改行コードの違いなどを吸収）
		const normalize = (str: string) =>
			str.replace(/\r\n/g, "\n").trim();
		expect(normalize(clipboardText)).toEqual(normalize(expectedText));

		// 6. スナックバーが時間経過で消えることを確認
		await expect(snackbar).not.toBeVisible({ timeout: 5000 }); // autoHideDurationに合わせて待機
	});

	test("should show share icon and tooltip when Web Share API is supported", async ({
		page,
	}) => {
		// Web Share APIをモックする
		await page.addInitScript(() => {
			// navigator.shareが存在する状態をシミュレート
			Object.defineProperty(navigator, "share", {
				value: async (data?: ShareData) => {
					console.log("navigator.share called with:", data);
					return Promise.resolve();
				},
				writable: true,
				configurable: true,
			});
			// canUseWebShareがtrueを返すようにcanShareも定義
			Object.defineProperty(navigator, "canShare", {
				value: (data?: ShareData) => {
					console.log("navigator.canShare called with:", data);
					return true;
				},
				writable: true,
				configurable: true,
			});
		});

		// 1. レシピ詳細ページにアクセス
		await page.goto("/recipes/gin-fizz");
		await page.waitForLoadState("networkidle");

		// 2. 共有ボタンとツールチップが "共有" になっていることを確認
		const shareButton = page.getByRole("button", { name: "共有" });
		await expect(shareButton).toBeVisible();

		// 3. 共有アイコンが表示されていることを確認
		// Material UIのアイコンは通常 <svg> タグでレンダリングされる
		// data-testidがない場合、子要素のSVGの存在を確認する
		const shareIcon = shareButton.locator('svg[data-testid="ShareIcon"]');
		await expect(shareIcon).toBeVisible();

		// 4. コピーアイコンが表示されていないことを確認
		const copyIcon = shareButton.locator('svg[data-testid="CopyIcon"]');
		await expect(copyIcon).not.toBeVisible();
	});
});
