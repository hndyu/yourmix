"use client";

import SearchIcon from "@mui/icons-material/Search";

interface IngredientSearchProps {
	value: string;
	onChange: (value: string) => void;
}

export default function IngredientSearch({
	value,
	onChange,
}: IngredientSearchProps) {
	return (
		<div className="relative w-full max-w-md mx-auto mb-6">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<SearchIcon className="text-stone-500 dark:text-stone-500" />
			</div>
			<input
				type="text"
				className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
				placeholder="材料名で検索..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
