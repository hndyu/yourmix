"use client";

import type { Category, Ingredient } from "@/app/types/cocktail";
import * as React from "react";
import { Toast, type ToastSeverity } from "../ui/toast";
import CategoryNav from "./category-nav";
import IngredientCard from "./ingredient-card";
import IngredientSearch from "./ingredient-search";

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
		categories[0]?.name || "ベース",
	);

	// Snackbar state (To be replaced with a custom toast later if needed, leveraging MUi for speed now)
	const [snackbar, setSnackbar] = React.useState<{
		open: boolean;
		message: string;
		severity: ToastSeverity;
	}>({ open: false, message: "", severity: "info" });

	const handleCloseSnackbar = () =>
		setSnackbar((prev) => ({ ...prev, open: false }));

	// Logic from original component for count
	const currentTotalCount = React.useMemo(() => {
		let count = 0;

		// 各材料グループごとに処理
		for (const ingredient of ingredients) {
			const detailNames = ingredient.actualNames || [];

			// グループとして選択されているか
			const isGroupSelected = selectedIngredientNames.includes(ingredient.name);

			// 個別材料として選択されているもの
			const selectedDetails = selectedIngredientNames.filter((n) =>
				detailNames.includes(n),
			);

			if (isGroupSelected) {
				// グループ全体が選択されている場合は1としてカウント
				count += 1;
			} else if (selectedDetails.length > 0) {
				// 個別材料が選択されている場合は、その数をカウント
				count += selectedDetails.length;
			}
		}

		return count;
	}, [selectedIngredientNames, ingredients]);

	// Toggle Logic
	const handleToggle = (ingredient: Ingredient, specificName?: string) => {
		if (disabled) return;

		const targetName = specificName || ingredient.name;
		const ingredientActualIds = ingredient.actualIds || [ingredient.id];

		// グループ名と個別材料名を分離
		// actualNamesには個別材料のみが含まれる（グループ名は含まれない場合もある）
		const detailNames = ingredient.actualNames || [];

		// 現在選択されている名前のうち、このグループに関連するもの
		const selectedGroupName = selectedIngredientNames.includes(ingredient.name)
			? ingredient.name
			: null;
		const selectedDetailNames = selectedIngredientNames.filter((n) =>
			detailNames.includes(n),
		);

		// Case 1: Group Toggle (specificName is undefined)
		if (!specificName) {
			// グループまたは個別材料のいずれかが選択されている場合、すべて解除
			if (selectedGroupName || selectedDetailNames.length > 0) {
				// グループ名と個別材料名の両方を除外
				const namesToRemove = [ingredient.name, ...detailNames];
				const newIds = selectedIngredientIds.filter(
					(id) => !ingredientActualIds.includes(id),
				);
				const newNames = selectedIngredientNames.filter(
					(n) => !namesToRemove.includes(n),
				);
				onIngredientsChange(newIds, newNames);
				return;
			}
			// グループ全体を選択
			if (currentTotalCount >= 5) {
				setSnackbar({
					open: true,
					message: "材料は5つまでです",
					severity: "warning",
				});
				return;
			}
			const newIds = Array.from(
				new Set([...selectedIngredientIds, ...ingredientActualIds]),
			);
			// グループ名のみを追加（個別材料名は追加しない）
			onIngredientsChange(newIds, [
				...selectedIngredientNames,
				ingredient.name,
			]);
			setSnackbar({
				open: true,
				message: `${ingredient.name}を追加しました`,
				severity: "success",
			});
			return;
		}

		// Case 2: Detail Toggle (個別材料の選択)
		const isTargetSelected = selectedIngredientNames.includes(targetName);

		if (isTargetSelected) {
			// 個別材料の選択を解除
			const targetId =
				ingredient.actualDetails?.find((d) => d.name === targetName)?.id ||
				ingredient.id;
			const newNames = selectedIngredientNames.filter((n) => n !== targetName);
			const newIds = selectedIngredientIds.filter((id) => id !== targetId);
			onIngredientsChange(newIds, newNames);
		} else {
			// 個別材料を選択
			// グループのみが選択されている場合は、グループ→個別材料への切り替え（カウント不変）
			const isGroupOnlySelected =
				selectedGroupName && selectedDetailNames.length === 0;

			let willIncrease = true;
			if (isGroupOnlySelected) {
				willIncrease = false; // グループ→個別材料の切り替え
			} else if (selectedDetailNames.length > 0) {
				willIncrease = true; // 既に個別材料が選択済み、追加
			}

			if (willIncrease && currentTotalCount >= 5) {
				setSnackbar({
					open: true,
					message: "材料は5つまでです",
					severity: "warning",
				});
				return;
			}

			// 個別材料を追加
			let newNames = selectedIngredientNames;
			let newIds = selectedIngredientIds;

			// グループが選択されていた場合、グループ名とIDを削除
			if (isGroupOnlySelected) {
				newNames = newNames.filter((n) => n !== ingredient.name);
				newIds = newIds.filter((id) => !ingredientActualIds.includes(id));
			}

			const targetId =
				ingredient.actualDetails?.find((d) => d.name === targetName)?.id ||
				ingredient.id;
			newNames = [...newNames, targetName];
			newIds = Array.from(new Set([...newIds, targetId]));
			onIngredientsChange(newIds, newNames);
			setSnackbar({
				open: true,
				message: `${targetName}を追加しました`,
				severity: "success",
			});
		}
	};

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

	// Auto-switch category if search is cleared? No, keep it simple.

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
						// グループ名と個別材料名を分離
						const detailNames = ingredient.actualNames || [];

						// グループ名と同じ名前の個別材料が存在するか
						const hasDetailWithGroupName = detailNames.includes(
							ingredient.name,
						);

						// 個別材料のうち選択されているもの
						const selectedDetailsInGroup = selectedIngredientNames.filter((n) =>
							detailNames.includes(n),
						);

						// グループが選択されているかの判定
						let isGroupSelectedWhole = false;
						let displayedDetailNames = selectedDetailsInGroup;

						if (hasDetailWithGroupName) {
							// グループ名と同じ個別材料がある場合
							// グループ名が選択されていても、グループ選択とは表示しない
							// 代わりに、selectedDetailNamesにグループ名を含めて個別材料として表示
							isGroupSelectedWhole = false;
							// グループ名と同じ材料も個別材料として表示
							displayedDetailNames = selectedDetailsInGroup;
						} else {
							// グループ名と同じ個別材料がない場合
							if (selectedIngredientNames.includes(ingredient.name)) {
								// 個別材料が選択されていなければグループ選択
								if (selectedDetailsInGroup.length === 0) {
									isGroupSelectedWhole = true;
									displayedDetailNames = [];
								} else {
									// 個別材料が選択されている場合はグループ表示しない
									isGroupSelectedWhole = false;
									displayedDetailNames = selectedDetailsInGroup;
								}
							}
						}

						return (
							<IngredientCard
								key={ingredient.id}
								ingredient={ingredient}
								isSelected={isGroupSelectedWhole}
								selectedDetailNames={displayedDetailNames}
								onToggle={() => handleToggle(ingredient)}
								onDetailToggle={(name) => handleToggle(ingredient, name)}
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
