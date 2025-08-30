import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// テスト環境の設定
		environment: "jsdom",
		// テストファイルのパターン
		include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
		// テストの実行設定
		globals: true,
		// カバレッジの設定
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/coverage/**",
			],
		},
	},
});
