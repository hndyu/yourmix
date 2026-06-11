"use client";

import { Sparkles } from "lucide-react";
import type * as React from "react";
import BartenderStatus from "./bartender-status";

interface CompletionBarProps {
	/** AI 生成中かどうか */
	isGenerating: boolean;
	/** 「見る」ボタンがクリックされたときのコールバック */
	onViewClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * 画面下部に固定表示されるステータスバー。
 * AI 生成中は実況メッセージを表示し、完成後は「見る」ボタンを表示する。
 */
export default function CompletionBar({
	isGenerating,
	onViewClick,
}: CompletionBarProps) {
	return (
		<div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-500">
			<div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
				{isGenerating ? (
					// AI 生成中: 実況メッセージを表示
					<>
						{/* ローディングインジケーター */}
						<div className="flex items-center gap-3 min-w-0">
							<div className="relative flex items-center justify-center shrink-0">
								<span className="absolute inline-flex h-4 w-4 rounded-full bg-primary/40 animate-ping" />
								<span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
							</div>
							<BartenderStatus />
						</div>
					</>
				) : (
					// AI 生成完了: 完成メッセージと「見る」ボタンを表示
					<>
						<p className="text-sm font-bold text-foreground animate-in fade-in duration-500">
							<span aria-hidden="true">✨</span>{" "}
							オリジナルカクテルが完成しました！
						</p>
						<button
							type="button"
							onClick={onViewClick}
							className="group shrink-0 px-5 py-2 rounded-full text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 flex items-center gap-2"
							aria-label="完成したオリジナルカクテルを見る"
							title="完成したオリジナルカクテルを見る"
						>
							<Sparkles
								size={16}
								className="transition-transform group-hover:rotate-12"
								aria-hidden="true"
							/>
							見る
						</button>
					</>
				)}
			</div>
		</div>
	);
}
