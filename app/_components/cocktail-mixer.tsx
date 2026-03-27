"use client";

import * as React from "react";
import type { Category, Ingredient } from "../types/cocktail";
import { useAICocktailGenerator } from "../utils/useAICocktailGenerator";
import { useCocktails } from "../utils/useCocktails";
import CocktailDialog from "./cocktail-dialog";
import CocktailSearchResults from "./cocktail-search-results";
import CompletionBar from "./completion-bar";
import MixSection from "./mix-section";

type CocktailMixerProps = {
	initialIngredients?: Ingredient[];
	initialCategories?: Category[];
};

export default function CocktailMixer({
	initialIngredients = [],
	initialCategories = [],
}: CocktailMixerProps) {
	// --- Hooks ---
	// 材料とカテゴリのマスターデータ
	const ingredients = initialIngredients;
	const categories = initialCategories;

	// 選択された材料の状態
	const [selectedIngredientIds, setSelectedIngredientIds] = React.useState<
		number[]
	>([]);
	const [selectedIngredientNames, setSelectedIngredientNames] = React.useState<
		string[]
	>([]);
	// 検索実行時の材料（検索結果の強調表示に使用）
	const [lastSearchedIngredientNames, setLastSearchedIngredientNames] =
		React.useState<string[]>([]);

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

	// 全体のローディング状態（Mixボタンの無効化に使用）
	const isMixing = isSearching || isGenerating;

	// 表示アニメーションとスクロールの状態
	const [showSearchResults, setShowSearchResults] = React.useState(false);
	const [hasScrolledAfterMix, setHasScrolledAfterMix] = React.useState(false);
	const resultsRef = React.useRef<HTMLDivElement>(null);

	// 通知バーとモーダルダイアログの状態
	const [showCompletionBar, setShowCompletionBar] = React.useState(false);
	const [dialogOpen, setDialogOpen] = React.useState(false);

	// Mixボタンクリック時の処理
	const handleMixClick = async () => {
		if (selectedIngredientIds.length === 0) return;

		// 表示をリセット
		setShowSearchResults(false);
		setShowCompletionBar(false);
		setDialogOpen(false);
		clearGeneratedCocktail();
		searchCocktails([]); // 既存の検索結果をクリア
		setHasScrolledAfterMix(false);

		// 現在選択されている材料を検索実行時の材料として保存
		setLastSearchedIngredientNames([...selectedIngredientNames]);

		// 検索と生成を並行して実行
		// 検索は高速で完了し、生成はバックグラウンドで継続
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

	// 選択をすべてクリア
	const handleReset = () => {
		setSelectedIngredientIds([]);
		setSelectedIngredientNames([]);
		setShowSearchResults(false);
	};

	// 検索結果が表示されたら即座にスクロール
	React.useEffect(() => {
		if (lastSearchedIngredientNames.length > 0) setShowSearchResults(true);

		if (searchResults.length > 0 && !hasScrolledAfterMix) {
			resultsRef.current?.scrollIntoView({ behavior: "smooth" });
			setHasScrolledAfterMix(true);
		}
	}, [searchResults, hasScrolledAfterMix]);

	// AI 生成完了時に通知バーを表示
	React.useEffect(() => {
		if (generatedCocktail) {
			setShowCompletionBar(true);
		}
	}, [generatedCocktail]);

	// AI 生成中に通知バーを表示（実況メッセージ用）
	React.useEffect(() => {
		if (isGenerating) {
			setShowCompletionBar(true);
		}
	}, [isGenerating]);

	return (
		<>
			<MixSection
				onMixClick={handleMixClick}
				ingredients={ingredients}
				categories={categories}
				selectedIngredientIds={selectedIngredientIds}
				selectedIngredientNames={selectedIngredientNames}
				onIngredientsChange={handleIngredientsChange}
				isMixing={isMixing}
				showCompletionBar={showCompletionBar}
			/>

			{/* 検索結果エリア（通知バーの高さ分の余白を追加） */}
			<div
				ref={resultsRef}
				className={`w-full ${showCompletionBar ? "pb-20" : ""}`}
			>
				{(showSearchResults || searchResults.length > 0) && (
					<CocktailSearchResults
						cocktails={searchResults}
						selectedIngredients={lastSearchedIngredientNames}
						show={showSearchResults}
						allIngredients={ingredients}
						categories={categories}
						onReset={handleReset}
					/>
				)}
			</div>

			{/* 画面下部の固定バー（AI 生成中の実況メッセージ / 完成通知） */}
			{showCompletionBar && (
				<CompletionBar
					isGenerating={isGenerating}
					onViewClick={() => setDialogOpen(true)}
				/>
			)}

			{/* AI 生成カクテルのモーダルダイアログ */}
			<CocktailDialog
				cocktail={generatedCocktail}
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
			/>
		</>
	);
}
