import type { Cocktail } from "@/app/types/cocktail";
import { useCocktails } from "@/app/utils/useCocktails";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// fetchをグローバルにモック
global.fetch = vi.fn();

const mockCocktails: Cocktail[] = [
	{
		id: "1",
		name: "モヒート",
		description: "爽やかなミントとライムのカクテル",
		ingredients: [],
		instructions: [],
		slug: "mojito",
	},
	{
		id: "2",
		name: "ジントニック",
		description: "ジンの香りが楽しめる定番カクテル",
		ingredients: [],
		instructions: [],
		slug: "gin-and-tonic",
	},
];

describe("useCocktails", () => {
	afterEach(() => {
		// 各テストの後にモックをリセット
		vi.mocked(fetch).mockClear();
	});

	it("初期状態で正しく初期化される", () => {
		const { result } = renderHook(() => useCocktails(mockCocktails));

		expect(result.current.cocktails).toEqual(mockCocktails);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it("searchCocktailsが成功した場合、カクテルリストを更新する", async () => {
		const mockResponse = { cocktails: mockCocktails };
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockResponse),
		} as Response);

		const { result } = renderHook(() => useCocktails());

		// 非同期処理をactでラップ
		await act(async () => {
			await result.current.searchCocktails([1, 2]);
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.cocktails).toEqual(mockCocktails);
		expect(result.current.error).toBe(null);
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith("/api/cocktails?ingredients=1%2C2");
	});

	it("searchCocktailsが失敗した場合、エラー状態を更新する", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
		} as Response);

		const { result } = renderHook(() => useCocktails(mockCocktails));

		await act(async () => {
			await result.current.searchCocktails([1]);
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe("カクテルの検索に失敗しました。");
		// 失敗した場合、元のカクテルリストが保持される
		expect(result.current.cocktails).toEqual(mockCocktails);
	});

	it("searchCocktailsでネットワークエラーが発生した場合、エラー状態を更新する", async () => {
		const mockError = new Error("Network error");
		vi.mocked(fetch).mockRejectedValue(mockError);

		const { result } = renderHook(() => useCocktails());

		await act(async () => {
			await result.current.searchCocktails([1]);
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe("Network error");
	});

	it("searchCocktailsに空の配列が渡された場合、APIを呼ばずにカクテルリストを空にする", async () => {
		const { result } = renderHook(() => useCocktails(mockCocktails));

		await act(async () => {
			await result.current.searchCocktails([]);
		});

		expect(result.current.cocktails).toEqual([]);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("setCocktailsでカクテルリストを直接更新できる", () => {
		const { result } = renderHook(() => useCocktails());

		act(() => {
			result.current.setCocktails(mockCocktails);
		});

		expect(result.current.cocktails).toEqual(mockCocktails);
	});

	it("検索中にisLoadingがtrueになる", async () => {
		let resolve: (value: Response) => void;
		const promise = new Promise<Response>((r) => {
			resolve = r;
		});
		vi.mocked(fetch).mockReturnValue(promise);

		const { result } = renderHook(() => useCocktails());

		// searchCocktailsを呼び出すが、完了は待たない
		act(() => {
			result.current.searchCocktails([1, 2]);
		});

		// API呼び出しが解決される前にisLoadingがtrueであることを確認
		expect(result.current.isLoading).toBe(true);

		// API呼び出しを解決
		await act(async () => {
			resolve({
				ok: true,
				json: () => Promise.resolve({ cocktails: [] }),
			} as Response);
			await promise; // promiseが解決されるのを待つ
		});

		expect(result.current.isLoading).toBe(false);
	});
});
