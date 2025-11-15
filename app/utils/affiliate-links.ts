// アフィリエイトリンクを除外するキーワードのリスト
const EXCLUDED_KEYWORDS: string[] = [
	// ここに除外したいキーワードを追加
	// 例: "氷", "水"
];

// 材料名からアフィリエイトリンクを取得する関数
export const getAffiliateLink = (keyword: string): string | null => {
	// キーワードが空または除外リストに含まれている場合はリンクを生成しない
	if (!keyword || EXCLUDED_KEYWORDS.includes(keyword)) {
		return null;
	}
	// Amazon.co.jp の検索URLを動的に生成
	const encodedKeyword = encodeURIComponent(keyword);
	return `https://www.amazon.co.jp/s?k=${encodedKeyword}`;
};

// 材料名からキーワードを抽出する関数
export const extractIngredientKeyword = (ingredient: string): string => {
	// 材料名から検索に不要な部分（説明、単位、形状など）を除去
	return ingredient
		.replace(/（.*?）/g, "") // 全角括弧とその中身を除去
		.replace(/\(.*?\)/g, "") // 半角括弧とその中身を除去
		.replace(/の(くし切り|輪切り|スライス|小枝|葉|塊)/g, "") // 「〜の〇〇」という形状表現を除去
		.replace(/(産|薄切り)$/g, "") // 末尾の「産」「薄切り」を除去
		.trim();
};
