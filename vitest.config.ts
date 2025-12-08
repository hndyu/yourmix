import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		// テスト環境の設定
		environment: "jsdom",
		// テストファイルのパターン
		include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
		exclude: [...configDefaults.exclude, "./tests/e2e/**"],
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
		setupFiles: ["./vitest-setup.js"],
	},
});
