"use client";

import SearchOffIcon from "@mui/icons-material/SearchOff";

interface NoResultsProps {
	show: boolean;
}

export function NoResults({ show }: NoResultsProps) {
	if (!show) return null;

	return (
		<div className="w-full max-w-2xl mx-auto mt-8 p-8 text-center bg-stone-900/50 border border-stone-800 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
			<SearchOffIcon className="text-stone-600 mb-4" sx={{ fontSize: 48 }} />
			<h3 className="text-xl font-bold text-stone-300 mb-2">
				レシピが見つかりませんでした
			</h3>
			<p className="text-stone-500">
				選択された材料の組み合わせではレシピが見つかりませんでした。
				<br />
				材料を減らすか、別の組み合わせを試してみてください。
			</p>
		</div>
	);
}
