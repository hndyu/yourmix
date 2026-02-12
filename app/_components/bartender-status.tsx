"use client";

import * as React from "react";

// バーテンダーの実況メッセージ一覧
const BARTENDER_MESSAGES = [
	"🍸 バーテンダーがレシピを考案中…",
	"📖 材料の組み合わせを研究しています…",
	"🧊 氷を割っています…",
	"🫗 材料を計量しています…",
	"🫨 シェイカーを振っています…",
	"✨ 仕上げをしています…",
] as const;

// メッセージの切り替え間隔(ms)
const MESSAGE_INTERVAL_MS = 2500;

/**
 * AI カクテル生成中にバーテンダーの実況メッセージを表示するコンポーネント。
 * 一定間隔でメッセージを順番に切り替えて進行感を演出する。
 */
export default function BartenderStatus() {
	const [messageIndex, setMessageIndex] = React.useState(0);

	React.useEffect(() => {
		const timer = setInterval(() => {
			setMessageIndex((prev) => (prev + 1) % BARTENDER_MESSAGES.length);
		}, MESSAGE_INTERVAL_MS);

		return () => clearInterval(timer);
	}, []);

	return (
		<p
			className="text-sm font-medium text-foreground animate-in fade-in duration-500"
			// メッセージが変わるたびにアニメーションを再発火させるための key
			key={messageIndex}
		>
			{BARTENDER_MESSAGES[messageIndex]}
		</p>
	);
}
