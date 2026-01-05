"use client";

import { useCallback, useState } from "react";
import type { Cocktail } from "../types/cocktail";
import { generateOriginalCocktail } from "./cocktail-generator";

/**
 * AIによるオリジナルカクテル生成のロジックを管理するカスタムフック
 */
export function useAICocktailGenerator() {
	const [generatedCocktail, setGeneratedCocktail] = useState<Cocktail | null>(
		null,
	);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * 選択された材料名に基づいてオリジナルカクテルを生成する関数
	 * @param ingredientNames - オリジナルカクテルのベースとなる材料名の配列
	 */
	const generateCocktail = useCallback(async (ingredientNames: string[]) => {
		if (ingredientNames.length === 0) {
			setGeneratedCocktail(null);
			return;
		}
		setIsGenerating(true);
		setError(null);
		try {
			const cocktail = await generateOriginalCocktail(ingredientNames);
			setGeneratedCocktail(cocktail);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "オリジナルカクテルの生成中に不明なエラーが発生しました。";
			setError(errorMessage);
			console.error("Error generating AI cocktail:", err);
		} finally {
			setIsGenerating(false);
		}
	}, []);

	/**
	 * 生成されたカクテルの表示をクリアする関数
	 */
	const clearGeneratedCocktail = useCallback(() => {
		setGeneratedCocktail(null);
	}, []);

	return {
		generatedCocktail,
		isGenerating,
		error,
		generateCocktail,
		clearGeneratedCocktail,
	};
}
