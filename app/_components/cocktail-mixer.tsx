"use client";

import * as React from "react";
import MixSection from "./mix-section";
import CocktailDisplay from "./cocktail-display";
import CocktailSearchResults from "./cocktail-search-results";
import { mockCocktails, type Cocktail } from "../types/cocktail";
import {
	filterCocktailsByIngredients,
	sortCocktailsByMatchScore,
	findExactMatchCocktails,
	generateOriginalCocktail,
} from "../utils/cocktail-filter";

export default function CocktailMixer() {
	// カクテル表示の状態管理
	const [selectedCocktail, setSelectedCocktail] =
		React.useState<Cocktail | null>(null);

	// 検索結果の状態管理
	const [searchResults, setSearchResults] = React.useState<Cocktail[]>([]);
	const [lastSelectedIngredients, setLastSelectedIngredients] = React.useState<
		string[]
	>([]);

	// 選択された材料に基づいてカクテルを選択する関数
	const selectCocktailByIngredients = (selectedIngredients: string[]) => {
		console.log("選択された材料:", selectedIngredients);

		// 完全一致するカクテルを検索
		const exactMatches = findExactMatchCocktails(
			mockCocktails,
			selectedIngredients,
		);

		if (exactMatches.length > 0) {
			// 完全一致するカクテルが見つかった場合、最初のものを選択
			const exactMatch = exactMatches[0];
			console.log("完全一致するカクテルが見つかりました:", exactMatch.name);
			return exactMatch;
		}

		// 完全一致しない場合は生成AIによるオリジナルカクテルを生成
		console.log(
			"完全一致するカクテルが見つかりませんでした。オリジナルカクテルを生成します。",
		);
		return generateOriginalCocktail(selectedIngredients);
	};

	// クリックハンドラー
	const handleMixClick = (selectedIngredients: string[]) => {
		console.log("Mixボタンがクリックされました！");

		// 選択された材料を保存
		setLastSelectedIngredients(selectedIngredients);

		// 材料に基づいてカクテルをフィルタリング（検索結果表示用）
		const filteredCocktails = filterCocktailsByIngredients(
			mockCocktails,
			selectedIngredients,
		);

		// 検索結果を保存
		setSearchResults(filteredCocktails);

		// 選択された材料に基づいてカクテルを選択して表示
		const matchedCocktail = selectCocktailByIngredients(selectedIngredients);
		setSelectedCocktail(matchedCocktail);
	};

	// カクテル表示を閉じる関数
	const handleCloseCocktail = () => {
		setSelectedCocktail(null);
	};

	// 検索結果からカクテルを選択する関数
	const handleCocktailSelect = (cocktail: Cocktail) => {
		setSelectedCocktail(cocktail);
		// 選択されたカクテルまでスクロール
		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}, 100);
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

			{/* 検索結果の一覧表示（1件以上ある場合のみ表示） */}
			{searchResults.length > 0 && (
				<CocktailSearchResults
					cocktails={searchResults}
					selectedIngredients={lastSelectedIngredients}
					onCocktailSelect={handleCocktailSelect}
				/>
			)}
		</>
	);
}
