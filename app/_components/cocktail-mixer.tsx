"use client";

import * as React from "react";
import MixSection from "./mix-section";
import CocktailDisplay from "./cocktail-display";
import CocktailSearchResults from "./cocktail-search-results";
import DailyRecommendation from "./daily-recommendation";
import type { Cocktail } from "../types/cocktail";
import {
	filterCocktailsByIngredients,
	type GroupMapping,
} from "../utils/cocktail-filter";
import { generateOriginalCocktail } from "../utils/cocktail-generator";

export default function CocktailMixer() {
	// DBから取得したすべてのカクテル
	const [allCocktails, setAllCocktails] = React.useState<Cocktail[]>([]);

	// カクテル表示の状態管理
	const [selectedCocktail, setSelectedCocktail] =
		React.useState<Cocktail | null>(null);

	// 検索結果の状態管理
	const [searchResults, setSearchResults] = React.useState<Cocktail[]>([]);
	const [lastSelectedIngredients, setLastSelectedIngredients] = React.useState<
		string[]
	>([]);

	// ローディング状態の管理
	const [isInitialLoading, setIsInitialLoading] = React.useState(true);
	const [isMixing, setIsMixing] = React.useState(false);

	// 表示アニメーションの状態管理
	const [showResults, setShowResults] = React.useState(false);

	// グループマッピングの状態管理
	const [groupMapping, setGroupMapping] = React.useState<GroupMapping>({});

	// 初期化時にカクテルとグループマッピングをDBから取得
	React.useEffect(() => {
		const fetchData = async () => {
			setIsInitialLoading(true);
			try {
				const [cocktailsRes, ingredientsRes] = await Promise.all([
					fetch("/api/cocktails"),
					fetch("/api/ingredients"),
				]);
				const cocktailsData = (await cocktailsRes.json()) as {
					cocktails: Cocktail[];
				};
				const ingredientsData = (await ingredientsRes.json()) as {
					groupMapping: GroupMapping;
				};

				setAllCocktails(cocktailsData.cocktails);
				setGroupMapping(ingredientsData.groupMapping);
			} catch (error) {
				console.error("初期データの取得に失敗しました:", error);
			} finally {
				setIsInitialLoading(false);
			}
		};
		fetchData();
	}, []);

	// クリックハンドラー
	const handleMixClick = async (selectedGroups: string[]) => {
		console.log("Mixボタンがクリックされました！");

		// ローディング状態を開始
		setIsMixing(true);
		setShowResults(false);

		try {
			// 選択された材料を保存
			setLastSelectedIngredients(selectedGroups);

			// 材料に基づいてカクテルをフィルタリング（検索結果表示用）
			const filteredCocktails = await filterCocktailsByIngredients(
				allCocktails,
				selectedGroups,
				groupMapping,
			);

			// 検索結果を保存
			setSearchResults(filteredCocktails);

			// オリジナルカクテルを生成
			console.log("オリジナルカクテルを生成します。");
			const generatedCocktail = await generateOriginalCocktail(selectedGroups);

			// 少し遅延を入れてローディング感を演出
			// await new Promise((resolve) => setTimeout(resolve, 800));

			setSelectedCocktail(generatedCocktail);

			// 結果表示のアニメーションを開始
			setTimeout(() => {
				setShowResults(true);
			}, 100);
		} catch (error) {
			console.error("カクテル生成エラー:", error);
			// TODO: ユーザーにエラーを通知するUIを追加
		} finally {
			// ローディング状態を終了
			setIsMixing(false);
		}
	};

	// カクテル表示を閉じる関数
	const handleCloseCocktail = () => {
		setSelectedCocktail(null);
		setShowResults(false);
	};

	return (
		<>
			{/* 日替わりおすすめセクション */}
			{/* <DailyRecommendation cocktails={mockCocktails} /> */}

			{/* Mixセクション */}
			<MixSection
				onMixClick={handleMixClick}
				isMixing={isMixing}
				isInitialLoading={isInitialLoading}
			/>

			{/* カクテルが選択されている場合のみ表示 */}
			{selectedCocktail && (
				<CocktailDisplay
					cocktail={selectedCocktail}
					onRemove={handleCloseCocktail}
					show={showResults}
				/>
			)}

			{/* 検索結果の一覧表示（1件以上ある場合のみ表示） */}
			{searchResults.length > 0 && (
				<CocktailSearchResults
					cocktails={searchResults}
					selectedIngredients={lastSelectedIngredients}
					show={showResults}
					groupMapping={groupMapping}
				/>
			)}
		</>
	);
}
