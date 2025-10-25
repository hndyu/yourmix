// カクテルの型定義
export interface Cocktail {
	id: string;
	name: string;
	description: string;
	ingredients: string[];
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
			"ラム（ホワイト） 60ml",
			"ライムジュース 30ml",
			"シンプルシロップ 15ml",
			"ミントの葉 8-10枚",
			"ソーダ水 適量",
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
			"テキーラ（ブランコ） 50ml",
			"ライムジュース 25ml",
			"トリプルセック 20ml",
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
			"バーボンウイスキー 60ml",
			"アンゴスチュラビターズ 2-3滴",
			"シンプルシロップ 5ml",
			"オレンジビターズ 1滴",
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
			"ジン 45ml",
			"トニックウォーター 120ml",
			"ライムジュース 15ml",
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
