"use client";

import type { Category } from "@/app/types/cocktail";
import { resolveAsset } from "@/app/utils/asset-resolver";
import Image from "next/image";
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
		<div className="sticky top-20 z-10 md:w-64 md:flex-shrink-0 bg-background/90 backdrop-blur md:bg-transparent md:backdrop-blur-none">
			<div className="relative">
				<nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
					<h3 className="hidden md:block text-stone-500 dark:text-stone-500 text-sm font-bold uppercase tracking-wider mb-2 px-3">
						カテゴリー
					</h3>
					{categories.map((category) => {
						const isActive = activeCategory === category.name;
						const asset = resolveAsset(category.assetKey);

						return (
							<button
								key={category.id}
								type="button"
								onClick={() => onSelectCategory(category.name)}
								className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium whitespace-nowrap
              ${
								isActive
									? "bg-white dark:bg-stone-800 text-primary shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-stone-200 dark:ring-0"
									: "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-white/60 dark:hover:bg-stone-900"
							}
            `}
							>
								<span
									className={`p-1 rounded-full overflow-hidden w-8 h-8 flex items-center justify-center ${isActive ? "bg-primary/10" : "bg-stone-200 dark:bg-stone-800"}`}
								>
									{asset.type === "image" ? (
										<Image
											src={asset.value}
											alt={category.name}
											width={20}
											height={20}
											className="w-full h-full object-cover"
										/>
									) : (
										<asset.value size={20} />
									)}
								</span>
								{category.name}
							</button>
						);
					})}
					<div className="w-8 shrink-0 md:hidden" />
				</nav>
				<div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
			</div>
		</div>
	);
}
