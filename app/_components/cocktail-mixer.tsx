"use client";

import * as React from "react";
import MixSection from "./mix-section";
import CocktailDisplay from "./cocktail-display";
import { mockCocktails, type Cocktail } from "../types/cocktail";
import {
	filterCocktailsByIngredients,
	sortCocktailsByMatchScore,
} from "../utils/cocktail-filter";

export default function CocktailMixer() {
	// カクテル表示の状態管理
	const [selectedCocktail, setSelectedCocktail] =
		React.useState<Cocktail | null>(null);

	// 選択された材料に基づいてカクテルを選択する関数
	const selectCocktailByIngredients = (selectedIngredients: string[]) => {
		console.log("選択された材料:", selectedIngredients);

		// 材料に基づいてカクテルをフィルタリング
		const filteredCocktails = filterCocktailsByIngredients(
			mockCocktails,
			selectedIngredients,
		);

		if (filteredCocktails.length === 0) {
			// フィルタリング結果が空の場合は、全てのカクテルからランダム選択
			console.log(
				"材料にマッチするカクテルが見つかりませんでした。ランダム選択します。",
			);
			const randomIndex = Math.floor(Math.random() * mockCocktails.length);
			return mockCocktails[randomIndex];
		}

		// マッチ度順にソート
		const sortedCocktails = sortCocktailsByMatchScore(
			filteredCocktails,
			selectedIngredients,
		);

		// 最もマッチ度の高いカクテルを選択
		const bestMatch = sortedCocktails[0];
		console.log("選択されたカクテル:", bestMatch.name);

		return bestMatch;
	};

	// クリックハンドラー
	const handleMixClick = (selectedIngredients: string[]) => {
		console.log("Mixボタンがクリックされました！");
		// 選択された材料に基づいてカクテルを選択して表示
		const matchedCocktail = selectCocktailByIngredients(selectedIngredients);
		setSelectedCocktail(matchedCocktail);
	};

	// カクテル表示を閉じる関数
	const handleCloseCocktail = () => {
		setSelectedCocktail(null);
	};

	return (
		<>
			{/* Mixセクション */}
			<MixSection onMixClick={handleMixClick} />

			{/* カクテルが選択されている場合のみ表示 */}
			{selectedCocktail && (
				<CocktailDisplay
					cocktail={selectedCocktail}
					onRemove={handleCloseCocktail}
				/>
			)}
		</>
	);
}
