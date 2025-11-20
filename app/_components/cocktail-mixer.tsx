"use client";

import { Box } from "@mui/material";
import * as React from "react";
import type { Category, Ingredient } from "../types/cocktail";
import { useAICocktailGenerator } from "../utils/useAICocktailGenerator";
import { useCocktails } from "../utils/useCocktails";
import CocktailDisplay from "./cocktail-display";
import CocktailDisplaySkeleton from "./cocktail-display-skeleton";
import CocktailSearchResults from "./cocktail-search-results";
import MixSection from "./mix-section";

export default function CocktailMixer() {
	// --- Hooks ---
	// 材料とカテゴリのマスターデータ
	const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
	const [categories, setCategories] = React.useState<Category[]>([]);

	// 選択された材料の状態
	const [selectedIngredientIds, setSelectedIngredientIds] = React.useState<
		number[]
	>([]);
	const [selectedIngredientNames, setSelectedIngredientNames] = React.useState<
		string[]
	>([]);

	// カスタムフックによる状態管理
	const {
		cocktails: searchResults,
		isLoading: isSearching,
		searchCocktails,
	} = useCocktails();
	const {
		generatedCocktail,
		isGenerating,
		generateCocktail,
		clearGeneratedCocktail,
	} = useAICocktailGenerator();

	// 全体のローディング状態
	const [isInitialLoading, setIsInitialLoading] = React.useState(true);
	const isMixing = isSearching || isGenerating;

	// 表示アニメーションとスクロールの状態
	const [showOriginalCocktail, setShowOriginalCocktail] = React.useState(false);
	const [showSearchResults, setShowSearchResults] = React.useState(false);
	const [hasScrolledAfterMix, setHasScrolledAfterMix] = React.useState(false);
	const resultsRef = React.useRef<HTMLDivElement>(null);

	// --- Effects ---
	// 初期化時に材料関連のマスターデータを取得
	React.useEffect(() => {
		const fetchMasterData = async () => {
			setIsInitialLoading(true);
			try {
				const res = await fetch("/api/ingredients");
				const data = (await res.json()) as {
					ingredients: Ingredient[];
					categories: Category[];
				};
				setIngredients(data.ingredients);
				setCategories(data.categories);
			} catch (error) {
				console.error("材料マスターの取得に失敗しました:", error);
			} finally {
				setIsInitialLoading(false);
			}
		};
		fetchMasterData();
	}, []);

	// Mixボタンクリック時の処理
	const handleMixClick = async () => {
		// 表示をリセット
		setShowOriginalCocktail(false);
		setShowSearchResults(false);
		clearGeneratedCocktail();
		searchCocktails([]); // 既存の検索結果をクリア
		setHasScrolledAfterMix(false);

		// 検索と生成を並行して実行
		await Promise.all([
			searchCocktails(selectedIngredientIds),
			generateCocktail(selectedIngredientNames),
		]);
	};

	// 材料選択の変更をハンドル
	const handleIngredientsChange = (ids: number[], names: string[]) => {
		setSelectedIngredientIds(ids);
		setSelectedIngredientNames(names);
	};

	// カクテル表示を閉じる
	const handleCloseCocktail = () => {
		clearGeneratedCocktail();
		setShowOriginalCocktail(false);
	};

	// 結果が表示されたらスクロール
	React.useEffect(() => {
		if (generatedCocktail) setShowOriginalCocktail(true);
		if (searchResults.length > 0) setShowSearchResults(true);

		if (
			(generatedCocktail || searchResults.length > 0) &&
			!hasScrolledAfterMix
		) {
			resultsRef.current?.scrollIntoView({ behavior: "smooth" });
			setHasScrolledAfterMix(true);
		}
	}, [generatedCocktail, searchResults, hasScrolledAfterMix]);

	return (
		<>
			<MixSection
				onMixClick={handleMixClick}
				ingredients={ingredients}
				categories={categories}
				selectedIngredientIds={selectedIngredientIds}
				onIngredientsChange={handleIngredientsChange}
				isMixing={isMixing}
				isInitialLoading={isInitialLoading}
			/>

			<Box ref={resultsRef} sx={{ width: "100%" }}>
				{isMixing && <CocktailDisplaySkeleton />}

				{!isMixing && generatedCocktail && (
					<CocktailDisplay
						cocktail={generatedCocktail}
						onRemove={handleCloseCocktail}
						show={showOriginalCocktail}
					/>
				)}

				{searchResults.length > 0 && (
					<CocktailSearchResults
						cocktails={searchResults}
						selectedIngredients={selectedIngredientNames}
						show={showSearchResults}
						allIngredients={ingredients}
						categories={categories}
					/>
				)}
			</Box>
		</>
	);
}
