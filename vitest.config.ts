import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
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
