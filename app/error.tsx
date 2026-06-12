"use client";
import { Button } from "@/app/_components/ui/button";
import { AlertTriangle, Martini, RotateCcw } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

export default function CustomError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// エラーページのタイトルを設定
		// layout.tsx の template が適用されるため、ページ固有の部分のみ設定
		document.title = "エラーが発生しました";

		// エラーをロギングサービスに記録します
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 gap-8 animate-in fade-in duration-700">
			<div className="relative group">
				<div
					className="absolute -top-2 -right-2 text-red-500 animate-pulse"
					aria-hidden="true"
				>
					<AlertTriangle size={24} />
				</div>
				<div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:rotate-12 duration-500">
					<Martini size={48} aria-hidden="true" />
				</div>
			</div>

			<div className="space-y-4">
				<h1 className="font-bold text-foreground">
					<span
						className="font-display text-7xl md:text-8xl text-primary/10 block mb-2 select-none uppercase tracking-widest"
						aria-hidden="true"
					>
						Error
					</span>
					<span className="text-2xl md:text-3xl">
						予期せぬエラーが発生しました
					</span>
				</h1>
				<p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
					ご迷惑をおかけしております。
					<br />
					一時的な問題の可能性があります。時間をおいて再度お試しください。
				</p>
				{error.digest && (
					<p className="text-[10px] font-mono text-stone-400 dark:text-stone-600 mt-4 opacity-50">
						ID: {error.digest}
					</p>
				)}
			</div>

			<Button
				onClick={() => reset()}
				size="lg"
				className="min-w-[200px] gap-2 group"
			>
				<RotateCcw
					size={18}
					aria-hidden="true"
					className="group-hover:-rotate-45 transition-transform"
				/>
				再試行
			</Button>
		</div>
	);
}
