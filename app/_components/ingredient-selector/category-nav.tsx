"use client";

import type { Category } from "@/app/types/cocktail";
import { DefaultIcon, iconMap } from "@/app/utils/icon-map";
import * as React from "react";

interface CategoryNavProps {
	categories: Category[];
	activeCategory: string;
	onSelectCategory: (categoryName: string) => void;
}

export default function CategoryNav({
	categories,
	activeCategory,
	onSelectCategory,
}: CategoryNavProps) {
	return (
		<nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:w-64 md:flex-shrink-0 sticky top-20 z-10 bg-background/90 backdrop-blur md:bg-transparent">
			<h3 className="hidden md:block text-stone-600 dark:text-stone-500 text-sm font-bold uppercase tracking-wider mb-2 px-3">
				カテゴリー
			</h3>
			{categories.map((category) => {
				const isActive = activeCategory === category.name;
				const Icon = (category.icon && iconMap[category.icon]) || DefaultIcon;

				return (
					<button
						key={category.id}
						type="button"
						onClick={() => onSelectCategory(category.name)}
						className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium whitespace-nowrap
              ${
								isActive
									? "bg-stone-200 dark:bg-stone-800 text-blue-600 dark:text-primary shadow-lg shadow-black/10 dark:shadow-black/20"
									: "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900"
							}
            `}
					>
						<span
							className={`p-1 rounded-full ${isActive ? "bg-primary/10" : "bg-stone-200 dark:bg-stone-800"}`}
						>
							<Icon sx={{ fontSize: 20 }} />
						</span>
						{category.name}
					</button>
				);
			})}
		</nav>
	);
}
