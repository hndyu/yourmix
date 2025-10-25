// 材料の型定義
export interface Ingredient {
	name: string;
	amount: string;
}

// カクテルの型定義
export interface Cocktail {
	id: string;
	name: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	garnish?: string;
}

// モックカクテルデータ
export const mockCocktails: Cocktail[] = [
	{
		id: "1",
		name: "モヒート",
		description: "キューバ発祥の爽やかなラムベースのカクテル",
		ingredients: [
			{ name: "ラム（ホワイト）", amount: "60ml" },
			{ name: "ライムジュース", amount: "30ml" },
			{ name: "シンプルシロップ", amount: "15ml" },
			{ name: "ミントの葉", amount: "8-10枚" },
			{ name: "ソーダ水", amount: "適量" },
		],
		instructions: [
			"ミントの葉をグラスに入れて軽く押しつぶす",
			"ライムジュースとシンプルシロップを加える",
			"ラムを注ぎ、氷を入れて軽くステア",
			"ソーダ水で満たして完成",
		],
		garnish: "ミントの葉、ライムスライス",
	},
	{
		id: "2",
		name: "マルガリータ",
		description: "テキーラベースの定番カクテル",
		ingredients: [
			{ name: "テキーラ（ブランコ）", amount: "50ml" },
			{ name: "ライムジュース", amount: "25ml" },
			{ name: "トリプルセック", amount: "20ml" },
		],
		instructions: [
			"シェーカーに氷を入れる",
			"テキーラ、ライムジュース、トリプルセックを加える",
			"シェイクしてグラスに注ぐ",
			"グラスの縁に塩を付けて完成",
		],
		garnish: "ライムスライス",
	},
	{
		id: "3",
		name: "オールドファッションド",
		description: "クラシックなウイスキーベースのカクテル",
		ingredients: [
			{ name: "バーボンウイスキー", amount: "60ml" },
			{ name: "アンゴスチュラビターズ", amount: "2-3滴" },
			{ name: "シンプルシロップ", amount: "5ml" },
			{ name: "オレンジビターズ", amount: "1滴" },
		],
		instructions: [
			"グラスに氷を入れる",
			"ウイスキー、ビターズ、シロップを加える",
			"ステアして混ぜる",
			"オレンジピールでガーニッシュ",
		],
		garnish: "オレンジピール",
	},
	{
		id: "4",
		name: "ジントニック",
		description: "爽やかなジンベースの定番カクテル",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "トニックウォーター", amount: "120ml" },
			{ name: "ライムジュース", amount: "15ml" },
		],
		instructions: [
			"グラスに氷を入れる",
			"ジンとライムジュースを注ぐ",
			"トニックウォーターで満たす",
			"軽くステアして完成",
		],
		garnish: "ライムスライス",
	},
];
