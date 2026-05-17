"use client";

import type { Category, Ingredient } from "@/app/types/cocktail";
import { RotateCcw, SearchX } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import { Toast, type ToastSeverity } from "../ui/toast";
import CategoryNav from "./category-nav";
import IngredientCard from "./ingredient-card";
import IngredientSearch, {
	type IngredientSearchHandle,
} from "./ingredient-search";
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
	const deferredSearchQuery = React.useDeferredValue(searchQuery);
	const [activeCategory, setActiveCategory] = React.useState<string>(
		categories[0]?.name || "その他",
	);
	const searchRef = React.useRef<IngredientSearchHandle>(null);

	// Snackbar state
	const [snackbar, setSnackbar] = React.useState<{
		open: boolean;
		message: string;
		severity: ToastSeverity;
	}>({ open: false, message: "", severity: "info" });

	const handleCloseSnackbar = React.useCallback(
		() => setSnackbar((prev) => ({ ...prev, open: false })),
		[],
	);

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

	// Wrapper handlers to manage toast feedback
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

	const handleSelectCategory = React.useCallback((cat: string) => {
		setSearchQuery("");
		setActiveCategory(cat);
	}, []);

	// Filtering
	const filteredIngredients = React.useMemo(() => {
		let result = ingredients;
		if (deferredSearchQuery) {
			const q = deferredSearchQuery.toLowerCase();
			result = result.filter(
				(ing) =>
					ing.name.toLowerCase().includes(q) ||
					ing.actualNames?.some((n) => n.toLowerCase().includes(q)),
			);
		} else {
			result = result.filter((ing) => ing.categoryName === activeCategory);
		}
		// Sort by order (using spread to avoid in-place mutation of props)
		return [...result].sort(
			(a, b) => (a.sortOrder || 999) - (b.sortOrder || 999),
		);
	}, [ingredients, deferredSearchQuery, activeCategory]);

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
				activeCategory={deferredSearchQuery ? "" : activeCategory}
				onSelectCategory={handleSelectCategory}
			/>

			{/* Main Content */}
			<div className="flex-1 min-w-0">
				{/* Header Area */}
				<div className="mb-6">
					<IngredientSearch
						ref={searchRef}
						value={searchQuery}
						onChange={setSearchQuery}
					/>
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
						// ⚡ Bolt: Optimized lookup from O(M^2) to O(M) by iterating over actualDetails directly
						// グループ全体選択時は、詳細チップの個別表示はしない（カード全体の選択として見せる）
						let displayedDetailNames: string[] = [];

						if (!isGroupSelectedWhole && ingredient.actualDetails) {
							displayedDetailNames = ingredient.actualDetails
								.filter((d) => selectedIdsSet.has(d.id))
								.map((d) => d.name);
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
						<div className="col-span-full text-center py-12 text-stone-500 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
							<SearchX
								size={48}
								className="text-stone-300 mb-2"
								aria-hidden="true"
							/>
							<p>該当する材料が見つかりません</p>
							{deferredSearchQuery && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setSearchQuery("");
										searchRef.current?.focus();
									}}
									className="rounded-full gap-2"
								>
									<RotateCcw size={16} aria-hidden="true" />
									検索をクリア
								</Button>
							)}
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
