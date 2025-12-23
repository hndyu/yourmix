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
		const selectedGroups = new Set<number>();
		for (const name of selectedIngredientNames) {
			const ing = ingredients.find(
				(i) => i.name === name || i.actualNames?.includes(name),
			);
			if (ing) selectedGroups.add(ing.id);
		}
		for (const groupId of selectedGroups) {
			const ingredient = ingredients.find((ing) => ing.id === groupId);
			if (!ingredient) continue;
			const details = ingredient.actualNames || [];
			// Count selected details specifically
			const selectedDetails = selectedIngredientNames.filter((n) =>
				details.includes(n),
			);
			if (selectedDetails.length > 0) {
				count += selectedDetails.length;
			} else if (selectedIngredientNames.includes(ingredient.name)) {
				// Group itself selected
				count += 1;
			}
		}
		return count;
	}, [selectedIngredientNames, ingredients]);

	// Toggle Logic
	const handleToggle = (ingredient: Ingredient, specificName?: string) => {
		if (disabled) return;

		const targetName = specificName || ingredient.name;
		const ingredientActualIds = ingredient.actualIds || [ingredient.id];
		const groupRelatedNames = [
			ingredient.name,
			...(ingredient.actualNames || []),
		];
		const currentSelectedGroupNames = selectedIngredientNames.filter((n) =>
			groupRelatedNames.includes(n),
		);

		// Case 1: Group Toggle (specificName is undefined)
		if (!specificName) {
			// If anything in group is selected, unselect all
			if (currentSelectedGroupNames.length > 0) {
				const newIds = selectedIngredientIds.filter(
					(id) => !ingredientActualIds.includes(id),
				);
				const newNames = selectedIngredientNames.filter(
					(n) => !groupRelatedNames.includes(n),
				);
				onIngredientsChange(newIds, newNames);
				return;
			}
			// Select group
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

		// Case 2: Detail Toggle
		const isTargetSelected = selectedIngredientNames.includes(targetName);

		if (isTargetSelected) {
			// Unselect detail
			const targetId =
				ingredient.actualDetails?.find((d) => d.name === targetName)?.id ||
				ingredient.id;
			const newNames = selectedIngredientNames.filter((n) => n !== targetName);
			const newIds = selectedIngredientIds.filter((id) => id !== targetId);
			onIngredientsChange(newIds, newNames);
		} else {
			// Select detail
			// Check limit
			// If group is selected (and no details), we are swapping group -> detail (count stays same), unless we are adding 2nd detail
			const details = ingredient.actualNames || [];
			const selectedDetails = selectedIngredientNames.filter((n) =>
				details.includes(n),
			);
			const isGroupOnlySelected =
				currentSelectedGroupNames.includes(ingredient.name) &&
				selectedDetails.length === 0;

			let willIncrease = true;
			if (isGroupOnlySelected)
				willIncrease = false; // 1 -> 1
			else if (selectedDetails.length > 0) willIncrease = true; // 1 -> 2

			if (willIncrease && currentTotalCount >= 5) {
				setSnackbar({
					open: true,
					message: "材料は5つまでです",
					severity: "warning",
				});
				return;
			}

			// Add detail
			// If group was selected, remove group name and IDs first
			let newNames = selectedIngredientNames;
			let newIds = selectedIngredientIds;

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
						const groupRelatedNames = [
							ingredient.name,
							...(ingredient.actualNames || []),
						];
						const selectedNamesInGroup = selectedIngredientNames.filter((n) =>
							groupRelatedNames.includes(n),
						);
						// Whole group selected if group name is in list AND all IDs are in list
						const isGroupSelectedWhole =
							selectedIngredientNames.includes(ingredient.name) &&
							(ingredient.actualIds?.every((id) =>
								selectedIngredientIds.includes(id),
							) ??
								false);

						return (
							<IngredientCard
								key={ingredient.id}
								ingredient={ingredient}
								isSelected={isGroupSelectedWhole}
								selectedDetailNames={selectedNamesInGroup.filter(
									(n) => n !== ingredient.name,
								)}
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
