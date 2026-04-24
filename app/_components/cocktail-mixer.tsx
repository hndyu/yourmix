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
	// 最新の検索リクエストのみを有効にするためのトークン
	const searchRequestIdRef = React.useRef(0);
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
		// 検索完了前に空状態が出ないよう、完了時に表示する
		const currentSearchRequestId = ++searchRequestIdRef.current;

		// 現在選択されている材料を検索実行時の材料として保存
		setLastSearchedIngredientNames([...selectedIngredientNames]);

		// 検索と生成を並行して実行
		// 検索は高速で完了し、生成はバックグラウンドで継続
		// テストでモックが非Promiseを返しても壊れないように包む
		const searchPromise = Promise.resolve(
			searchCocktails(selectedIngredientIds),
		);
		const generatePromise = Promise.resolve(
			generateCocktail(selectedIngredientNames),
		);

		searchPromise.finally(() => {
			// 直近の検索以外は無視（リセットや再検索での表示ちらつきを防止）
			if (searchRequestIdRef.current !== currentSearchRequestId) return;
			setShowSearchResults(true);
		});

		await Promise.all([searchPromise, generatePromise]);
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
		// 進行中の検索を無効化して空状態の誤表示を防止
		searchRequestIdRef.current += 1;
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// 検索結果が表示されたら即座にスクロール
	React.useEffect(() => {
		if (showSearchResults && !hasScrolledAfterMix) {
			resultsRef.current?.scrollIntoView({ behavior: "smooth" });
			setHasScrolledAfterMix(true);
		}
	}, [showSearchResults, hasScrolledAfterMix]);

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
				className={`w-full scroll-mt-24 ${showCompletionBar ? "pb-20" : ""}`}
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
