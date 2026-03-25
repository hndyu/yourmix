"use client";

import { Search, XCircle } from "lucide-react";
import { useRef } from "react";

interface IngredientSearchProps {
	value: string;
	onChange: (value: string) => void;
}

export default function IngredientSearch({
	value,
	onChange,
}: IngredientSearchProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClear = () => {
		onChange("");
		inputRef.current?.focus();
	};

	return (
		<div className="relative w-full max-w-md mx-auto mb-6">
			<label htmlFor="ingredient-search" className="sr-only">
				材料名で検索
			</label>
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Search className="text-stone-400 dark:text-stone-500" size={18} />
			</div>
			<input
				ref={inputRef}
				id="ingredient-search"
				type="text"
				className="block w-full pl-10 pr-10 py-3 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
				placeholder="材料名で検索..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			{value && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors"
					aria-label="検索をクリア"
				>
					<XCircle size={18} />
				</button>
			)}
		</div>
	);
}
