"use client";

import LocalBarIcon from "@mui/icons-material/LocalBar";
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
			className={`
        relative group overflow-hidden rounded-full w-48 h-16 flex items-center justify-center
        transition-all duration-300 ease-out transform
        ${
					disabled || isLoading
						? "bg-stone-800 cursor-not-allowed opacity-70"
						: "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_auto] animate-gradient hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 active:scale-95"
				}
      `}
		>
			<div className="flex items-center gap-2 text-white font-bold text-xl z-10">
				{isLoading ? (
					<>
						<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						<span>Mixing...</span>
					</>
				) : (
					<>
						<LocalBarIcon
							className={"transition-transform group-hover:rotate-12"}
						/>
						<span>Mix!</span>
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
