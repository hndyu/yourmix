"use client";

import type { Category, Ingredient } from "@/app/types/cocktail";
import * as React from "react";
import IngredientSelector from "./ingredient-selector";
import MixButton from "./mix-button";

interface MixSectionProps {
	onMixClick: () => void;
	ingredients: Ingredient[];
	categories: Category[];
	selectedIngredientIds: number[];
	selectedIngredientNames: string[];
	onIngredientsChange: (ids: number[], names: string[]) => void;
	isMixing?: boolean;
	isInitialLoading?: boolean;
}

/**
 * Optimized MixSection component.
 * Uses React.memo to prevent re-renders unless its props (stable handlers or data) change.
 */
const MixSection = React.memo(
	({
		onMixClick,
		ingredients,
		categories,
		selectedIngredientIds,
		selectedIngredientNames,
		onIngredientsChange,
		isMixing = false,
		isInitialLoading = false,
	}: MixSectionProps) => {
		const selectedCount = selectedIngredientNames.length;

		return (
			<section className="flex flex-col items-center justify-center w-full gap-8 py-8 animate-in fade-in duration-500">
				<div className="text-center space-y-2">
					<h2 className="text-2xl md:text-3xl font-display font-bold text-stone-800 dark:text-stone-200">
						あなただけのカクテルを
						<br className="md:hidden" />
						作ってみよう
					</h2>
					<p className="text-stone-600 dark:text-stone-400 text-sm">
						好みの材料を選んで、AIにオリジナルのレシピを作ってもらいましょう
					</p>
				</div>

				<div className="w-full">
					<IngredientSelector
						selectedIngredientIds={selectedIngredientIds}
						selectedIngredientNames={selectedIngredientNames}
						ingredients={ingredients}
						categories={categories}
						onIngredientsChange={onIngredientsChange}
						disabled={isMixing || isInitialLoading}
						isInitialLoading={isInitialLoading}
					/>
				</div>

				<div className="flex flex-col items-center gap-4 mt-8 sticky bottom-4 z-40">
					<div className="relative">
						{/* Backdrop for button when sticky? Maybe simpler to just elevate it. */}
						<div className="absolute inset-0 bg-background/80 blur-xl rounded-full -z-10" />
						<MixButton
							onClick={onMixClick}
							disabled={isInitialLoading || selectedCount === 0}
							isLoading={isMixing}
						/>
					</div>

					<p className="text-sm text-stone-600 dark:text-stone-400 text-center min-h-[1.5em] transition-opacity duration-300">
						{isInitialLoading
							? "材料を読み込んでいます..."
							: isMixing
								? "最高のレシピを考案中..."
								: selectedCount > 0
									? `${selectedCount}個の材料から生成します`
									: "材料を選んでください"}
					</p>
				</div>
			</section>
		);
	},
);

MixSection.displayName = "MixSection";

export default MixSection;
