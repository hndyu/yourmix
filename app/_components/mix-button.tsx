"use client";

import { GlassWater } from "lucide-react";
import * as React from "react";

interface MixButtonProps {
	onClick: () => void;
	disabled?: boolean;
	isLoading?: boolean;
}

export default function MixButton({
	onClick,
	disabled = false,
	isLoading = false,
}: MixButtonProps) {
	return (
		<button
			type="button"
			onClick={!disabled && !isLoading ? onClick : undefined}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			aria-label={
				isLoading
					? "ミックス中...（レシピを生成中）"
					: "ミックス！：オリジナルレシピを生成"
			}
			className={`
        relative group overflow-hidden rounded-full w-48 h-16 flex items-center justify-center
        transition-all duration-300 ease-out transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950
        ${
					disabled || isLoading
						? "bg-stone-800 cursor-not-allowed opacity-70"
						: "bg-primary hover:bg-amber-600 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95"
				}
      `}
		>
			<div className="flex items-center gap-2 text-white font-bold text-xl z-10">
				{isLoading ? (
					<>
						<div
							className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
							aria-hidden="true"
						/>
						<span>ミックス中...</span>
					</>
				) : (
					<>
						<GlassWater
							className={"transition-transform group-hover:rotate-12"}
							size={24}
							aria-hidden="true"
						/>
						<span>ミックス！</span>
					</>
				)}
			</div>

			{/* Shine effect on hover */}
			{!disabled && !isLoading && (
				<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
			)}
		</button>
	);
}
