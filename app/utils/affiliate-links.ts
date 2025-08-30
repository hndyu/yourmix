// 材料名キーワードからアフィリエイトリンクへのマッピング
export const AFFILIATE_LINKS: Record<string, string> = {
	// スピリッツ類
	ラム: "https://amzn.to/example-rum",
	テキーラ: "https://amzn.to/example-tequila",
	ウイスキー: "https://amzn.to/example-whiskey",
	バーボン: "https://amzn.to/example-bourbon",
	ジン: "https://amzn.to/example-gin",
	ウォッカ: "https://amzn.to/example-vodka",

	// リキュール類
	トリプルセック: "https://amzn.to/example-triple-sec",
	コアントロー: "https://amzn.to/example-cointreau",
	カンパリ: "https://amzn.to/example-campari",
	アペロール: "https://amzn.to/example-aperol",

	// ビターズ類
	アンゴスチュラビターズ: "https://amzn.to/example-angostura",
	オレンジビターズ: "https://amzn.to/example-orange-bitters",

	// ジュース類
	ライムジュース: "https://amzn.to/example-lime-juice",
	レモンジュース: "https://amzn.to/example-lemon-juice",
	オレンジジュース: "https://amzn.to/example-orange-juice",
	グレープフルーツジュース: "https://amzn.to/example-grapefruit-juice",

	// シロップ類
	シンプルシロップ: "https://amzn.to/example-simple-syrup",
	グレナディンシロップ: "https://amzn.to/example-grenadine",
	オーキッドシロップ: "https://amzn.to/example-orchid-syrup",

	// その他の材料
	ミント: "https://amzn.to/example-mint",
	ソーダ水: "https://amzn.to/example-soda",
	トニックウォーター: "https://amzn.to/example-tonic",
	プロセッコ: "https://amzn.to/example-prosecco",
	シャンパン: "https://amzn.to/example-champagne",

	// ガーニッシュ用
	ライム: "https://amzn.to/example-lime",
	レモン: "https://amzn.to/example-lemon",
	オレンジ: "https://amzn.to/example-orange",
	チェリー: "https://amzn.to/example-cherry",
	オリーブ: "https://amzn.to/example-olive",

	// ツール類
	シェーカー: "https://amzn.to/example-shaker",
	ミキサーグラス: "https://amzn.to/example-mixing-glass",
	バースプーン: "https://amzn.to/example-bar-spoon",
	ストレーナー: "https://amzn.to/example-strainer",
	マドラー: "https://amzn.to/example-muddler",
	アイスピック: "https://amzn.to/example-ice-pick",

	// グラス類
	カクテルグラス: "https://amzn.to/example-cocktail-glass",
	ハイボールグラス: "https://amzn.to/example-highball-glass",
	ロックグラス: "https://amzn.to/example-rocks-glass",
	ワイングラス: "https://amzn.to/example-wine-glass",
	ショットグラス: "https://amzn.to/example-shot-glass",
};

// 材料名からアフィリエイトリンクを取得する関数
export const getAffiliateLink = (ingredient: string): string | null => {
	// 材料名からキーワードを抽出してマッチング
	const normalizedIngredient = ingredient.toLowerCase();

	for (const [keyword, link] of Object.entries(AFFILIATE_LINKS)) {
		if (normalizedIngredient.includes(keyword.toLowerCase())) {
			return link;
		}
	}

	return null;
};

// 材料名からキーワードを抽出する関数
export const extractIngredientKeyword = (ingredient: string): string => {
	// 量や単位を除去して材料名のみを抽出
	const cleanIngredient = ingredient
		.replace(/\d+ml/g, "") // 60ml などの量を除去
		.replace(/\d+-\d+/g, "") // 8-10 などの範囲を除去
		.replace(/\d+/g, "") // 残りの数字を除去
		.replace(/（.*?）/g, "") // （ホワイト）などの説明を除去
		.replace(/\(.*?\)/g, "") // (white)などの説明を除去
		.replace(/適量/g, "") // 適量を除去
		.replace(/枚/g, "") // 枚を除去
		.replace(/滴/g, "") // 滴を除去
		.trim();

	return cleanIngredient;
};
