"use client";

import { Box } from "@mui/material";
import * as React from "react";
import type { Category, Cocktail, Ingredient } from "../types/cocktail";
import {
	type GroupMapping,
	// filterCocktailsByIngredientsのインポートを修正
	filterCocktailsByIngredients,
} from "../utils/cocktail-filter";
import { generateOriginalCocktail } from "../utils/cocktail-generator";
import CocktailDisplay from "./cocktail-display";
import CocktailDisplaySkeleton from "./cocktail-display-skeleton";
import CocktailSearchResults from "./cocktail-search-results";
import DailyRecommendation from "./daily-recommendation";
import MixSection from "./mix-section";

export default function CocktailMixer() {
	// DBから取得したすべてのカクテル
	const [allCocktails, setAllCocktails] = React.useState<Cocktail[]>([]);
	const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
	const [categories, setCategories] = React.useState<Category[]>([]);

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

	// 表示アニメーションの状態管理を個別に変更
	const [showOriginalCocktail, setShowOriginalCocktail] = React.useState(false);
	const [showSearchResults, setShowSearchResults] = React.useState(false);

	// グループマッピングの状態管理
	const [groupMapping, setGroupMapping] = React.useState<GroupMapping>({});

	// Mix後の初回スクロールを管理する状態
	const [hasScrolledAfterMix, setHasScrolledAfterMix] = React.useState(false);

	// スクロール用の参照
	const resultsRef = React.useRef<HTMLDivElement>(null);

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
				// ingredients APIから全てのデータを取得
				const ingredientsData = (await ingredientsRes.json()) as {
					ingredients: Ingredient[];
					categories: Category[];
					groupMapping: GroupMapping;
				};

				setAllCocktails(cocktailsData.cocktails); // 既存のロジック
				setIngredients(ingredientsData.ingredients);
				setCategories(ingredientsData.categories);
				setGroupMapping(ingredientsData.groupMapping);
			} catch (error) {
				console.error("初期データの取得に失敗しました:", error);
			} finally {
				setIsInitialLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleMixClick = async (selectedGroups: string[]) => {
		// ローディング状態を開始
		setIsMixing(true);
		// 表示をリセット
		setShowOriginalCocktail(false);
		setShowSearchResults(false);
		setSelectedCocktail(null);
		setSearchResults([]);
		setHasScrolledAfterMix(false); // スクロール状態をリセット

		try {
			// 選択された表示名（selectedGroups）から、関連する全ての材料名（actualNames）を含むリストを作成
			const allSelectedNames: string[] = [];
			for (const groupName of selectedGroups) {
				const ingredient = ingredients.find((ing) => ing.name === groupName);
				// 表示名を追加
				allSelectedNames.push(groupName);
				// 関連する実際の材料名も追加
				if (ingredient?.actualNames) {
					allSelectedNames.push(...ingredient.actualNames);
				}
			}
			// 重複を除去して保存
			setLastSelectedIngredients(Array.from(new Set(allSelectedNames)));

			// 既存レシピの検索を非同期で実行
			const searchPromise = filterCocktailsByIngredients(
				allCocktails,
				selectedGroups,
				groupMapping,
			).then((filteredCocktails) => {
				console.log("レシピ検索が完了しました。");
				setSearchResults(filteredCocktails);
				if (filteredCocktails.length > 0) {
					setShowSearchResults(true);
				}
			});

			// オリジナルカクテルの生成を非同期で実行
			const generatePromise = generateOriginalCocktail(selectedGroups).then(
				(generatedCocktail) => {
					console.log("オリジナルカクテルの生成が完了しました。");
					setSelectedCocktail(generatedCocktail);
					if (generatedCocktail) {
						setShowOriginalCocktail(true);
					}
				},
			);

			// 両方の処理が完了したらローディングを終了
			await Promise.all([searchPromise, generatePromise]);
		} catch (error) {
			console.error("カクテル生成エラー:", error);
			// TODO: ユーザーにエラーを通知するUIを追加
		} finally {
			setIsMixing(false);
		}
	};

	// カクテル表示を閉じる関数
	const handleCloseCocktail = () => {
		setSelectedCocktail(null);
		setShowOriginalCocktail(false);
	};

	// 結果が表示されたときにスクロールを実行する
	React.useEffect(() => {
		// 何かしらの結果が表示され、まだスクロールしていない場合に一度だけ実行
		if ((showOriginalCocktail || showSearchResults) && !hasScrolledAfterMix) {
			resultsRef.current?.scrollIntoView({
				behavior: "smooth",
			});
			setHasScrolledAfterMix(true); // スクロール済みフラグを立てる
		}
	}, [showOriginalCocktail, showSearchResults, hasScrolledAfterMix]);

	return (
		<>
			{/* 日替わりおすすめセクション */}
			{/* <DailyRecommendation cocktails={allCocktails} /> */}

			{/* Mixセクション */}
			<MixSection
				onMixClick={handleMixClick}
				ingredients={ingredients}
				categories={categories}
				isMixing={isMixing}
				isInitialLoading={isInitialLoading}
			/>

			{/* 結果表示エリア */}
			<Box ref={resultsRef} sx={{ width: "100%" }}>
				{/* オリジナルカクテル生成中のスケルトン表示 */}
				{isMixing && <CocktailDisplaySkeleton />}

				{/* カクテルが選択されている場合のみ表示 */}
				{!isMixing && selectedCocktail && (
					<CocktailDisplay
						cocktail={selectedCocktail}
						onRemove={handleCloseCocktail}
						show={showOriginalCocktail}
					/>
				)}

				{/* 検索結果の一覧表示（1件以上ある場合のみ表示） */}
				{searchResults.length > 0 && (
					<CocktailSearchResults
						cocktails={searchResults}
						selectedIngredients={lastSelectedIngredients}
						show={showSearchResults}
						groupMapping={groupMapping}
						categories={categories}
						allIngredients={ingredients}
					/>
				)}
			</Box>
		</>
	);
}
