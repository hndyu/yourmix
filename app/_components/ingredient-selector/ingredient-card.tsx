"use client";

import type { Ingredient } from "@/app/types/cocktail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import * as React from "react";

interface IngredientCardProps {
	ingredient: Ingredient;
	isSelected: boolean;
	selectedDetailNames: string[];
	onToggle: () => void;
	onDetailToggle: (name: string) => void;
	disabled?: boolean;
}

export default function IngredientCard({
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
				className="flex flex-col p-4 flex-grow text-left w-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-t-2xl"
				onClick={(e) => {
					// Prevent toggle if clicking expand button (though expand button is outside this container now? No, below)
					// Actually, the structure below had the expand button separate.
					onToggle();
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
									? "bg-stone-300 dark:bg-stone-700 text-primary scale-100"
									: "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"
						}
          `}
					>
						<CheckCircleIcon sx={{ fontSize: 16 }} />
					</div>
				</div>

				{/* Icon / Image Placeholder */}
				<div
					className={`
          w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-colors
          ${activeState ? "bg-primary/20 text-primary" : "bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300"}
        `}
				>
					<LocalBarIcon />
				</div>

				{/* Title */}
				<h4
					className={`font-bold text-lg mb-1 leading-tight ${activeState ? "text-foreground" : "text-stone-800 dark:text-stone-200"}`}
				>
					{ingredient.name}
				</h4>
				{ingredient.description && (
					<p className="text-xs text-stone-500 dark:text-stone-500 line-clamp-2 min-h-[2.5em]">
						{ingredient.description}
					</p>
				)}
			</button>

			{/* Details Section (Accordion style within card or bottom sheet) */}
			{hasDetails && (
				<div className="border-t border-stone-200 dark:border-stone-800/50">
					<button
						type="button"
						className="expand-btn w-full px-4 py-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors focus:outline-none focus:bg-stone-100 dark:focus:bg-stone-800/50 rounded-b-2xl"
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
						<ExpandMoreIcon
							className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
							sx={{ fontSize: 16 }}
						/>
					</button>

					{/* Expanded Details */}
					{expanded && (
						<div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200 bg-stone-100 dark:bg-stone-900/40 rounded-b-2xl">
							{ingredient.actualNames?.map((name) => {
								const isDetailSelected = selectedDetailNames.includes(name);
								return (
									<button
										key={name}
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											onDetailToggle(name);
										}}
										className={`
                      px-2 py-1 text-xs rounded-md border transition-all
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
}
