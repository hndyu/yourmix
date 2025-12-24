import { Button } from "@/app/_components/ui/button";
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
		<div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
			<h1 className="text-2xl md:text-3xl font-bold mb-4">
				404 - ページが見つかりません
			</h1>
			<p className="text-stone-600 dark:text-stone-400 mb-8">
				お探しのページは移動または削除された可能性があります。
			</p>
			<Button href="/">トップページに戻る</Button>
		</div>
	);
}
