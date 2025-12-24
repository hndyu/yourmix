"use client";

import { SearchX } from "lucide-react";

interface NoResultsProps {
	show: boolean;
}

export function NoResults({ show }: NoResultsProps) {
	if (!show) return null;

	return (
		<div className="w-full max-w-2xl mx-auto mt-8 p-8 text-center bg-card border border-border rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
			<SearchX
				className="text-stone-300 dark:text-stone-600 mb-4 mx-auto"
				size={48}
			/>
			<h3 className="text-xl font-bold text-foreground mb-2">
				レシピが見つかりませんでした
			</h3>
			<p className="text-stone-600 dark:text-stone-400">
				選択された材料の組み合わせではレシピが見つかりませんでした。
				<br />
				材料を減らすか、別の組み合わせを試してみてください。
			</p>
		</div>
	);
}
