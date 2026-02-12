"use client";

import { X } from "lucide-react";
import * as React from "react";
import type { Cocktail } from "../types/cocktail";
import CocktailDisplay from "./cocktail-display";

interface CocktailDialogProps {
	/** 表示するカクテルデータ */
	cocktail: Cocktail | null;
	/** ダイアログの開閉状態 */
	open: boolean;
	/** ダイアログを閉じるときのコールバック */
	onClose: () => void;
}

/**
 * AI 生成されたオリジナルカクテルをモーダルダイアログで表示するコンポーネント。
 * 既存の `CocktailDisplay` を内部で再利用する。
 */
export default function CocktailDialog({
	cocktail,
	open,
	onClose,
}: CocktailDialogProps) {
	// ESC キーで閉じる
	React.useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	// ダイアログが開いている間はスクロールを無効化
	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	if (!open || !cocktail) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-start justify-center animate-in fade-in duration-300">
			{/* オーバーレイ（背景の暗転） */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onClose();
				}}
				role="button"
				tabIndex={0}
				aria-label="ダイアログを閉じる"
			/>

			{/* モーダルコンテナ */}
			<div className="relative z-10 w-full max-h-[90vh] overflow-y-auto mt-[5vh] mx-4 animate-in slide-in-from-bottom-8 duration-500">
				{/* 閉じるボタン */}
				<button
					type="button"
					onClick={onClose}
					className="sticky top-4 float-right mr-2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-colors shadow-lg"
					aria-label="閉じる"
				>
					<X size={20} />
				</button>

				<CocktailDisplay cocktail={cocktail} />
			</div>
		</div>
	);
}
