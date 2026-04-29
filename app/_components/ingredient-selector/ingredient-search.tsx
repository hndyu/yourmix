"use client";

import { Search, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IngredientSearchProps {
	value: string;
	onChange: (value: string) => void;
}

export default function IngredientSearch({
	value,
	onChange,
}: IngredientSearchProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Press '/' to focus search input if no other input is active
			if (
				e.key === "/" &&
				// 修飾キー付きショートカット（Ctrl/Cmd/Alt）では横取りしない
				!e.ctrlKey &&
				!e.metaKey &&
				!e.altKey &&
				document.activeElement?.tagName !== "INPUT" &&
				document.activeElement?.tagName !== "TEXTAREA" &&
				!(document.activeElement as HTMLElement)?.isContentEditable
			) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

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
				<Search
					className="text-stone-400 dark:text-stone-500"
					size={18}
					aria-hidden="true"
				/>
			</div>
			<input
				ref={inputRef}
				id="ingredient-search"
				type="search"
				className="block w-full pl-10 pr-10 py-3 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
				placeholder="材料名で検索..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				aria-keyshortcuts="/"
			/>
			{value ? (
				<button
					type="button"
					onClick={handleClear}
					className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
					aria-label="検索をクリア"
				>
					<XCircle size={18} aria-hidden="true" />
				</button>
			) : (
				!isFocused && (
					<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-stone-200 bg-stone-50 px-1.5 font-mono text-[10px] font-medium text-stone-400 opacity-100 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-500">
							/
						</kbd>
					</div>
				)
			)}
		</div>
	);
}
