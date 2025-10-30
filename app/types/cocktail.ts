// 材料の型定義
export interface Ingredient {
	name: string;
	amount: string;
	option_group?: number;
}

// カクテルの型定義
export interface Cocktail {
	id: string;
	name: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	garnish?: string;
	tags?: string[];
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
		tags: ["IBA公認カクテル - The Unforgettables"],
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
		tags: ["IBA公認カクテル - Contemporary Classics"],
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
		tags: ["IBA公認カクテル - The Unforgettables"],
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
		tags: [],
	},
	{
		id: "boulevardier",
		name: "ブールヴァルディエ",
		description: "ネグローニのウイスキー版とも言える、複雑で豊かな味わいのカクテル。",
		ingredients: [
			{ name: "バーボン", amount: "45ml", option_group: 1 },
			{ name: "ライ・ウイスキー", amount: "45ml", option_group: 1 },
			{ name: "カンパリ", amount: "30ml" },
			{ name: "スイート・ベルモット", amount: "30ml" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。",
			"冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "オレンジの皮",
		tags: ["IBA公認カクテル - The Unforgettables"],
	},
	{
		id: "new-york-sour",
		name: "ニューヨーク・サワー",
		description: "ウイスキーサワーに赤ワインをフロートさせた、見た目も美しいカクテル。",
		ingredients: [
			{ name: "ライウイスキー", amount: "60ml", option_group: 2 },
			{ name: "バーボン", amount: "60ml", option_group: 2 },
			{ name: "シンプルシロップ", amount: "22.5ml" },
			{ name: "フレッシュレモンジュース", amount: "30ml" },
			{ name: "卵白", amount: "数滴" },
			{ name: "赤ワイン（シラーズまたはマルベック）", amount: "15ml" },
		],
		instructions: [
			"すべての材料をシェーカーに入れます。",
			"氷で力強くシェイクします。",
			"氷を入れた冷やしたロックグラスに濾し入れます。",
			"ワインを上にフロートさせます。",
		],
		garnish: "レモンまたはオレンジの皮とチェリー",
		tags: ["IBA公認カクテル - 新時代"],
	},
];
