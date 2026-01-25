"use client";

import type { Category, Ingredient } from "@/app/types/cocktail";
import * as React from "react";
import { Toast, type ToastSeverity } from "../ui/toast";
import CategoryNav from "./category-nav";
import IngredientCard from "./ingredient-card";
import IngredientSearch from "./ingredient-search";
import { useIngredientSelection } from "./use-ingredient-selection";

interface IngredientSelectorProps {
	selectedIngredientIds: number[];
	selectedIngredientNames: string[];
	ingredients: Ingredient[];
	categories: Category[];
	onIngredientsChange: (ids: number[], names: string[]) => void;
	disabled?: boolean;
	isInitialLoading?: boolean;
}

export default function IngredientSelector({
	selectedIngredientIds,
	selectedIngredientNames,
	ingredients,
	categories,
	onIngredientsChange,
	disabled = false,
	isInitialLoading = false,
}: IngredientSelectorProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [activeCategory, setActiveCategory] = React.useState<string>(
		categories[0]?.name || "その他",
	);

	// Snackbar state
	const [snackbar, setSnackbar] = React.useState<{
		open: boolean;
		message: string;
		severity: ToastSeverity;
	}>({ open: false, message: "", severity: "info" });

	const handleCloseSnackbar = () =>
		setSnackbar((prev) => ({ ...prev, open: false }));

	// Use custom hook for logic
	const { toggleGroup, toggleDetail } = useIngredientSelection({
		allIngredients: ingredients,
		selectedIngredientIds,
		selectedIngredientNames,
		onIngredientsChange,
	});

	// Optimize lookups in the render loop
	const selectedIdsSet = React.useMemo(
		() => new Set(selectedIngredientIds),
		[selectedIngredientIds],
	);

	// ⚡ Bolt: Stable callbacks to prevent IngredientCard re-renders
	const handleGroupToggle = React.useCallback(
		(ingredient: Ingredient) => {
			if (disabled) return;
			const result = toggleGroup(ingredient);
			if (!result.success && result.reason === "LIMIT_REACHED") {
				setSnackbar({
					open: true,
					message: "材料は5つまでです",
					severity: "warning",
				});
			} else if (result.success && result.message) {
				setSnackbar({
					open: true,
					message: result.message,
					severity: "success",
				});
			}
		},
		[disabled, toggleGroup],
	);

	const handleDetailToggle = React.useCallback(
		(ingredient: Ingredient, detailName: string) => {
			if (disabled) return;
			const result = toggleDetail(ingredient, detailName);
			if (!result.success && result.reason === "LIMIT_REACHED") {
				setSnackbar({
					open: true,
					message: "材料は5つまでです",
					severity: "warning",
				});
			} else if (result.success && result.message) {
				setSnackbar({
					open: true,
					message: result.message,
					severity: "success",
				});
			}
		},
		[disabled, toggleDetail],
	);

	// Filtering
	const filteredIngredients = React.useMemo(() => {
		let result = ingredients;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(ing) =>
					ing.name.toLowerCase().includes(q) ||
					ing.actualNames?.some((n) => n.toLowerCase().includes(q)),
			);
		} else {
			result = result.filter((ing) => ing.categoryName === activeCategory);
		}
		// Sort by order
		return result.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
	}, [ingredients, searchQuery, activeCategory]);

	if (isInitialLoading) {
		return (
			<div className="text-center p-10 text-stone-500">
				Loading ingredients...
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-8 mt-6">
			{/* Sidebar / Category Nav */}
			<CategoryNav
				categories={categories}
				activeCategory={searchQuery ? "" : activeCategory}
				onSelectCategory={(cat) => {
					setSearchQuery("");
					setActiveCategory(cat);
				}}
			/>

			{/* Main Content */}
			<div className="flex-1 min-w-0">
				{/* Header Area */}
				<div className="mb-6">
					<IngredientSearch value={searchQuery} onChange={setSearchQuery} />
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredIngredients.map((ingredient) => {
						const groupIds = ingredient.actualIds || [ingredient.id];
						const detailNames = ingredient.actualNames || [];

						// 1. グループ全体が選択されているか判定 (全てのIDが含まれているか)
						// 注意: IDがない場合(空配列)はfalseとする
						const isGroupSelectedWhole =
							groupIds.length > 0 &&
							groupIds.every((id) => selectedIdsSet.has(id));

						// 2. 個別に選択されている詳細名を特定 (IDベースで判定)
						// グループ全体選択時は、詳細チップの個別表示はしない（カード全体の選択として見せる）
						let displayedDetailNames: string[] = [];

						if (!isGroupSelectedWhole) {
							displayedDetailNames = detailNames.filter((name) => {
								// 名前からIDを解決
								const detail = ingredient.actualDetails?.find(
									(d) => d.name === name,
								);
								const detailId = detail ? detail.id : -1;
								// IDが含まれている、または（互換性のため）名前が含まれている場合
								// 基本的にIDで判定するが、データ不整合に備えて名前もチェックするのはありだが、
								// 今回はロジック整理のためID優先。
								return detailId !== -1 && selectedIdsSet.has(detailId);
							});
						}

						return (
							<IngredientCard
								key={ingredient.id}
								ingredient={ingredient}
								isSelected={isGroupSelectedWhole}
								selectedDetailNames={displayedDetailNames}
								onToggle={handleGroupToggle}
								onDetailToggle={handleDetailToggle}
								disabled={disabled}
							/>
						);
					})}
					{filteredIngredients.length === 0 && (
						<div className="col-span-full text-center py-12 text-stone-500">
							該当する材料が見つかりません
						</div>
					)}
				</div>
			</div>

			<Toast
				open={snackbar.open}
				message={snackbar.message}
				severity={snackbar.severity}
				onClose={handleCloseSnackbar}
				autoHideDuration={2000}
			/>
		</div>
	);
}
