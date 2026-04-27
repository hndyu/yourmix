"use client";

import { Martini, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import type { Category, Cocktail, Ingredient } from "../types/cocktail";
import { useCocktailSearch } from "../utils/useCocktailSearch";
import { NoResults } from "./no-results";
import { Button } from "./ui/button";

interface CocktailSearchResultsProps {
	cocktails: Cocktail[];
	selectedIngredients: string[];
	show?: boolean;
	categories: Category[];
	allIngredients: Ingredient[];
	onReset?: () => void;
}

// ⚡ Bolt: Memoize CocktailSearchResults to prevent redundant re-renders
// This is especially beneficial when selecting ingredients in the parent component (CocktailMixer),
// as it avoids re-calculating and re-rendering the entire search results list on every checkbox toggle.
const CocktailSearchResults = React.memo(function CocktailSearchResults({
	cocktails,
	selectedIngredients,
	categories,
	show = true,
	allIngredients,
	onReset,
}: CocktailSearchResultsProps) {
	const { sortedCocktails, isIngredientSelected } = useCocktailSearch(
		cocktails,
		selectedIngredients,
		categories,
		allIngredients,
	);

	if (cocktails.length === 0) {
		return <NoResults show={show} onReset={onReset} />;
	}

	if (!show) return null;

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
			<div className="text-center mb-12">
				<h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
					<span aria-hidden="true">🔍</span> 検索結果 ({cocktails.length}件)
				</h2>

				<p className="text-stone-600 dark:text-stone-400 mb-6">
					選択された材料にマッチするレシピを表示しています
				</p>

				{onReset && (
					<Button
						variant="outline"
						size="sm"
						onClick={onReset}
						aria-label="選択をすべてクリア"
						className="gap-2"
					>
						<RotateCcw size={16} aria-hidden="true" />
						選択をすべてクリア
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sortedCocktails.map((cocktail) => (
					<Link
						key={cocktail.id}
						href={`/recipes/${cocktail.slug}`}
						className="group block relative bg-card border border-border rounded-3xl overflow-hidden hover:border-stone-400 dark:hover:border-stone-600 hover:bg-white dark:hover:bg-stone-900/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-stone-200/50 dark:shadow-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 dark:focus-visible:ring-offset-stone-950"
					>
						{/* Image Area */}

						<div className="relative w-full aspect-[4/3] bg-stone-100/50 dark:bg-stone-950/50 flex items-center justify-center overflow-hidden">
							{cocktail.imageUrl ? (
								<Image
									src={`/cocktails/${cocktail.imageUrl}`}
									alt=""
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
								/>
							) : (
								<Martini
									size={64}
									className="text-stone-300 dark:text-stone-800"
									aria-hidden="true"
								/>
							)}

							{/* Gradient Overlay */}

							<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
						</div>

						{/* Content */}

						<div className="p-6 relative">
							<h3 className="text-xl font-bold text-foreground mb-2 font-display group-hover:text-primary transition-colors">
								{cocktail.name}
							</h3>

							<p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mb-4">
								{cocktail.description}
							</p>

							{/* Badges */}

							<div className="flex flex-wrap gap-1.5">
								{cocktail.ingredients.slice(0, 5).map((ing) => {
									const isSelected = isIngredientSelected(ing.name);

									return (
										<span
											key={ing.name}
											className={`

	                        text-sm px-2 py-1 rounded-full border

	                        ${
														isSelected
															? "bg-primary/20 border-primary/30 text-primary"
															: "bg-background border-border text-stone-600 dark:text-stone-400"
													}

	                      `}
										>
											{ing.name}
										</span>
									);
								})}

								{cocktail.ingredients.length > 5 && (
									<span className="text-sm px-2 py-1 rounded-full bg-background border border-border text-stone-600 dark:text-stone-400">
										+{cocktail.ingredients.length - 5}
									</span>
								)}
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
});

export default CocktailSearchResults;
