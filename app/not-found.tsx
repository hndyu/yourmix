import { Button } from "@/app/_components/ui/button";
import { Martini, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
	title: {
		absolute: "ページが見つかりません | YourMix",
	},
	description:
		"お探しのページは見つかりませんでした。URLが正しいかご確認ください。",
};

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 gap-8 animate-in fade-in duration-700">
			<div className="relative group">
				<div
					className="absolute -top-4 -right-4 text-primary animate-pulse"
					aria-hidden="true"
				>
					<Sparkles size={24} />
				</div>
				<div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:rotate-12 duration-500">
					<Martini size={48} aria-hidden="true" />
				</div>
			</div>

			<div className="space-y-4">
				<h1 className="font-bold text-foreground">
					<span
						className="font-display text-7xl md:text-8xl text-primary/20 block mb-2 select-none uppercase tracking-widest"
						aria-hidden="true"
					>
						404
					</span>
					<span className="text-2xl md:text-3xl">
						404 - ページが見つかりません
					</span>
				</h1>
				<p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
					お探しのページは移動または削除された可能性があります。
					<br />
					URLが正しいか再度ご確認ください。
				</p>
			</div>

			<Button href="/" size="lg" className="min-w-[200px] gap-2 group">
				<Martini
					size={18}
					aria-hidden="true"
					className="transition-transform group-hover:rotate-12"
				/>
				トップページに戻る
			</Button>
		</div>
	);
}
