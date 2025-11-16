"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cocktail } from "../types/cocktail";

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
			const params = new URLSearchParams({
				ingredients: ingredientIds.join(","),
			});
			const response = await fetch(`/api/cocktails?${params.toString()}`);
			if (!response.ok) {
				throw new Error("カクテルの検索に失敗しました。");
			}
			const data = (await response.json()) as { cocktails: Cocktail[] };
			setCocktails(data.cocktails);
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
