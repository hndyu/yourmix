"use client";

import type { Ingredient } from "@/app/types/cocktail";
import { resolveAsset } from "@/app/utils/asset-resolver";
import { CheckCircle, ChevronDown } from "lucide-react";
import Image from "next/image";
import * as React from "react";

interface IngredientCardProps {
	ingredient: Ingredient;
	isSelected: boolean;
	selectedDetailNames: string[];
	onToggle: (ingredient: Ingredient) => void;
	onDetailToggle: (ingredient: Ingredient, name: string) => void;
	disabled?: boolean;
}

const IngredientCard = React.memo(
	function IngredientCard({
		ingredient,
		isSelected,
		selectedDetailNames,
		onToggle,
		onDetailToggle,
		disabled,
	}: IngredientCardProps) {
		const [expanded, setExpanded] = React.useState(false);
		const hasDetails =
			ingredient.actualNames && ingredient.actualNames.length > 0;

		// Determine visual state
		const isPartiallySelected = !isSelected && selectedDetailNames.length > 0;
		const activeState = isSelected || isPartiallySelected;

		const asset = resolveAsset(ingredient.assetKey);

		return (
			<div
				className={`
      relative group flex flex-col rounded-2xl border transition-all duration-300
      ${
				activeState
					? "bg-white dark:bg-stone-900 border-primary/50 shadow-lg shadow-primary/10"
					: "bg-white/40 dark:bg-stone-900/40 border-stone-300 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700 hover:bg-white/80 dark:hover:bg-stone-900/80"
			}
      ${disabled ? "opacity-50 pointer-events-none" : ""}
    `}
			>
				{/* Main Card Area - Converted to Button for A11y */}
				<button
					type="button"
					aria-pressed={isSelected}
					aria-label={`${ingredient.name} を${isSelected ? "解除" : "選択"}`}
					className={`flex flex-col p-4 flex-grow text-left w-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform active:scale-[0.98] ${
						hasDetails ? "rounded-t-2xl" : "rounded-2xl"
					}`}
					onClick={(e) => {
						// Prevent toggle if clicking expand button (though expand button is outside this container now? No, below)
						// Actually, the structure below had the expand button separate.
						onToggle(ingredient);
					}}
				>
					{/* Selection Indicator */}
					<div className="absolute top-3 right-3">
						<div
							className={`
            w-6 h-6 rounded-full flex items-center justify-center transition-all
            ${
							isSelected
								? "bg-primary text-black scale-100"
								: isPartiallySelected
									? "bg-stone-200 dark:bg-stone-700 text-primary scale-100 ring-1 ring-primary/20"
									: "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 scale-100 opacity-40"
						}
          `}
						>
							<CheckCircle size={16} aria-hidden="true" />
						</div>
					</div>

					{/* Icon / Image Placeholder */}
					<div
						className={`
          w-full h-auto rounded-2xl mb-4 flex items-center justify-center transition-colors overflow-hidden
          ${activeState ? "bg-primary/20 text-primary" : "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300"}
        `}
					>
						{asset.type === "image" ? (
							<Image
								src={asset.value}
								alt=""
								width={48}
								height={48}
								className="w-full h-full object-contain"
							/>
						) : (
							<asset.value size={24} />
						)}
					</div>

					{/* Title */}
					<h4
						className={`font-bold text-lg mb-1 leading-tight ${activeState ? "text-foreground" : "text-stone-800 dark:text-stone-200"}`}
					>
						{ingredient.name}
					</h4>
					{ingredient.description && (
						<p className="text-xs text-stone-600 dark:text-stone-500 min-h-[2.5em]">
							{ingredient.description}
						</p>
					)}
				</button>

				{/* Details Section (Accordion style within card or bottom sheet) */}
				{hasDetails && (
					<div className="border-t border-stone-200 dark:border-stone-800/50">
						<button
							type="button"
							aria-expanded={expanded}
							aria-label={`${ingredient.name}の銘柄・詳細を${expanded ? "閉じる" : "表示"}`}
							className="expand-btn w-full px-4 py-2 flex items-center justify-between text-xs text-stone-600 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-all focus:outline-none focus:bg-stone-100 dark:focus:bg-stone-800/50 active:bg-stone-100 dark:active:bg-stone-800 active:scale-[0.98] rounded-b-2xl"
							onClick={(e) => {
								e.stopPropagation();
								setExpanded(!expanded);
							}}
						>
							<span>
								銘柄・詳細 ({ingredient.actualNames?.length})
								{selectedDetailNames.length > 0 && (
									<span className="ml-2 text-primary">
										{selectedDetailNames.length} 選択中
									</span>
								)}
							</span>
							<ChevronDown
								className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
								size={16}
								aria-hidden="true"
							/>
						</button>

						{/* Expanded Details */}
						{expanded && (
							<div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200 bg-stone-50 dark:bg-stone-900/40 rounded-b-2xl">
								{ingredient.actualNames?.map((name) => {
									const isDetailSelected = selectedDetailNames.includes(name);
									return (
										<button
											key={name}
											type="button"
											aria-pressed={isDetailSelected}
											aria-label={`${name}を${isDetailSelected ? "解除" : "選択"}`}
											onClick={(e) => {
												e.stopPropagation();
												onDetailToggle(ingredient, name);
											}}
											className={`
                      px-2 py-1 text-xs rounded-md border transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                      ${
												isDetailSelected
													? "bg-primary/20 border-primary text-foreground"
													: "bg-white dark:bg-stone-950 border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600"
											}
                    `}
										>
											{name}
										</button>
									);
								})}
							</div>
						)}
					</div>
				)}
			</div>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison to handle array reference changes from the parent loop
		return (
			prevProps.ingredient === nextProps.ingredient &&
			prevProps.isSelected === nextProps.isSelected &&
			prevProps.disabled === nextProps.disabled &&
			prevProps.onToggle === nextProps.onToggle &&
			prevProps.onDetailToggle === nextProps.onDetailToggle &&
			prevProps.selectedDetailNames.length ===
				nextProps.selectedDetailNames.length &&
			prevProps.selectedDetailNames.every(
				(v, i) => v === nextProps.selectedDetailNames[i],
			)
		);
	},
);

export default IngredientCard;
