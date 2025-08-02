"use client";

import * as React from "react";
import MixSection from "./mix-section";
import CocktailDisplay from "./cocktail-display";
import { mockCocktails, type Cocktail } from "../types/cocktail";

export default function CocktailMixer() {
	// カクテル表示の状態管理
	const [selectedCocktail, setSelectedCocktail] =
		React.useState<Cocktail | null>(null);

	// ランダムなカクテルを選択する関数
	const selectRandomCocktail = () => {
		const randomIndex = Math.floor(Math.random() * mockCocktails.length);
		return mockCocktails[randomIndex];
	};

	// クリックハンドラー
	const handleMixClick = () => {
		console.log("Mixボタンがクリックされました！");
		// ランダムなカクテルを選択して表示
		const randomCocktail = selectRandomCocktail();
		setSelectedCocktail(randomCocktail);
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
