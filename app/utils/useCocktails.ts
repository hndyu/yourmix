"use client";

import { useCallback, useState } from "react";
import { searchCocktailsAction } from "../actions/search-cocktails";
import type { Cocktail } from "../types/cocktail";

declare global {
	interface Window {
		__E2E__?: boolean;
		__E2E_SEARCH_RESULTS__?: Cocktail[];
	}
}

const isE2E = typeof window !== "undefined" && window.__E2E__ === true;

/**
 * カクテルの検索と状態管理を行うカスタムフック
 * @param initialCocktails - 初期表示用のカクテルリスト
 */
export function useCocktails(initialCocktails: Cocktail[] = []) {
	const [cocktails, setCocktails] = useState<Cocktail[]>(initialCocktails);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * 材料IDに基づいてカクテルを検索する関数
	 * @param ingredientIds - 検索に使用する材料IDの配列
	 */
	const searchCocktails = useCallback(async (ingredientIds: number[]) => {
		setIsLoading(true);
		setError(null);
		try {
			// 材料が選択されていない場合はAPIを呼ばずに初期状態（空配列）に戻す
			if (ingredientIds.length === 0) {
				setCocktails([]);
				return;
			}

			const data = await searchCocktailsAction(ingredientIds, {
				mock: isE2E,
				mockData: isE2E ? window.__E2E_SEARCH_RESULTS__ : undefined,
			});
			setCocktails(data);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "不明なエラーが発生しました。";
			setError(errorMessage);
			console.error("Error searching cocktails:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		cocktails,
		isLoading,
		error,
		searchCocktails,
		setCocktails,
	};
}
