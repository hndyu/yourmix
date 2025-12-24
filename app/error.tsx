"use client";
import { Button } from "@/app/_components/ui/button";
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
		<div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
			<h1 className="text-2xl md:text-3xl font-bold mb-4">
				予期せぬエラーが発生しました
			</h1>
			<p className="text-stone-600 dark:text-stone-400 mb-8">
				ご迷惑をおかけしております。時間をおいて再度お試しください。
			</p>
			<Button onClick={() => reset()}>再試行</Button>
		</div>
	);
}
