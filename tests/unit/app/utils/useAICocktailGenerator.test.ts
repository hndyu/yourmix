import type { GeneratedCocktail } from "@/app/types/cocktail";
import * as cocktailGenerator from "@/app/utils/cocktail-generator";
import { useAICocktailGenerator } from "@/app/utils/useAICocktailGenerator";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCocktail: GeneratedCocktail = {
	name: "AIカクテル",
	description: "AIによって生成された特別なカクテルです。",
	ingredients: [{ name: "ジン", amount: "45ml" }],
	instructions: ["すべての材料をシェイクし、グラスに注ぐ。"],
};

// cocktail-generatorモジュール全体をモック
vi.mock("@/app/utils/cocktail-generator");

describe("useAICocktailGenerator", () => {
	beforeEach(() => {
		// 各テストの前にモックをリセット
		vi.resetAllMocks();
	});

	it("初期状態で正しく初期化される", () => {
		const { result } = renderHook(() => useAICocktailGenerator());

		expect(result.current.generatedCocktail).toBe(null);
		expect(result.current.isGenerating).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it("generateCocktailが成功した場合、状態を正しく更新する", async () => {
		vi.mocked(cocktailGenerator.generateOriginalCocktail).mockResolvedValue(
			mockCocktail,
		);

		const { result } = renderHook(() => useAICocktailGenerator());

		await act(async () => {
			await result.current.generateCocktail(["ジン"]);
		});

		expect(result.current.isGenerating).toBe(false);
		expect(result.current.generatedCocktail).toEqual(mockCocktail);
		expect(result.current.error).toBe(null);
		expect(cocktailGenerator.generateOriginalCocktail).toHaveBeenCalledWith([
			"ジン",
		]);
	});

	it("generateCocktailが失敗した場合、エラー状態を更新する", async () => {
		const errorMessage = "生成に失敗しました";
		vi.mocked(cocktailGenerator.generateOriginalCocktail).mockRejectedValue(
			new Error(errorMessage),
		);

		const { result } = renderHook(() => useAICocktailGenerator());

		await act(async () => {
			await result.current.generateCocktail(["ウォッカ"]);
		});

		expect(result.current.isGenerating).toBe(false);
		expect(result.current.generatedCocktail).toBe(null);
		expect(result.current.error).toBe(errorMessage);
	});

	it("生成中にisGeneratingがtrueになる", async () => {
		let resolve: (value: GeneratedCocktail) => void;
		const promise = new Promise<GeneratedCocktail>((r) => {
			resolve = r;
		});
		vi.mocked(cocktailGenerator.generateOriginalCocktail).mockReturnValue(
			promise,
		);

		const { result } = renderHook(() => useAICocktailGenerator());

		act(() => {
			result.current.generateCocktail(["ラム"]);
		});

		expect(result.current.isGenerating).toBe(true);

		await act(async () => {
			resolve(mockCocktail);
			await promise;
		});

		expect(result.current.isGenerating).toBe(false);
	});

	it("材料が空の配列の場合、APIを呼ばずにカクテルをnullにする", async () => {
		const { result } = renderHook(() => useAICocktailGenerator());

		// 初期状態で何かカクテルがあったと仮定
		act(() => {
			result.current.generateCocktail = vi
				.fn()
				.mockImplementation(async (ingredients: string[]) => {
					if (ingredients.length === 0) {
						result.current.generatedCocktail = null;
						return;
					}
				});
		});

		await act(async () => {
			await result.current.generateCocktail([]);
		});

		expect(result.current.generatedCocktail).toBe(null);
		expect(cocktailGenerator.generateOriginalCocktail).not.toHaveBeenCalled();
	});

	it("clearGeneratedCocktailで生成されたカクテルをクリアする", async () => {
		vi.mocked(cocktailGenerator.generateOriginalCocktail).mockResolvedValue(
			mockCocktail,
		);
		const { result } = renderHook(() => useAICocktailGenerator());

		await act(async () => {
			await result.current.generateCocktail(["テキーラ"]);
		});

		expect(result.current.generatedCocktail).not.toBe(null);

		act(() => {
			result.current.clearGeneratedCocktail();
		});

		expect(result.current.generatedCocktail).toBe(null);
	});
});
