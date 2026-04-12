"use client";

import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import type { GeneratedCocktail } from "../types/cocktail";
import CocktailDisplay from "./cocktail-display";

interface CocktailDialogProps {
	/** 表示するカクテルデータ */
	cocktail: GeneratedCocktail | null;
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
	const closeButtonRef = React.useRef<HTMLButtonElement>(null);
	const previousActiveElement = React.useRef<HTMLElement | null>(null);

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

	// フォーカス管理
	React.useEffect(() => {
		if (open) {
			previousActiveElement.current = document.activeElement as HTMLElement;
			// ダイアログが開いた直後に閉じるボタンにフォーカスを当てる
			// setTimeout を使用してレンダリング完了を確実にする
			const timer = setTimeout(() => {
				closeButtonRef.current?.focus();
			}, 0);
			return () => clearTimeout(timer);
		}
		// ダイアログが閉じるときにフォーカスを戻す
		previousActiveElement.current?.focus();
	}, [open]);

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

	if (!open || !cocktail || typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.target !== e.currentTarget) return;
				if (e.key === "Enter" || e.key === " ") onClose();
			}}
			tabIndex={-1}
			role="presentation"
		>
			{/* モーダルコンテナ */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation doesn't need key event */}
			<div
				// biome-ignore lint/a11y/useSemanticElements: using div for custom modal styling with portal
				className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto mt-[5vh] animate-in slide-in-from-bottom-8 duration-500"
				role="dialog"
				aria-modal="true"
				aria-labelledby="dialog-title"
				aria-describedby="dialog-description"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 閉じるボタン (Sticky to stay visible during scroll) */}
				<button
					ref={closeButtonRef}
					type="button"
					onClick={onClose}
					className="sticky top-4 float-right mr-4 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-colors shadow-lg"
					aria-label="閉じる"
				>
					<X size={20} />
				</button>

				<CocktailDisplay
					cocktail={cocktail}
					titleId="dialog-title"
					descriptionId="dialog-description"
				/>
			</div>
		</div>,
		document.body,
	);
}
