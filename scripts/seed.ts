import { drizzle } from "drizzle-orm/d1";
import { v4 as uuidv4 } from "uuid";
import type { Env } from "../cloudflare-env"; // Wranglerが生成した共通のEnv型定義をインポート
import {
	categories,
	cocktailIngredients,
	cocktailTags,
	cocktails,
	ingredientGroups,
	ingredients,
	instructions,
	tags,
} from "../schema"; // Drizzle ORM のスキーマ定義

// シードデータの型定義
interface IngredientData {
	name: string;
	amount: string;
	option_group?: number;
	category: string;
}

interface CocktailData {
	name: string;
	description: string;
	ingredients: IngredientData[];
	instructions: string[];
	garnish: string;
	tags: string[];
	imageUrl: string;
}

// シードデータ
const contemporaryClassics: CocktailData[] = [
	{
		name: "ベリーニ",
		description:
			"白桃とスパークリングワインを合わせた、優しい甘さと爽やかな香りが楽しめるイタリア生まれのカクテル。",
		ingredients: [
			{ name: "プロセッコ", amount: "100ml", category: "醸造酒" },
			{ name: "白桃ピュレ", amount: "50ml", category: "その他" },
		],
		instructions: [
			"氷を入れたミキシンググラスに白桃ピュレを注ぎ、プロセッコを加えます。",
			"軽くかき混ぜて冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "bellini.jpg",
	},
	{
		name: "ブラック・ルシアン",
		description:
			"ウォッカとコーヒー・リキュールを使った、濃厚でほろ苦い味わいの大人向けカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml", category: "蒸留酒" },
			{ name: "コーヒー・リキュール", amount: "20ml", category: "混成酒" },
		],
		instructions: ["氷を入れたグラスに材料を注ぎます。", "軽くかき混ぜます。"],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "black-russian.jpg",
	},
	{
		name: "ブラッディ・マリー",
		description:
			"トマト・ジュースとスパイスを合わせた、食事にも合うピリッとした風味のカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml", category: "蒸留酒" },
			{ name: "トマト・ジュース", amount: "90ml", category: "ノンアルコール" },
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "ウスターソース", amount: "2振", category: "その他" },
			{ name: "タバスコ", amount: "お好みで", category: "その他" },
			{ name: "セロリソルト", amount: "お好みで", category: "その他" },
			{ name: "コショウ", amount: "お好みで", category: "その他" },
		],
		instructions: [
			"氷を入れたミキシンググラスですべての材料を静かにかき混ぜ、グラスに注ぎます。",
		],
		garnish: "お好みでセロリ、レモンのくし切りを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "bloody-mary.jpg",
	},
	{
		name: "カイピリーニャ",
		description:
			"ライムと砂糖の甘酸っぱさが心地よい、ブラジルを代表する爽やかなカクテル。",
		ingredients: [
			{ name: "カシャッサ", amount: "60ml", category: "蒸留酒" },
			{ name: "ライムのくし切り", amount: "1個", category: "その他" },
			{ name: "砂糖", amount: "小さじ4杯", category: "その他" },
		],
		instructions: [
			"グラスにライムと砂糖を入れ、軽く混ぜます。",
			"砕いた氷を入れ、カシャッサを注ぎます。材料が混ざるように優しく混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "caipirinha.jpg",
	},
	{
		name: "カーディナル",
		description:
			"ジンとカンパリを合わせた、苦味と柑橘の香りがバランスのよい上品な一杯。",
		ingredients: [
			{ name: "ジン", amount: "90ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "10ml", category: "醸造酒" },
			{ name: "カンパリ", amount: "10ml", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "cardinal.jpg",
	},
	{
		name: "シャンパン・カクテル",
		description:
			"角砂糖とビターズを加えたシャンパンで、華やかで気品ある味わいを楽しめる定番カクテル。",
		ingredients: [
			{ name: "シャンパン", amount: "90ml", category: "醸造酒" },
			{ name: "コニャック", amount: "10ml", category: "蒸留酒" },
			{ name: "アンゴスチュラ・ビターズ", amount: "2振", category: "混成酒" },
			{ name: "角砂糖", amount: "1個", category: "その他" },
			{
				name: "グラン・マルニエ",
				amount: "お好みで数滴",
				category: "混成酒",
			},
		],
		instructions: [
			"グラスに角砂糖とビターズを入れ、コニャックを加えます。",
			"軽く冷やしたシャンパンを注ぎます。",
		],
		garnish: "オレンジの皮とマラスキーノチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "champagne-cocktail.jpg",
	},
	{
		name: "コープス・リバイバー #2",
		description:
			"ジンに柑橘とリキュールを合わせた、すっきりと目が覚めるような爽快なカクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "コアントロー", amount: "30ml", category: "混成酒" },
			{ name: "リレ・ブラン", amount: "30ml", category: "醸造酒" },
			{ name: "レモン・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "アブサン", amount: "1振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振って冷やしたグラスに注ぎます。",
		],
		garnish: "オレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "corpse-reviver-2.jpg",
	},
	{
		name: "コスモポリタン",
		description:
			"クランベリーの酸味とライムの爽やかさが広がる、軽やかで飲みやすいウォッカカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml", category: "蒸留酒" },
			{ name: "コアントロー", amount: "15ml", category: "混成酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{
				name: "クランベリー・ジュース",
				amount: "30ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"氷を入れたシェイカーにすべての材料を加えます。",
			"よく振って、グラスに注ぎます。",
		],
		garnish: "レモンツイストを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "cosmopolitan.jpg",
	},
	{
		name: "キューバ・リブレ",
		description:
			"ラムとコーラにライムを加えた、手軽で南国気分を味わえる爽やかな一杯。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "50ml", category: "蒸留酒" },
			{ name: "コーラ", amount: "120ml", category: "ノンアルコール" },
			{ name: "ライム・ジュース", amount: "10ml", category: "ノンアルコール" },
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "ライムのくし切りを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "cuba-libre.jpg",
	},
	{
		name: "フレンチ75",
		description:
			"ジンとレモンをスパークリングワインで割った、華やかで飲みやすいシャンパン系カクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "シュガー・シロップ", amount: "15ml", category: "その他" },
			{ name: "シャンパン", amount: "60ml", category: "醸造酒" },
		],
		instructions: [
			"シャンパン以外の材料をすべてシェイカーに注ぎます。",
			"よく振ってグラスに注ぎます。",
			"シャンパンを注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "french-75.jpg",
	},
	{
		name: "フレンチ・コネクション",
		description:
			"コニャックとアマレットの組み合わせが香ばしく、落ち着いた甘さのあるカクテル。",
		ingredients: [
			{ name: "コニャック", amount: "35ml", category: "蒸留酒" },
			{ name: "アマレット", amount: "35ml", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたグラスに直接注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "french-connection.jpg",
	},
	{
		name: "ガリバルディ",
		description:
			"カンパリとオレンジ・ジュースの鮮やかな色合いが美しい、軽やかな苦味のカクテル。",
		ingredients: [
			{ name: "カンパリ", amount: "45ml", category: "混成酒" },
			{
				name: "オレンジ・ジュース",
				amount: "120ml",
				category: "ノンアルコール",
			},
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "オレンジのくし切りを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "garibaldi.jpg",
	},
	{
		name: "グラスホッパー",
		description:
			"チョコミントのような甘く爽やかな風味が特徴の、デザート感覚のカクテル。",
		ingredients: [
			{ name: "クレーム・ド・カカオ", amount: "20ml", category: "混成酒" },
			{ name: "クレーム・ド・ミント", amount: "20ml", category: "混成酒" },
			{ name: "生クリーム", amount: "20ml", category: "その他" },
		],
		instructions: [
			"氷を入れたシェイカーにすべての材料を注ぎます。",
			"数秒間勢いよくシェイクします。冷やしたグラスに注ぎます。",
		],
		garnish: "お好みでミントの葉を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "grasshopper.jpg",
	},
	{
		name: "ヘミングウェイ・スペシャル",
		description:
			"文豪ヘミングウェイの名を冠した、グレープフルーツとライムが香る爽快なラムカクテル。",
		ingredients: [
			{ name: "ラム", amount: "60ml", category: "蒸留酒" },
			{
				name: "グレープフルーツ・ジュース",
				amount: "40ml",
				category: "ノンアルコール",
			},
			{
				name: "マラスキーノ・リキュール",
				amount: "15ml",
				category: "混成酒",
			},
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振ってグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "hemingway-special.jpg",
	},
	{
		name: "ホーセズ・ネック",
		description:
			"コニャックとジンジャーエールにレモンの皮を添えた、すっきりとした辛口のカクテル。",
		ingredients: [
			{ name: "コニャック", amount: "40ml", category: "蒸留酒" },
			{ name: "ジンジャーエール", amount: "120ml", category: "ノンアルコール" },
			{
				name: "アンゴスチュラ・ビターズ",
				amount: "お好みで1振",
				category: "混成酒",
			},
		],
		instructions: [
			"氷を入れたグラスにコニャックとジンジャーエールを直接注ぎます。",
			"軽くかき混ぜます。",
			"お好みに応じて、ビターズを少量加えます。",
		],
		garnish: "レモン1個分の皮をスパイラル状にして添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "horses-neck.jpg",
	},
	{
		name: "アイリッシュ・コーヒー",
		description:
			"ウイスキーとホットコーヒーにクリームを重ねた、香り高く温かみのあるカクテル。",
		ingredients: [
			{
				name: "アイリッシュ・ウイスキー",
				amount: "50ml",
				category: "蒸留酒",
			},
			{ name: "ホットコーヒー", amount: "120ml", category: "ノンアルコール" },
			{ name: "生クリーム", amount: "50ml", category: "その他" },
			{ name: "砂糖", amount: "小さじ1杯", category: "その他" },
		],
		instructions: [
			"温めたブラックコーヒーを、予熱したグラスに注ぎます。",
			"ウイスキーと少なくとも小さじ1杯の砂糖を加え、溶けるまでかき混ぜます。",
			"冷やした生クリームを、コーヒーの表面のすぐ上に持ったスプーンの裏側に慎重に注ぎます。",
			"クリームの層は混ざらずにコーヒーの上に浮かびます。",
			"普通の砂糖はシュガー・シロップに置き換えることができます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "irish-coffee.jpg",
	},
	{
		name: "キール",
		description:
			"白ワインにカシスを加えた、やさしい甘さと果実の香りが心地よいフランスの定番。",
		ingredients: [
			{ name: "白ワイン", amount: "90ml", category: "醸造酒" },
			{ name: "クレーム・ド・カシス", amount: "10ml", category: "混成酒" },
		],
		instructions: [
			"グラスにクレーム・ド・カシスを注ぎ、白ワインで満たします。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "kir.jpg",
	},
	{
		name: "レモン・ドロップ・マティーニ",
		description:
			"レモンの酸味と甘みが調和した、すっきりとした味わいのウォッカカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "30ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "20ml", category: "混成酒" },
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振って冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "lemon-drop-martini.jpg",
	},
	{
		name: "ロングアイランド・アイスティー",
		description:
			"複数のスピリッツを合わせて作る、コーラ風味で飲みやすい見た目以上に強いカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "15ml", category: "蒸留酒" },
			{ name: "テキーラ", amount: "15ml", category: "蒸留酒" },
			{ name: "ホワイト・ラム", amount: "15ml", category: "蒸留酒" },
			{ name: "ジン", amount: "15ml", category: "蒸留酒" },
			{ name: "コアントロー", amount: "15ml", category: "混成酒" },
			{ name: "レモン・ジュース", amount: "25ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "30ml", category: "その他" },
			{ name: "コーラ", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"氷を入れたグラスにすべての材料を入れます。",
			"軽くかき混ぜます。",
		],
		garnish: "お好みでレモンスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "long-island-iced-tea.jpg",
	},
	{
		name: "マイタイ",
		description:
			"ラムとライム、オレンジの香りが広がる、トロピカルで甘酸っぱい人気カクテル。",
		ingredients: [
			{ name: "ゴールド・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "ダーク・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "キュラソー", amount: "15ml", category: "混成酒" },
			{ name: "オルジェー・シロップ", amount: "15ml", category: "その他" },
			{ name: "ライム・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "7.5ml", category: "その他" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクしてグラスに注ぎます。",
		],
		garnish: "パイナップルの茎、ミントの葉、ライムの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mai-tai.jpg",
	},
	{
		name: "マルガリータ",
		description:
			"テキーラとライムの酸味が爽やかな、塩のアクセントが印象的な定番カクテル。",
		ingredients: [
			{ name: "テキーラ", amount: "50ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "20ml", category: "混成酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクして冷やしたグラスに注ぎます。",
		],
		garnish: "お好みで、グラスの縁の半分に塩をつけます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "margarita.jpg",
	},
	{
		name: "ミモザ",
		description:
			"オレンジ・ジュースとスパークリングワインを合わせた、朝にもぴったりの軽やかな一杯。",
		ingredients: [
			{
				name: "オレンジ・ジュース",
				amount: "75ml",
				category: "ノンアルコール",
			},
			{ name: "プロセッコ", amount: "75ml", category: "醸造酒" },
		],
		instructions: [
			"グラスにオレンジ・ジュースを注ぎ、プロセッコを静かに注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "お好みでオレンジの皮をねじったものを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mimosa.jpg",
	},
	{
		name: "ミント・ジュレップ",
		description:
			"ミントの香りが清涼感を添える、バーボンベースの爽やかなアメリカ南部のカクテル。",
		ingredients: [
			{ name: "バーボン・ウイスキー", amount: "60ml", category: "蒸留酒" },
			{ name: "ミントの小枝", amount: "4本", category: "その他" },
			{ name: "砂糖", amount: "小さじ1杯", category: "その他" },
			{ name: "水", amount: "小さじ2杯", category: "ノンアルコール" },
		],
		instructions: [
			"グラスにミント、砂糖、水を入れて軽く混ぜます。",
			"砕いた氷を入れ、バーボンを加えて、カップが凍るまでよくかき混ぜます。",
		],
		garnish: "ミントの小枝を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mint-julep.jpg",
	},
	{
		name: "モヒート",
		description:
			"ミントとライムの香りが広がる、夏に人気のすっきりとしたラムカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "20ml", category: "ノンアルコール" },
			{ name: "ミントの小枝", amount: "6本", category: "その他" },
			{ name: "砂糖", amount: "小さじ2杯", category: "その他" },
			{ name: "炭酸水", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"ミントの小枝を砂糖とライム・ジュースと混ぜます。",
			"少量の炭酸水を加え、グラスに氷を入れます。",
			"ホワイト・ラムを注ぎ、炭酸水を注ぎます。軽く混ぜてすべての材料を混ぜ合わせます。",
		],
		garnish: "ミントの小枝とライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mojito.jpg",
	},
	{
		name: "モスコミュール",
		description:
			"ウォッカとジンジャービールを組み合わせた、さっぱりとした辛口の定番カクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml", category: "蒸留酒" },
			{ name: "ジンジャービール", amount: "120ml", category: "ノンアルコール" },
			{ name: "ライム・ジュース", amount: "10ml", category: "ノンアルコール" },
		],
		instructions: [
			"グラスにウォッカとジンジャービールを混ぜます。",
			"ライム・ジュースを加え、すべての材料が混ざるまで軽くかき混ぜます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "moscow-mule.jpg",
	},
	{
		name: "ピニャ・コラーダ",
		description:
			"パイナップルとココナッツの甘い香りが南国気分を誘う、トロピカルなカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "50ml", category: "蒸留酒" },
			{ name: "ココナッツクリーム", amount: "30ml", category: "その他" },
			{
				name: "パイナップル・ジュース",
				amount: "50ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"すべての材料と氷を混ぜます。",
			"大きなグラスに注ぎ、ストローを添えて提供します。",
		],
		garnish: "パイナップルのスライスとカクテルチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "pina-colada.jpg",
	},
	{
		name: "ピスコ・サワー",
		description:
			"ピスコとレモンを合わせた、軽い酸味とまろやかな口当たりが特徴の南米生まれのカクテル。",
		ingredients: [
			{ name: "ピスコ", amount: "60ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "20ml", category: "その他" },
			{ name: "卵白", amount: "1個", category: "その他" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクして冷やしたグラスに注ぎます。",
		],
		garnish: "香り豊かな飾りとして、ビターズを数滴上に振りかけます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "pisco-sour.jpg",
	},
	{
		name: "ラボ・デ・ガロ",
		description:
			"カシャッサとベルモットを合わせた、ほんのり苦味とコクのあるブラジル生まれのカクテル。",
		ingredients: [
			{ name: "カシャッサ", amount: "60ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "20ml", category: "醸造酒" },
			{ name: "チナール", amount: "15ml", category: "混成酒" },
			{
				name: "アンゴスチュラ・ビターズ",
				amount: "お好みで2滴",
				category: "混成酒",
			},
		],
		instructions: ["グラスにすべての材料を入れ、氷を加えて軽くかき混ぜます。"],
		garnish: "オレンジの皮をねじったものを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "rabo-de-galo.jpg",
	},
	{
		name: "シー・ブリーズ",
		description:
			"ウォッカにクランベリーとグレープフルーツを合わせた、軽くてさっぱりとしたフルーティーな一杯。",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml", category: "蒸留酒" },
			{
				name: "クランベリー・ジュース",
				amount: "120ml",
				category: "ノンアルコール",
			},
			{
				name: "グレープフルーツ・ジュース",
				amount: "30ml",
				category: "ノンアルコール",
			},
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "オレンジの皮とチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "sea-breeze.jpg",
	},
	{
		name: "セックス・オン・ザ・ビーチ",
		description:
			"オレンジとクランベリーが調和した、甘酸っぱく飲みやすい人気のカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml", category: "蒸留酒" },
			{ name: "シュナップス", amount: "20ml", category: "蒸留酒" },
			{
				name: "オレンジ・ジュース",
				amount: "40ml",
				category: "ノンアルコール",
			},
			{
				name: "クランベリー・ジュース",
				amount: "40ml",
				category: "ノンアルコール",
			},
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "オレンジの半分のスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "sex-on-the-beach.jpg",
	},
	{
		name: "シンガポール・スリング",
		description:
			"ジンとチェリーリキュールを使い、甘酸っぱくトロピカルな味わいが楽しめるシンガポールの定番カクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "モラッコ・チェリー", amount: "15ml", category: "混成酒" },
			{ name: "コアントロー", amount: "7.5ml", category: "混成酒" },
			{ name: "ベネディクティン", amount: "7.5ml", category: "混成酒" },
			{
				name: "パイナップル・ジュース",
				amount: "120ml",
				category: "ノンアルコール",
			},
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "グレナデン・シロップ", amount: "10ml", category: "その他" },
			{ name: "アンゴスチュラ・ビターズ", amount: "1振", category: "混成酒" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"よく振ってください。",
			"グラスに注ぎます。",
		],
		garnish: "パイナップルとマラスキーノチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "singapore-sling.jpg",
	},
	{
		name: "テキーラ・サンライズ",
		description:
			"オレンジ・ジュースとグレナデンで朝焼けのような色を表現した、甘く爽やかなテキーラカクテル。",
		ingredients: [
			{ name: "テキーラ", amount: "45ml", category: "蒸留酒" },
			{
				name: "オレンジ・ジュース",
				amount: "90ml",
				category: "ノンアルコール",
			},
			{ name: "グレナデン・シロップ", amount: "15ml", category: "その他" },
		],
		instructions: [
			"氷を入れたグラスにテキーラとオレンジ・ジュースを直接注ぎます。",
			"グレナデン・シロップを加えて色彩効果を作りますが、かき混ぜないでください。",
		],
		garnish: "オレンジの半分のスライスまたはオレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "tequila-sunrise.jpg",
	},
	{
		name: "ヴェスパー",
		description:
			"ジンとウォッカをブレンドした、キリッとした味わいが特徴の映画「007」で知られるカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "ウォッカ", amount: "15ml", category: "蒸留酒" },
			{ name: "リレ・ブラン", amount: "7.5ml", category: "醸造酒" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"シェイクして冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "vesper.jpg",
	},
	{
		name: "ゾンビ",
		description:
			"ラムを贅沢に使った濃厚なトロピカルカクテルで、甘く力強い味わいが楽しめる。",
		ingredients: [
			{ name: "ダーク・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "ゴールド・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "デメララ・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "20ml", category: "ノンアルコール" },
			{ name: "ファレナム", amount: "15ml", category: "混成酒" },
			{ name: "ドンズ・ミックス", amount: "15ml", category: "その他" },
			{ name: "グレナデン・シロップ", amount: "小さじ1杯", category: "その他" },
			{ name: "アンゴスチュラ・ビターズ", amount: "1振", category: "混成酒" },
			{ name: "ペルノ", amount: "6滴", category: "混成酒" },
		],
		instructions: [
			"すべての材料を砕いた氷と一緒にかき混ぜます。",
			"グラスに注ぎます",
		],
		garnish: "ミントの葉を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "zombie.jpg",
	},
];

const newEra: CocktailData[] = [
	{
		name: "ビーズ・ニーズ",
		description:
			"レモンとハチミツの優しい甘みとジンの爽やかさが調和した、軽やかな現代風カクテル。",
		ingredients: [
			{ name: "ジン", amount: "52.5ml", category: "蒸留酒" },
			{ name: "ハチミツ・シロップ", amount: "小さじ2杯", category: "その他" },
			{
				name: "レモン・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{
				name: "オレンジ・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"ハチミツ・シロップ、レモン・ジュース、オレンジ・ジュースを溶けるまでかき混ぜ、ジンを加えて氷と一緒にシェイクします。冷やしたグラスに注ぎます。",
		],
		garnish: "お好みでレモンまたはオレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "bees-knees.jpg",
	},
	{
		name: "ブランブル",
		description:
			"ジンにブラックベリーのリキュールを加えて、果実の風味が豊かで飲みやすいモダンな一杯。",
		ingredients: [
			{ name: "ジン", amount: "50ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "25ml", category: "ノンアルコール" },
			{ name: "シュガー・シロップ", amount: "12.5ml", category: "その他" },
			{
				name: "クレーム・ド・ミュール",
				amount: "15ml",
				category: "混成酒",
			},
		],
		instructions: [
			"クレーム・ド・ミュール以外のすべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、砕いた氷を入れた冷やしたグラスに濾し、クレーム・ド・ミュールを円を描くようにドリンクの上から注ぎます。",
		],
		garnish: "お好みでレモンスライスとブラックベリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "bramble.jpg",
	},
	{
		name: "カンチャンチャラ",
		description:
			"ライムとハチミツを使い、蒸留酒で仕上げた、シンプルで爽快な南国テイストのカクテル。",
		ingredients: [
			{ name: "アグアルディエンテ", amount: "60ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "ハチミツ", amount: "15ml", category: "その他" },
			{ name: "水", amount: "50ml", category: "ノンアルコール" },
		],
		instructions: [
			"ハチミツを水とライム・ジュースと混ぜ、グラスの底と側面に塗ります。",
			"砕いた氷を加え、次にアグアルディエンテを加えます。",
			"最後に下から上に向かって勢いよくかき混ぜます。",
		],
		garnish: "ライムのくし切りを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "canchanchara.jpg",
	},
	{
		name: "シャルトリューズ・スウィズル",
		description:
			"ハーブ香るリキュールとパイナップル果汁を組み合わせた、南国感と個性的な香りが響く一杯。",
		ingredients: [
			{ name: "シャルトリューズ", amount: "45ml", category: "混成酒" },
			{
				name: "パイナップル・ジュース",
				amount: "30ml",
				category: "ノンアルコール",
			},
			{
				name: "ライム・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "ファレナム", amount: "15ml", category: "混成酒" },
		],
		instructions: [
			"すべての材料をグラスに注ぎ、氷を加えます。",
			"勢いよく混ぜ、グラスにさらに氷を入れて完成です。",
		],
		garnish: "ミントの葉とすりおろしたナツメグを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "chartreuse-swizzle.jpg",
	},
	{
		name: "ダーク・アンド・ストーミー",
		description:
			"ラムとジンジャービールの組み合わせが生み出す、辛口ながらリラックスできる現代カクテル。",
		ingredients: [
			{ name: "ゴスリングス・ラム", amount: "60ml", category: "蒸留酒" },
			{ name: "ジンジャービール", amount: "100ml", category: "ノンアルコール" },
		],
		instructions: [
			"氷を入れたグラスにジンジャービールを注ぎ、その上にラムを浮かべます。",
		],
		garnish: "ライムのくし切りまたはスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "dark-n-stormy.jpg",
	},
	{
		name: "ドンズ・スペシャル・ダイキリ",
		description:
			"ラムとライムにパイナップルを加えた、南国らしい甘酸っぱく軽やかなトロピカルカクテル。",
		ingredients: [
			{ name: "ゴールド・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "キューバ産ラム", amount: "15ml", category: "蒸留酒" },
			{
				name: "パッションフルーツ・シロップ",
				amount: "15ml",
				category: "その他",
			},
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "ハチミツ・シロップ", amount: "15ml", category: "その他" },
		],
		instructions: [
			"砕いた氷と一緒にかき混ぜ、グラスに注ぎます。",
			"グラスに砕いた氷をさらに注ぎます。",
		],
		garnish: "パッションフルーツ1/2個を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "dons-special-daiquiri.jpg",
	},
	{
		name: "エスプレッソ・マティーニ",
		description:
			"コーヒーの香りとウォッカのキレが合わさった、夜の時間にぴったりのスタイリッシュな一杯。",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml", category: "蒸留酒" },
			{ name: "カルーア", amount: "30ml", category: "混成酒" },
			{ name: "シュガー・シロップ", amount: "10ml", category: "その他" },
			{ name: "エスプレッソ", amount: "1杯", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "コーヒー豆3粒。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "espresso-martini.jpg",
	},
	{
		name: "フェルナンディート",
		description:
			"フェルネットとコーラを合わせた、ほろ苦く爽快なアルゼンチン生まれのシンプルな一杯。",
		ingredients: [
			{
				name: "フェルネット・ブランカ",
				amount: "50ml",
				category: "混成酒",
			},
			{ name: "コーラ", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"フェルネット・ブランカを氷を入れたグラスに注ぎ、コーラでグラスをいっぱいに満たします。優しくかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "fernandito.jpg",
	},
	{
		name: "フレンチ・マティーニ",
		description:
			"ラズベリーのリキュールとウォッカ、パイナップルの甘みが織りなす、華やかで軽快なカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml", category: "蒸留酒" },
			{
				name: "ラズベリー・リキュール",
				amount: "15ml",
				category: "混成酒",
			},
			{
				name: "パイナップル・ジュース",
				amount: "15ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮からオイルを絞り出し、飲み物に注ぎます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "french-martini.jpg",
	},
	{
		name: "ジン・バジル・スマッシュ",
		description:
			"バジルの爽やかな香りとジンの爽快感が重なった、今風で気軽に楽しめる一杯。",
		ingredients: [
			{ name: "ジン", amount: "60ml", category: "蒸留酒" },
			{
				name: "レモン・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "シュガー・シロップ", amount: "22.5ml", category: "その他" },
			{ name: "イタリアンバジルの葉", amount: "10枚", category: "その他" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"勢いよく振って冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "gin-basil-smash.jpg",
	},
	{
		name: "グラン・マルガリータ",
		description:
			"テキーラとオレンジリキュールの組み合わせにライムを効かせた、特別感のある定番マルガリータの進化版。",
		ingredients: [
			{ name: "テキーラ", amount: "45ml", category: "蒸留酒" },
			{ name: "グラン・マルニエ", amount: "30ml", category: "混成酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
		],
		instructions: [
			"グラスの縁に塩を敷き詰めます。材料をシェイカーに注ぎます。",
			"グラスとシェイカーの両方に氷を入れます。",
			"10秒間強くシェイクし、濾してグラスに注ぎます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "grand-margarita.jpg",
	},
	{
		name: "IBA Tiki",
		description:
			"ラムとトロピカルフルーツを合わせた、明るく甘い香りが広がる南国スタイルのカクテル。",
		ingredients: [
			{
				name: "ハバナ・クラブ プロフンド",
				amount: "30ml",
				category: "蒸留酒",
			},
			{
				name: "ハバナ・クラブ スモーキー",
				amount: "30ml",
				category: "蒸留酒",
			},
			{
				name: "アマレット・リキュール",
				amount: "15ml",
				category: "混成酒",
			},
			{
				name: "フランジェリコ・リキュール",
				amount: "5ml",
				category: "混成酒",
			},
			{
				name: "マラスキーノ・リキュール",
				amount: "5滴",
				category: "混成酒",
			},
			{ name: "パッションフルーツピュレ", amount: "30ml", category: "その他" },
			{
				name: "パイナップル・ジュース",
				amount: "90ml",
				category: "ノンアルコール",
			},
			{ name: "ライム・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "ショウガのスライス", amount: "1枚", category: "その他" },
		],
		instructions: [
			"カクテルシェイカーにジンジブレの薄切りを入れて混ぜ、他の材料をすべて注ぎます。",
			"氷を入れて激しくシェイクします。",
			"氷を入れた冷やしたグラスに注ぎます。",
		],
		garnish: "柑橘類と乾燥パイナップルのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "iba-tiki.jpg",
	},
	{
		name: "イリーガル",
		description:
			"メスカルをベースにした、スモーキーでコクのある深い味わいのモダンカクテル。",
		ingredients: [
			{ name: "メスカル", amount: "30ml", category: "蒸留酒" },
			{ name: "ホワイト・ラム", amount: "15ml", category: "蒸留酒" },
			{ name: "ファレナム", amount: "15ml", category: "混成酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "茶匙1杯",
				category: "混成酒",
			},
			{
				name: "ライム・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "シンプル・シロップ", amount: "15ml", category: "その他" },
			{ name: "卵白", amount: "お好みで数滴", category: "その他" },
		],
		instructions: [
			"すべての材料をシェイカーに注ぎ、氷を入れて勢いよくシェイクします。",
			"冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "illegal.jpg",
	},
	{
		name: "ジャングル・バード",
		description:
			"ラムとカンパリを使い、苦味と甘みのバランスが絶妙なマレーシア発トロピカルカクテル。",
		ingredients: [
			{ name: "ブラックストラップ・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "カンパリ", amount: "22.5ml", category: "混成酒" },
			{
				name: "パイナップル・ジュース",
				amount: "45ml",
				category: "ノンアルコール",
			},
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "シュガー・シロップ", amount: "15ml", category: "その他" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに入れてシェイクします。",
			"氷を入れたグラスに注ぎます。",
		],
		garnish: "パイナップルのくし切りを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "jungle-bird.jpg",
	},
	{
		name: "ミッショナリー・ダウンフォール",
		description:
			"ラムにミントとパイナップルを合わせた、すっきり甘くて香り豊かなフルーツカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "ピーチ・ブランデー", amount: "15ml", category: "混成酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "ハチミツ・シロップ", amount: "30ml", category: "その他" },
			{ name: "ミントの葉", amount: "10枚", category: "その他" },
			{ name: "パイナップルの塊", amount: "3～4個", category: "その他" },
		],
		instructions: ["すべての材料を砕いた氷と一緒に混ぜます。"],
		garnish: "ミントの小枝とパイナップルのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "missionarys-downfall.jpg",
	},
	{
		name: "ネイキッド・アンド・フェイマス",
		description:
			"メスカルとリキュール、ライムの酸味が絶妙に合わさった、力強さと軽さを兼ね備えたモダンカクテル。",
		ingredients: [
			{ name: "メスカル", amount: "22.5ml", category: "蒸留酒" },
			{ name: "シャルトリューズ", amount: "22.5ml", category: "混成酒" },
			{ name: "アペロール", amount: "22.5ml", category: "混成酒" },
			{
				name: "ライム・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "naked-and-famous.jpg",
	},
	{
		name: "ニューヨーク・サワー",
		description:
			"ウイスキーのコクと赤ワインの浮き浮きとした甘さがアクセントとなった、大人向けモダンカクテル。",
		ingredients: [
			{
				name: "ライ・ウイスキー",
				amount: "60ml",
				category: "蒸留酒",
				option_group: 2,
			},
			{
				name: "バーボン・ウイスキー",
				amount: "60ml",
				category: "蒸留酒",
				option_group: 2,
			},
			{ name: "シンプル・シロップ", amount: "22.5ml", category: "その他" },
			{ name: "レモン・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "卵白", amount: "数滴", category: "その他" },
			{ name: "赤ワイン", amount: "15ml", category: "醸造酒" },
		],
		instructions: [
			"すべての材料をシェイカーに注ぎ、氷を入れて勢いよくシェイクします。",
			"氷を入れた冷やしたグラスに注ぎ、ワインを浮かべます。",
		],
		garnish: "レモンまたはオレンジの皮とチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "new-york-sour.jpg",
	},
	{
		name: "オールド・キューバン",
		description:
			"ラムにミントとスパークリングワインを合わせた、上品で華やかな印象のモダンカクテル。",
		ingredients: [
			{ name: "ミントの葉", amount: "6～8枚", category: "その他" },
			{ name: "熟成ラム", amount: "45ml", category: "蒸留酒" },
			{
				name: "ライム・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "シンプル・シロップ", amount: "30ml", category: "その他" },
			{ name: "アンゴスチュラ・ビターズ", amount: "2振", category: "混成酒" },
			{
				name: "シャンパン",
				amount: "60ml",
				category: "醸造酒",
				option_group: 3,
			},
			{
				name: "プロセッコ",
				amount: "60ml",
				category: "醸造酒",
				option_group: 3,
			},
		],
		instructions: [
			"プロセッコ以外の材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
			"プロセッコを注ぎます。",
		],
		garnish: "ミントの葉を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "old-cuban.jpg",
	},
	{
		name: "パロマ",
		description:
			"テキーラとグレープフルーツソーダを使った、さっぱりとした風味で昼から楽しみたくなる一杯。",
		ingredients: [
			{ name: "テキーラ", amount: "50ml", category: "蒸留酒" },
			{ name: "ライム", amount: "5ml", category: "その他" },
			{ name: "塩", amount: "ひとつまみ", category: "その他" },
			{
				name: "ピンクグレープフルーツソーダ",
				amount: "100ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"グラスにテキーラを注ぎ、ライム・ジュースを絞ります。",
			"氷と塩を加え、ピンクグレープフルーツソーダを注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "paloma.jpg",
	},
	{
		name: "ペーパー・プレーン",
		description:
			"バーボンとレモン、アペロールの軽快な組み合わせが、飲みやすくて印象に残る今どきカクテル。",
		ingredients: [
			{ name: "バーボン・ウイスキー", amount: "30ml", category: "蒸留酒" },
			{ name: "アマーロ・ノニーノ", amount: "30ml", category: "混成酒" },
			{ name: "アペロール", amount: "30ml", category: "混成酒" },
			{ name: "レモン・ジュース", amount: "30ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "paper-plane.jpg",
	},
	{
		name: "ペニシリン",
		description:
			"スコッチ・ウイスキー、ハチミツ、ショウガを組み合わせた、温かみと清涼感が風味に広がる一杯。",
		ingredients: [
			{ name: "スコッチ・ウイスキー", amount: "60ml", category: "蒸留酒" },
			{ name: "ラガヴーリン", amount: "7.5ml", category: "蒸留酒" },
			{
				name: "レモン・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "ハチミツ・シロップ", amount: "22.5ml", category: "その他" },
			{
				name: "ショウガのスライス",
				amount: "2～3枚",
				category: "その他",
			},
		],
		instructions: [
			"シェイカーにショウガを入れて混ぜ、ラガヴーリン以外の残りの材料を加えます。",
			"シェイカーに氷を入れてシェイクします。",
			"氷を入れたよく冷やしたグラスに注ぎます。",
			"その上にラガヴーリンを浮かべます。",
		],
		garnish: "砂糖漬けのショウガのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "penicillin.jpg",
	},
	{
		name: "ピスコパンチ",
		description:
			"ピスコとパイナップルの甘酸っぱさが心地よく、まろやかで飲みやすい南米の一杯。",
		ingredients: [
			{ name: "ピスコ", amount: "60ml", category: "蒸留酒" },
			{
				name: "パイナップル・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "シンプル・シロップ", amount: "15ml", category: "その他" },
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "白ワイン", amount: "30ml", category: "醸造酒" },
			{ name: "チョウジ", amount: "3個", category: "その他" },
		],
		instructions: [
			"チョウジを軽くつぶし、ワイン以外の残りの材料を加えます。",
			"勢いよく振って、ダブルストレーナーで濾します。",
			"上にワインを加え、軽くかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "pisco-punch.jpg",
	},
	{
		name: "ポルノスター・マティーニ",
		description:
			"パッションフルーツとバニラが香る、甘く華やかなデザート感覚の人気カクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml", category: "蒸留酒" },
			{
				name: "パッションフルーツ・リキュール",
				amount: "20ml",
				category: "混成酒",
			},
			{ name: "パッションフルーツピュレ", amount: "50ml", category: "その他" },
			{ name: "バニラシュガー", amount: "茶匙2杯", category: "その他" },
			{ name: "シャンパン", amount: "50ml", category: "醸造酒" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスにストレーナーで注ぎます。",
			"シャンパン一杯を添えます。",
		],
		garnish: "パッションフルーツカップと砂糖を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "porn-star-martini.jpg",
	},
	{
		name: "ロシアン・スプリング・パンチ",
		description:
			"ウォッカにレモンとカシスを合わせた、フルーティーで軽快なスパークリングカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "25ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "25ml", category: "ノンアルコール" },
			{ name: "クレーム・ド・カシス", amount: "15ml", category: "混成酒" },
			{ name: "シュガー・シロップ", amount: "10ml", category: "その他" },
			{ name: "スパークリングワイン", amount: "適量", category: "醸造酒" },
		],
		instructions: [
			"スパークリングワイン以外の材料をカクテルシェイカーに注ぎ、氷を入れてよくシェイクし、氷を入れた冷やしたグラスに注ぎます。",
			"スパークリングワインを注ぎます。",
		],
		garnish: "ブラックベリーと、お好みでレモンスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "russian-spring-punch.jpg",
	},
	{
		name: "シェリー・コブラー",
		description:
			"シェリーにオレンジ・レモンと砂糖を合わせた、穏やかな甘さと果実味が魅力の伝統的カクテル。",
		ingredients: [
			{ name: "シェリー", amount: "45ml", category: "醸造酒" },
			{ name: "パロ・コルタド", amount: "45ml", category: "醸造酒" },
			{ name: "砂糖", amount: "小さじ1杯", category: "その他" },
			{ name: "オレンジの輪切り", amount: "1/2個", category: "その他" },
			{ name: "レモンの輪切り", amount: "1/2個", category: "その他" },
		],
		instructions: [
			"シェイカーにシェリー、砂糖、オレンジとレモンを入れ、氷を入れて勢いよくシェイクし、砕いた氷を入れたグラスに注ぎます。",
		],
		garnish: "新鮮なベリー、オレンジとレモンを飾り、ストローを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "sherry-cobbler.jpg",
	},
	{
		name: "サウスサイド",
		description:
			"ミントとレモンが爽やかに香るジンベースのカクテルで、気分をリフレッシュしたい時にぴったり。",
		ingredients: [
			{ name: "ジン", amount: "60ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "15ml", category: "その他" },
			{ name: "ミントの葉", amount: "5～6枚", category: "その他" },
			{ name: "卵白", amount: "お好みで数滴", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスにストレーナーで注ぎます。",
			"注記：卵白を使用する場合は、激しく振ってください。",
		],
		garnish: "ミントの葉を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "south-side.jpg",
	},
	{
		name: "スパイシー・フィフティ",
		description:
			"バニラとハチミツに唐辛子の刺激を効かせた、甘さとスパイスのバランスが楽しい一杯。",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml", category: "蒸留酒" },
			{
				name: "エルダーフラワー・コーディアル",
				amount: "15ml",
				category: "その他",
			},
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "ハチミツ・シロップ", amount: "10ml", category: "その他" },
			{ name: "赤唐辛子薄切り", amount: "2枚", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスにストレーナーで注ぎます。",
		],
		garnish: "赤唐辛子を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spicy-fifty.jpg",
	},
	{
		name: "スプリッツ",
		description:
			"アペロールなどのオレンジ系リキュールとスパークリングを使った、軽やかで華やかな乾杯向けカクテル。",
		ingredients: [
			{ name: "プロセッコ", amount: "90ml", category: "醸造酒" },
			{ name: "アペロール", amount: "60ml", category: "混成酒" },
			{ name: "炭酸水", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"氷を入れたグラスにすべての材料を入れます。",
			"軽くかき混ぜます。",
		],
		garnish: "オレンジのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spritz.jpg",
	},
	{
		name: "サファリング・バスタード",
		description:
			"ジンとブランデーをジンジャービールで割った、スッキリとした辛口の歴史あるカクテル。",
		ingredients: [
			{
				name: "コニャック",
				amount: "30ml",
				category: "蒸留酒",
				option_group: 4,
			},
			{
				name: "ブランデー",
				amount: "30ml",
				category: "蒸留酒",
				option_group: 4,
			},
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "アンゴスチュラ・ビターズ", amount: "2振", category: "混成酒" },
			{ name: "ジンジャービール", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"ジンジャービール以外の材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクします。",
			"濾さずにグラスに注ぎます。",
			"ジンジャービールを注ぎます。",
		],
		garnish: "ミントの葉と、お好みでオレンジのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "suffering-bastard.jpg",
	},
	{
		name: "スリー・ドッツ・アンド・ダッシュ",
		description:
			"ラムとスパイスの香りが調和した、戦時中に生まれた華やかで力強いトロピカルカクテル。",
		ingredients: [
			{ name: "マルティニーク・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "ブレンド熟成ラム", amount: "15ml", category: "蒸留酒" },
			{ name: "ファレナム", amount: "7.5ml", category: "混成酒" },
			{
				name: "セントエリザベス・オールスパイス・ドラム",
				amount: "7.5ml",
				category: "混成酒",
			},
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{
				name: "オレンジ・ジュース",
				amount: "15ml",
				category: "ノンアルコール",
			},
			{ name: "ハチミツ・シロップ", amount: "15ml", category: "その他" },
			{ name: "アンゴスチュラ・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷とともにかき混ぜ、飲み物をグラスに注ぎます。",
			"グラスに砕いた氷をさらに注ぎます。",
		],
		garnish: "チェリーとパイナップルを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "three-dots-and-a-dash.jpg",
	},
	{
		name: "ティペラリー",
		description:
			"アイリッシュ・ウイスキーとベルモットを合わせた、なめらかで少し甘みのある落ち着いたカクテル。",
		ingredients: [
			{
				name: "アイリッシュ・ウイスキー",
				amount: "50ml",
				category: "蒸留酒",
			},
			{ name: "ベルモット", amount: "25ml", category: "醸造酒" },
			{ name: "シャルトリューズ", amount: "15ml", category: "混成酒" },
			{ name: "アンゴスチュラ・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたグラスに注ぎます。",
		],
		garnish: "オレンジのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "tipperary.jpg",
	},
	{
		name: "トミーズ・マルガリータ",
		description:
			"テキーラにライムとアガベ・シロップを加えた、自然な甘みと爽やかさが特徴の新定番カクテル。",
		ingredients: [
			{ name: "テキーラ", amount: "60ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "アガベ・シロップ", amount: "30ml", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、氷を入れた冷やしたグラスに注ぎます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "tommys-margarita.jpg",
	},
	{
		name: "トリニダード・サワー",
		description:
			"ビターズを多く使った独特な苦味と、ナッツの甘みが印象的な個性派カクテル。",
		ingredients: [
			{ name: "アンゴスチュラ・ビターズ", amount: "45ml", category: "混成酒" },
			{ name: "オルジェー・シロップ", amount: "30ml", category: "その他" },
			{
				name: "レモン・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "ライ・ウイスキー", amount: "15ml", category: "蒸留酒" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクします。",
			"冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "trinidad-sour.jpg",
	},
	{
		name: "VE.N.TO",
		description:
			"グラッパとハチミツ、レモンを合わせた、やさしい甘みと爽やかさが広がるイタリアの一杯。",
		ingredients: [
			{ name: "グラッパ", amount: "45ml", category: "蒸留酒" },
			{
				name: "レモン・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
			{ name: "ハチミツ・シロップ", amount: "15ml", category: "その他" },
			{
				name: "カモミール・コーディアル",
				amount: "15ml",
				category: "その他",
			},
			{ name: "卵白", amount: "お好みで数滴", category: "その他" },
		],
		instructions: [
			"すべての材料をシェイカーに注ぎ、氷を入れて勢いよくシェイクします。",
			"氷を入れた冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮と白ブドウを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "ve-n-to.jpg",
	},
];

const unforgettables: CocktailData[] = [
	{
		name: "アレクサンダー",
		description:
			"コニャックとココアリキュールのまろやかな甘さが心地よい、古典的なカクテル。",
		ingredients: [
			{ name: "コニャック", amount: "30ml", category: "蒸留酒" },
			{ name: "クレーム・ド・カカオ", amount: "30ml", category: "混成酒" },
			{ name: "生クリーム", amount: "30ml", category: "その他" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"シェイクして冷やしたグラスに注ぎます。",
		],
		garnish: "ナツメグを上に振りかけます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "alexander.jpg", // R2にアップロードする画像ファイル名
	},
	{
		name: "アメリカーノ",
		description:
			"カンパリと甘いベルモットを炭酸で軽く割った、イタリア発の爽やかなひと口カクテル。",
		ingredients: [
			{ name: "カンパリ", amount: "30ml", category: "混成酒" },
			{ name: "ベルモット", amount: "30ml", category: "醸造酒" },
			{ name: "炭酸水", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"氷を入れたグラスに材料を直接混ぜます。",
			"少量の炭酸水を加え、軽くかき混ぜます。",
		],
		garnish: "オレンジの半分のスライスとレモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "americano.jpg",
	},
	{
		name: "アビエーション",
		description:
			"ジンにマラスキーノとレモンを合わせ、ほのかな花の香りも感じるクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "15ml",
				category: "混成酒",
			},
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
			{
				name: "クレーム・ド・バイオレット",
				amount: "5ml",
				category: "混成酒",
			},
		],
		instructions: [
			"すべての材料をカクテルシェイカーに加えます。",
			"砕いた氷と一緒にシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "お好みでマラスキーノ・チェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "aviation.jpg",
	},
	{
		name: "エンジェル・フェイス",
		description:
			"ジンと杏のリキュール、カルヴァドスを合わせた、果実の香りが立つ古き良き一杯です。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{
				name: "アプリコット・ブランデー",
				amount: "30ml",
				category: "混成酒",
			},
			{ name: "カルヴァドス", amount: "30ml", category: "蒸留酒" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"シェイクして冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "angel-face.jpg",
	},
	{
		name: "ビトウィーン・ザ・シーツ",
		description:
			"ラムとコニャックにレモンを重ねた、軽やかながら力のある古典的なカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "コニャック", amount: "30ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "30ml", category: "混成酒" },
			{ name: "レモン・ジュース", amount: "20ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに加えます。",
			"氷と一緒にシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "between-the-sheets.jpg",
	},
	{
		name: "ブールヴァルディエ",
		description:
			"バーボンとカンパリ、ベルモットという濃厚で大人の味わいが香る、イタリア風の古典カクテル。",
		ingredients: [
			{
				name: "バーボン・ウイスキー",
				amount: "45ml",
				category: "蒸留酒",
				option_group: 1,
			},
			{
				name: "ライ・ウイスキー",
				amount: "45ml",
				category: "蒸留酒",
				option_group: 1,
			},
			{ name: "カンパリ", amount: "30ml", category: "混成酒" },
			{ name: "ベルモット", amount: "30ml", category: "醸造酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたグラスに注ぎます。",
		],
		garnish: "オレンジの皮を添え、お好みでレモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "boulevardier.jpg",
	},
	{
		name: "ブランデー・クラスタ",
		description:
			"ブランデーとチェリーリキュールをレモンと共に使った、アメリカ19世紀由来の上品なカクテル。",
		ingredients: [
			{ name: "ブランデー", amount: "52.5ml", category: "蒸留酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "7.5ml",
				category: "混成酒",
			},
			{ name: "キュラソー", amount: "茶匙1杯", category: "混成酒" },
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "茶匙1杯", category: "その他" },
			{ name: "アロマティック・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷と一緒にミキシンググラスで混ぜます。",
			"グラスに注ぎます。",
		],
		garnish:
			"オレンジ（またはレモン）のスライスをグラスの縁にこすりつけ、砂糖を細かく砕いて、グラスの縁に砂糖がくっつくようにします。オレンジ/レモンの皮をグラスの内側に慎重に丸めて置きます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "brandy-crusta.jpg",
	},
	{
		name: "カジノ",
		description: "ジンとチェリーリキュールにオレンジの酸味を加えた、1900年代初頭生まれのクラシカルな軽めの一杯。",
		ingredients: [
			{ name: "ジン", amount: "40ml", category: "蒸留酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "10ml",
				category: "混成酒",
			},
			{ name: "レモン・ジュース", amount: "10ml", category: "ノンアルコール" },
			{ name: "オレンジ・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"すべての材料をカクテルシェーカーに注ぎ、氷と一緒によくシェイクし、濾します。",
			"氷を入れた冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮とマラスキーノ・チェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "casino.jpg",
	},
	{
		name: "クローバー・クラブ",
		description:
			"ジンにラズベリー・シロップとレモンを合わせ、卵白でなめらかに仕上げた、ゆったり楽しむクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "ラズベリー・シロップ", amount: "15ml", category: "その他" },
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "卵白", amount: "数滴", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "新鮮なラズベリー。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "clover-club.jpg",
	},
	{
		name: "ダイキリ",
		description:
			"キューバ生まれのラムとライム、砂糖を合わせた、誰にも親しみやすいシンプル＆爽やかな定番カクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "60ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "20ml", category: "ノンアルコール" },
			{ name: "砂糖", amount: "茶匙2杯", category: "その他" },
		],
		instructions: [
			"カクテルシェイカーにすべての材料を入れ、よくかき混ぜて砂糖を溶かします。",
			"氷を加えてシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "daiquiri.jpg",
	},
	{
		name: "ドライ・マティーニ",
		description:
			"ジンとベルモット少量で作る、洗練された味わいのバー定番カクテル。",
		ingredients: [
			{ name: "ジン", amount: "60ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "10ml", category: "醸造酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたグラスに注ぎます。",
		],
		garnish:
			"レモンの皮から搾ったオイルをドリンクにかけたり、お好みでグリーンオリーブを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "dry-martini.jpg",
	},
	{
		name: "ジン・フィズ",
		description:
			"ジンとレモン、砂糖に炭酸を加えた、軽やかで泡立つ爽快な古典ドリンク。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "10ml", category: "その他" },
			{ name: "炭酸水", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"炭酸水以外のすべての材料を氷と一緒にシェイクします。",
			"グラスに注ぎ、炭酸水を少し加えます。",
			"注記：氷を入れずにお召し上がりください。",
		],
		garnish: "レモンのスライス、お好みでレモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "gin-fizz.jpg",
	},
	{
		name: "ハンキー・パンキー",
		description:
			"ジンと甘いベルモットをベースに、ほろ苦いフェルネットを加えた、味に深みのある一杯。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "45ml", category: "醸造酒" },
			{ name: "フェルネット", amount: "7.5ml", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたグラスに注ぎます。",
		],
		garnish: "オレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "hanky-panky.jpg",
	},
	{
		name: "ジョン・コリンズ",
		description:
			"ジン、レモン、砂糖、炭酸を合わせた、爽やかで軽快なクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "15ml", category: "その他" },
			{ name: "炭酸水", amount: "60ml", category: "ノンアルコール" },
		],
		instructions: ["氷を入れたグラスに材料をすべて注ぎ、軽く混ぜます。"],
		garnish: "レモンスライスとマラスキーノ・チェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "john-collins.jpg",
	},
	{
		name: "ラスト・ワード",
		description:
			"ジンとシャルトリューズ、チェリーリキュール、ライムを等量で合わせた、特徴的でバランスの良い名作。",
		ingredients: [
			{ name: "ジン", amount: "22.5ml", category: "蒸留酒" },
			{ name: "シャルトリューズ", amount: "22.5ml", category: "混成酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "22.5ml",
				category: "混成酒",
			},
			{
				name: "ライム・ジュース",
				amount: "22.5ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"すべての材料をカクテルシェイカーに加えます。",
			"氷と一緒にシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "last-word.jpg",
	},
	{
		name: "マンハッタン",
		description:
			"ウイスキーと甘いベルモット＋ビターズの組み合わせで、ニューヨークで生まれた洗練されたスタイルのカクテル。",
		ingredients: [
			{ name: "ライ・ウイスキー", amount: "50ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "20ml", category: "醸造酒" },
			{ name: "アンゴスチュラ・ビターズ", amount: "1振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたグラスに注ぎます。",
		],
		garnish: "カクテルチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "manhattan.jpg",
	},
	{
		name: "マルティネス",
		description:
			"ジンと甘いベルモット、チェリーリキュールを使った、マティーニの原型ともいわれる歴史ある一杯。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "45ml", category: "醸造酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "茶匙1杯",
				category: "混成酒",
			},
			{ name: "オレンジ・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "martinez.jpg",
	},
	{
		name: "メアリー・ピックフォード",
		description:
			"ホワイト・ラムにパイナップル・ジュースとグレナデンを加えた、同名の女優にちなんで名付けられた軽やかなカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "45ml", category: "蒸留酒" },
			{
				name: "パイナップル・ジュース",
				amount: "45ml",
				category: "ノンアルコール",
			},
			{
				name: "マラスキーノ・リキュール",
				amount: "7.5ml",
				category: "混成酒",
			},
			{ name: "グレナデン・シロップ", amount: "5ml", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "mary-pickford.jpg",
	},
	{
		name: "モンキー・グランド",
		description:
			"ジンにオレンジとグレナデンを加えた、1920年代のパリ発祥とされる遊び心あるクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{
				name: "オレンジ・ジュース",
				amount: "45ml",
				category: "ノンアルコール",
			},
			{ name: "アブサン", amount: "茶匙1杯", category: "混成酒" },
			{ name: "グレナデン・シロップ", amount: "茶匙1杯", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "monkey-gland.jpg",
	},
	{
		name: "ネグローニ",
		description:
			"ジン、カンパリ、甘いベルモットを同量で作る、イタリアで生まれた苦味と甘みが絶妙な定番カクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "カンパリ", amount: "30ml", category: "混成酒" },
			{ name: "ベルモット", amount: "30ml", category: "醸造酒" },
		],
		instructions: [
			"氷を入れた冷やしたグラスにすべての材料を直接注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "オレンジの半分のスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "negroni.jpg",
	},
	{
		name: "オールド・ファッションド",
		description:
			"ウイスキーに砂糖とビターズを加えた、シンプルで力強い味わいの王道カクテル。",
		ingredients: [
			{
				name: "バーボン・ウイスキー",
				amount: "45ml",
				category: "蒸留酒",
				option_group: 1,
			},
			{
				name: "ライ・ウイスキー",
				amount: "45ml",
				category: "蒸留酒",
				option_group: 1,
			},
			{ name: "角砂糖", amount: "1個", category: "その他" },
			{ name: "アンゴスチュラ・ビターズ", amount: "数振", category: "混成酒" },
			{ name: "水", amount: "数振", category: "ノンアルコール" },
		],
		instructions: [
			"角砂糖をグラスに入れ、ビターズで十分に浸し、少量の水を加えます。溶けるまで混ぜます。グラスに氷を入れ、ウイスキーを注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "オレンジのスライスまたは皮とカクテルチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "old-fashioned.jpg",
	},
	{
		name: "パラダイス",
		description:
			"ジンとアプリコット・ブランデーにオレンジを合わせた、やわらかく華やかな香りのカクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{
				name: "アプリコット・ブランデー",
				amount: "20ml",
				category: "混成酒",
			},
			{
				name: "オレンジ・ジュース",
				amount: "15ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "paradise.jpg",
	},
	{
		name: "プランターズ・パンチ",
		description:
			"ラムとトロピカル・ジュースを使った、南国らしい甘酸っぱく陽気なカクテル。",
		ingredients: [
			{ name: "ジャマイカ産ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{
				name: "サトウキビ・ジュース",
				amount: "30ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"すべての材料をグラスに直接注ぎます。",
			"注記：お好みに応じて水や氷、フレッシュ・ジュースなどで割ってお召し上がりください。",
		],
		garnish: "オレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "planters-punch.jpg",
	},
	{
		name: "ポート・フリップ",
		description:
			"ポートワインに卵を加えた、まろやかでコクのあるデザート風カクテル。",
		ingredients: [
			{ name: "ブランデー", amount: "15ml", category: "蒸留酒" },
			{ name: "ポートワイン", amount: "45ml", category: "醸造酒" },
			{ name: "卵黄", amount: "10ml", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "ナツメグを振りかける。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "porto-flip.jpg",
	},
	{
		name: "ラモス・フィズ",
		description:
			"ジンとレモン、クリームを泡立てた、なめらかで軽やかな口当たりの老舗カクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "ライム・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "レモン・ジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "シュガー・シロップ", amount: "30ml", category: "その他" },
			{ name: "生クリーム", amount: "60ml", category: "その他" },
			{ name: "卵白", amount: "30ml", category: "その他" },
			{ name: "オレンジフラワーウォーター", amount: "3振", category: "その他" },
			{ name: "バニラエッセンス", amount: "2滴", category: "その他" },
			{ name: "炭酸水", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"炭酸水以外の材料を氷を入れたカクテルシェイカーに注ぎます。",
			"2分間シェイクし、グラスにストレーナーで濾し、ドリンクをシェイカーに戻し、氷を入れずに1分間激しくシェイクします。",
			"グラスに注ぎ、炭酸水を注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "ramos-fizz.jpg",
	},
	{
		name: "リメンバー・ザ・メイン",
		description:
			"ライ・ウイスキー、チェリー・ブランデー、ベルモット、アブサンを使った、伝説的な味わいの一杯。",
		ingredients: [
			{ name: "ライ・ウイスキー", amount: "60ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "22.5ml", category: "醸造酒" },
			{ name: "チェリー・ブランデー", amount: "15ml", category: "混成酒" },
			{ name: "アブサン", amount: "7.5ml", category: "混成酒" },
		],
		instructions: [
			"アブサンをグラスに注ぎ、内側が完全に覆われるまで回します。",
			"アブサンを捨て、グラスを脇に置きます。残りの材料をミキシンググラスに入れ、氷を4分の3まで入れます。冷えるまでかき混ぜ、アブサンで冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "remember-the-maine.jpg",
	},
	{
		name: "ラスティ・ネイル",
		description:
			"スコッチとドランブイの蜂蜜のような甘みが溶け合う、穏やかで深みのあるカクテル。",
		ingredients: [
			{ name: "スコッチ・ウイスキー", amount: "45ml", category: "蒸留酒" },
			{ name: "ドランブイ", amount: "25ml", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたグラスに直接注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "rusty-nail.jpg",
	},
	{
		name: "サゼラック",
		description:
			"コニャックとアブサン、ビターズを使った、香り高くスパイシーなニューオーリンズの名作。",
		ingredients: [
			{ name: "コニャック", amount: "50ml", category: "蒸留酒" },
			{ name: "アブサン", amount: "10ml", category: "混成酒" },
			{ name: "角砂糖", amount: "1個", category: "その他" },
			{ name: "ペイショーズ・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"冷やしたグラスをアブサンで洗い、砕いた氷を加えて脇に置きます。残りの材料をミキシンググラスに氷を入れ、かき混ぜます。",
			"用意したグラスから氷と余分なアブサンを取り除き、混ぜた飲み物をグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "sazerac.jpg",
	},
	{
		name: "サイドカー",
		description:
			"ブランデーにオレンジリキュールとレモンを合わせた、バランスの良い酸味と甘みのクラシックカクテル。",
		ingredients: [
			{ name: "コニャック", amount: "50ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "20ml", category: "混成酒" },
			{ name: "レモン・ジュース", amount: "20ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "sidecar.jpg",
	},
	{
		name: "スティンガー",
		description:
			"ブランデーにクレーム・ド・ミントを合わせた、清涼感のある食後にぴったりのカクテル。",
		ingredients: [
			{ name: "コニャック", amount: "50ml", category: "蒸留酒" },
			{ name: "クレーム・ド・ミント", amount: "20ml", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたグラスに注ぎます。",
		],
		garnish: "お好みでミントの葉を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "stinger.jpg",
	},
	{
		name: "タキシード",
		description:
			"ジンとベルモットをベースに、ほのかに甘く香る上品なクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "30ml", category: "醸造酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "茶匙1/2杯",
				category: "混成酒",
			},
			{ name: "アブサン", amount: "茶匙1/4杯", category: "混成酒" },
			{ name: "オレンジ・ビターズ", amount: "3振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたグラスに注ぎます。",
		],
		garnish: "チェリーとレモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "tuxedo.jpg",
	},
	{
		name: "ヴュー・カレ",
		description:
			"ウイスキーとコニャック、ベルモットが溶け合う、重厚で香り豊かなニューオーリンズ発の一杯。",
		ingredients: [
			{ name: "ライ・ウイスキー", amount: "30ml", category: "蒸留酒" },
			{ name: "コニャック", amount: "30ml", category: "蒸留酒" },
			{ name: "ベルモット", amount: "30ml", category: "醸造酒" },
			{ name: "ベネディクティン", amount: "茶匙1杯", category: "混成酒" },
			{ name: "ペイショーズ・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたグラスに注ぎます。",
		],
		garnish: "オレンジの皮とマラスキーノチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "vieux-carre.jpg",
	},
	{
		name: "ウィスキー・サワー",
		description:
			"ウイスキーとレモン、砂糖を合わせた、爽やかな酸味と甘みが調和した定番カクテル。",
		ingredients: [
			{ name: "バーボン・ウイスキー", amount: "45ml", category: "蒸留酒" },
			{ name: "レモン・ジュース", amount: "25ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "20ml", category: "その他" },
			{ name: "卵白", amount: "お好みで数滴", category: "その他" },
		],
		instructions: [
			"氷を入れたカクテルシェイカーにすべての材料を注ぎ、よくシェイクします。",
			"グラスに濾します。",
			"氷が入ったグラスに注ぎます。",
			"注記：卵白を使用する場合は、卵白の泡を出して混ぜ合わせるために、少し強く振ってください。",
		],
		garnish:
			"オレンジのスライス半分とマラスキーノチェリーを飾り、お好みでオレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "whiskey-sour.jpg",
	},
	{
		name: "ホワイト・レディ",
		description:
			"ジンとレモン、オレンジリキュールを合わせた、キリッとした酸味が心地よい上品なカクテル。",
		ingredients: [
			{ name: "ジン", amount: "40ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "30ml", category: "混成酒" },
			{ name: "レモン・ジュース", amount: "20ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "white-lady.jpg",
	},
];

const ingredientDetails: Record<
	string,
	{ group: string; description: string }
> = {
	// 醸造酒
	"白ワイン": {
		group: "ワイン",
		description:
			"白ブドウを主原料として造られるワイン。すっきりとした酸味が特徴です。",
	},
	"赤ワイン": {
		group: "ワイン",
		description:
			"黒ブドウを主原料として造られるワイン。豊かな渋みとコクが特徴です。",
	},
	"スパークリングワイン": {
		group: "ワイン",
		description: "炭酸ガスを含む発泡性のワインの総称です。",
	},
	"シェリー": {
		group: "ワイン",
		description:
			"スペインのアンダルシア地方で造られる、アルコールを添加されたワインです。",
	},
	"シャンパン": {
		group: "ワイン",
		description:
			"フランスのシャンパーニュ地方で造られる高品質なスパークリングワインです。",
	},
	"ポートワイン": {
		group: "ワイン",
		description:
			"ポルトガルのドウロ地方で造られる、甘口のアルコールを添加されたワインです。",
	},
	"ベルモット": {
		group: "ワイン",
		description:
			"白ワインをベースにニガヨモギなどの香草やスパイスを加えて風味を付けたフレーバードワインです。",
	},
	"プロセッコ": {
		group: "ワイン",
		description:
			"イタリアのヴェネト州などで造られる、フルーティーで爽やかなスパークリングワインです。",
	},
	"リレ・ブラン": {
		group: "ワイン",
		description:
			"フランス・ボルドー地方で造られる、白ワインをベースにしたアペリティフ（食前酒）です。",
	},
	"パロ・コルタド": {
		group: "ワイン",
		description:
			"スペイン・アンダルシア地方のシェリーの一種で、非常に珍しいタイプのワインです。",
	},
	// 蒸留酒
	"ラム": {
		group: "ラム",
		description: "サトウキビを原料とする蒸留酒。甘く豊かな風味が特徴です。",
	},
	"ホワイト・ラム": {
		group: "ラム",
		description:
			"活性炭でろ過した無色透明のラム。カクテルのベースとして広く使われます。",
	},
	"ダーク・ラム": {
		group: "ラム",
		description:
			"内側を焦がした樽で長期間熟成させたラム。濃厚な風味とコクが特徴です。",
	},
	"ゴールド・ラム": {
		group: "ラム",
		description:
			"樽で短期間熟成させた琥珀色のラム。ホワイトラムより風味が豊かです。",
	},
	"デメララ・ラム": {
		group: "ラム",
		description:
			"ガイアナのデメララ川沿いで造られる、リッチで重厚な風味のラムです。",
	},
	"マルティニーク・ラム": {
		group: "ラム",
		description:
			"フランス海外県のマルティニーク島で造られる、サトウキビジュースを直接発酵・蒸留したラムです。",
	},
	"ブレンド熟成ラム": {
		group: "ラム",
		description:
			"異なる熟成年数や産地のラムをブレンドした、複雑な味わいのラムです。",
	},
	"熟成ラム": {
		group: "ラム",
		description:
			"樽で熟成させたラムの総称。豊かな香りとまろやかな口当たりが特徴です。",
	},
	"キューバ産ラム": {
		group: "ラム",
		description:
			"キューバで生産されるラム。軽やかで洗練された味わいが特徴です。",
	},
	"ジャマイカ産ラム": {
		group: "ラム",
		description:
			"ジャマイカで生産されるラム。力強くファンキーな香りが特徴です。",
	},
	"ゴスリングス・ラム": {
		group: "ラム",
		description:
			"バミューダ諸島原産のダーク・ラム。ダーク＆ストーミーというカクテルの公式ラムとして知られています。",
	},
	"ハバナ・クラブ プロフンド": {
		group: "ラム",
		description:
			"キューバのラムブランド「ハバナ・クラブ」の特定のラインナップです。",
	},
	"ハバナ・クラブ スモーキー": {
		group: "ラム",
		description:
			"キューバのラムブランド「ハバナ・クラブ」のスモーキーな風味を持つラインナップです。",
	},
	"ブラックストラップ・ラム": {
		group: "ラム",
		description:
			"糖蜜を3回煮詰めた後の「ブラックストラップ・モラセス」から造られる、非常に濃厚で風味豊かなラムです。",
	},
	"ジン": {
		group: "ジン",
		description:
			"ジュニパーベリーを主原料とする蒸留酒。爽やかな香りが特徴です。",
	},
	"ウォッカ": {
		group: "ウォッカ",
		description:
			"穀物やジャガイモを原料とする蒸留酒。クリアでニュートラルな味わいです。",
	},
	"テキーラ": {
		group: "テキーラ",
		description:
			"リュウゼツランを原料とするメキシコ産蒸留酒。独特の風味が魅力です。",
	},
	"カルヴァドス": {
		group: "ブランデー",
		description:
			"フランスのノルマンディー地方で造られる、リンゴを原料としたブランデーです。",
	},
	"ブランデー": {
		group: "ブランデー",
		description:
			"果実を原料とする蒸留酒。特にブドウから作られるものが有名です。",
	},
	"コニャック": {
		group: "ブランデー",
		description: "フランスのコニャック地方で造られる高品質なブランデーです。",
	},
	"ピスコ": {
		group: "ブランデー",
		description:
			"ペルーやチリで造られるブドウの蒸留酒。フルーティーな香りが特徴です。",
	},
	"グラッパ": {
		group: "ブランデー",
		description:
			"イタリアで造られる、ワインの醸造で残ったブドウの搾りかすを蒸留して造るお酒です。",
	},
	"ライ・ウイスキー": {
		group: "ウイスキー",
		description:
			"ライ麦を主原料とするウイスキー。スパイシーでドライな味わいが特徴です。",
	},
	"スコッチ・ウイスキー": {
		group: "ウイスキー",
		description:
			"スコットランドで造られるウイスキー。スモーキーな風味を持つものもあります。",
	},
	"アイリッシュ・ウイスキー": {
		group: "ウイスキー",
		description:
			"アイルランドで造られるウイスキー。滑らかでまろやかな味わいが特徴です。",
	},
	"バーボン・ウイスキー": {
		group: "ウイスキー",
		description:
			"アメリカで造られる、トウモロコシを主原料とするウイスキー。甘く香ばしい風味が特徴です。",
	},
	"ラガヴーリン": {
		group: "ウイスキー",
		description:
			"スコットランドのアイラ島で造られる、非常にスモーキーでピーティーなシングルモルトスコッチウイスキーです。",
	},
	"カシャッサ": {
		group: "その他の蒸留酒",
		description:
			"ブラジルで造られる、サトウキビのジュースを直接発酵・蒸留したスピリッツです。",
	},
	"アグアルディエンテ": {
		group: "その他の蒸留酒",
		description:
			"ラテンアメリカ諸国で造られるサトウキビなどを原料とした蒸留酒の総称です。",
	},
	"メスカル": {
		group: "その他の蒸留酒",
		description:
			"メキシコで造られるリュウゼツランを原料とした蒸留酒。スモーキーな風味が特徴です。",
	},
	"シュナップス": {
		group: "その他の蒸留酒",
		description:
			"ドイツや北欧で造られる蒸留酒の総称。フルーツやハーブなど様々な風味があります。",
	},
	// 混成酒
	"マラスキーノ・リキュール": {
		group: "リキュール",
		description:
			"マラスカ種のチェリーを原料とした、甘くほろ苦い風味のリキュールです。",
	},
	"ラズベリー・リキュール": {
		group: "リキュール",
		description:
			"ラズベリーを漬け込んで造られる、甘酸っぱい風味のリキュールです。",
	},
	"アマレット・リキュール": {
		group: "リキュール",
		description:
			"杏の核（杏仁）を原料とした、アーモンドのような甘く香ばしい風味のリキュールです。",
	},
	"フランジェリコ・リキュール": {
		group: "リキュール",
		description:
			"ヘーゼルナッツを主原料とした、香ばしく甘いイタリア産リキュールです。",
	},
	"パッションフルーツ・リキュール": {
		group: "リキュール",
		description:
			"パッションフルーツの果汁から造られる、トロピカルで甘酸っぱいリキュールです。",
	},
	"チェリー・ブランデー": {
		group: "リキュール",
		description:
			"チェリーを蒸留または漬け込んで造られる、芳醇な果実香を持つリキュール。ブランデーをベースにしたタイプもあります。",
	},
	"アプリコット・ブランデー": {
		group: "リキュール",
		description:
			"杏の果実を原料にした、果実味豊かでコクのあるリキュール。ブランデーをベースにしたタイプもあります。",
	},
	"ピーチ・ブランデー": {
		group: "リキュール",
		description:
			"桃の果実を用いて造られる、華やかな香りとまろやかな甘みを持つリキュール。ブランデーをベースにしたタイプもあります。",
	},
	"クレーム・ド・バイオレット": {
		group: "リキュール",
		description:
			"スミレの花を漬け込んで造られる、華やかな香りのリキュールです。",
	},
	"クレーム・ド・カカオ": {
		group: "リキュール",
		description: "カカオ豆を原料とした、チョコレート風味の甘いリキュールです。",
	},
	"クレーム・ド・ミント": {
		group: "リキュール",
		description:
			"ミント（ハッカ）を原料とした、爽やかな清涼感のあるリキュールです。",
	},
	"クレーム・ド・カシス": {
		group: "リキュール",
		description:
			"カシス（クロスグリ）を原料とした、甘酸っぱく濃厚なリキュールです。",
	},
	"クレーム・ド・ミュール": {
		group: "リキュール",
		description: "ブラックベリーを原料とした、甘酸っぱい風味のリキュールです。",
	},
	"グラン・マルニエ": {
		group: "リキュール",
		description:
			"コニャックにビターオレンジの蒸留エキスを加えた、フランス産の高級オレンジリキュールです。",
	},
	"ペルノ": {
		group: "リキュール",
		description:
			"アニスやハーブを主原料とした、フランス産のリキュール。水を加えると白濁します。",
	},
	"アブサン": {
		group: "リキュール",
		description:
			"ニガヨモギやアニスなどを主原料とした、ハーブ系のリキュール。独特の風味が特徴です。",
	},
	"カンパリ": {
		group: "リキュール",
		description:
			"ビターオレンジや様々なハーブ、スパイスを配合して造られる、鮮やかな赤色と苦味が特徴のイタリア産リキュールです。",
	},
	"トリプルセック": {
		group: "リキュール",
		description:
			"オレンジの果皮を原料とした、無色透明でドライな風味のオレンジリキュールです。",
	},
	"キュラソー": {
		group: "リキュール",
		description:
			"オレンジの果皮を原料としたリキュール。青やオレンジなど様々な色があります。",
	},
	"フェルネット": {
		group: "リキュール",
		description:
			"薬草やスパイスをベースにしたイタリアの苦味酒（アマーロ）の一種です。",
	},
	"ドランブイ": {
		group: "リキュール",
		description:
			"スコッチウイスキーをベースに、ヒースの花の蜂蜜やハーブを加えたスコットランド産リキュールです。",
	},
	"ベネディクティン": {
		group: "リキュール",
		description:
			"27種類のハーブとスパイスから造られる、フランス産のハーブ系リキュールです。",
	},
	"コアントロー": {
		group: "リキュール",
		description:
			"ビターオレンジとスイートオレンジの果皮から造られる、フランス産の高品質なトリプルセックです。",
	},
	"アマレット": {
		group: "リキュール",
		description:
			"杏の核（杏仁）を原料とした、アーモンドのような甘く香ばしい風味のリキュールです。",
	},
	"チナール": {
		group: "リキュール",
		description:
			"アーティチョーク（チョウセンアザミ）を含む13種類のハーブから造られるイタリアの苦味酒（アマーロ）です。",
	},
	"モラッコ・チェリー": {
		group: "リキュール",
		description: "チェリーを原料としたリキュールの一種です。",
	},
	"ファレナム": {
		group: "リキュール",
		description:
			"アーモンド、ジンジャー、クローブ、ライムなどから作られる、カリブ海発祥のシロップまたはリキュールです。",
	},
	"シャルトリューズ": {
		group: "リキュール",
		description:
			"130種類ものハーブやスパイスから造られる、フランスの修道院発祥の秘伝のリキュールです。",
	},
	"カルーア": {
		group: "リキュール",
		description:
			"アラビカ種のコーヒー豆を主原料とした、メキシコ産のコーヒーリキュールです。",
	},
	"フェルネット・ブランカ": {
		group: "リキュール",
		description:
			"イタリア・ミラノのブランカ社が製造するフェルネットの代表的な銘柄です。",
	},
	"コーヒー・リキュール": {
		group: "リキュール",
		description: "コーヒー豆を原料としたリキュールの総称です。",
	},
	"アペロール": {
		group: "リキュール",
		description:
			"ビターオレンジやスイートオレンジ、ハーブなどから造られる、オレンジ色が特徴のイタリア産リキュール。カンパリより苦味が少ないです。",
	},
	"アマーロ・ノニーノ": {
		group: "リキュール",
		description:
			"グラッパをベースにハーブを浸漬して造られる、イタリアの高級アマーロ（苦味酒）です。",
	},
	"セントエリザベス・オールスパイス・ドラム": {
		group: "リキュール",
		description:
			"オールスパイス（ピメント）のベリーをラムに浸漬して造られる、スパイシーなリキュールです。",
	},
	"オレンジ・ビターズ": {
		group: "ビターズ",
		description:
			"オレンジの果皮やハーブをアルコールに浸漬して造られるビターズ（苦味酒）です。",
	},
	"アンゴスチュラ・ビターズ": {
		group: "ビターズ",
		description:
			"リンドウの根やハーブ、スパイスから造られる、カクテルに欠かせない代表的なビターズです。",
	},
	"ペイショーズ・ビターズ": {
		group: "ビターズ",
		description:
			"サゼラックなどのカクテルに使われる、アニスやチェリーの風味が特徴的なビターズです。",
	},
	"アロマティック・ビターズ": {
		group: "ビターズ",
		description: "様々なハーブやスパイスの香りを持つビターズの総称です。",
	},
	// ノンアルコール
	"炭酸水": {
		group: "炭酸水",
		description: "炭酸ガスを含む水。ソーダやクラブソーダとも呼ばれます。",
	},
	"水": {
		group: "水",
		description:
			"カクテルの希釈、味の調整、冷却など多目的に使われる、最もシンプルな飲料。",
	},
	"レモン・ジュース": {
		group: "ジュース",
		description: "レモンを搾った果汁。フレッシュな酸味を加えます。",
	},
	"ライム・ジュース": {
		group: "ジュース",
		description: "ライムを搾った果汁。爽やかな酸味と香りを加えます。",
	},
	"パイナップル・ジュース": {
		group: "ジュース",
		description: "パイナップルを搾った果汁。トロピカルな甘酸っぱさを加えます。",
	},
	"オレンジ・ジュース": {
		group: "ジュース",
		description: "オレンジを搾った果汁。フルーティーな甘さと酸味を加えます。",
	},
	"サトウキビ・ジュース": {
		group: "ジュース",
		description: "サトウキビを搾ったジュース。自然な甘さが特徴です。",
	},
	"トマト・ジュース": {
		group: "ジュース",
		description: "トマトを搾ったジュース。ブラッディ・マリーなどに使われます。",
	},
	"クランベリー・ジュース": {
		group: "ジュース",
		description: "クランベリーを搾った果汁。鮮やかな色と酸味が特徴です。",
	},
	"グレープフルーツ・ジュース": {
		group: "ジュース",
		description: "グレープフルーツを搾った果汁。爽やかな苦味と酸味が特徴です。",
	},
	"ピンクグレープフルーツソーダ": {
		group: "ジュース",
		description: "ピンクグレープフルーツ風味の炭酸飲料です。",
	},
	"コーラ": {
		group: "ジュース",
		description:
			"甘味と刺激のある炭酸飲料。幅広い世代に親しまれ、カクテルの材料としても人気です。",
	},
	"ジンジャーエール": {
		group: "ジュース",
		description: "ショウガの風味を付けた甘口の炭酸飲料です。",
	},
	"ジンジャービール": {
		group: "ジュース",
		description:
			"ショウガを発酵させて造る、ジンジャーエールより辛口で本格的な炭酸飲料です。",
	},
	"ホットコーヒー": {
		group: "コーヒー",
		description:
			"焙煎豆の香りとコクを楽しめる温かい飲料。カクテルに深みを加える素材としても活躍します。",
	},
	"エスプレッソ": {
		group: "コーヒー",
		description: "高圧で抽出した濃厚なコーヒー。",
	},
	// その他
	"シンプル・シロップ": {
		group: "シロップ",
		description: "砂糖と水を1:1の割合で煮溶かして作る基本的なシロップです。",
	},
	"ラズベリー・シロップ": {
		group: "シロップ",
		description: "ラズベリーの風味を付けた甘いシロップです。",
	},
	"グレナデン・シロップ": {
		group: "シロップ",
		description:
			"ザクロの果汁から作られる、鮮やかな赤色と甘酸っぱい風味が特徴のシロップです。",
	},
	"シュガー・シロップ": {
		group: "シロップ",
		description:
			"砂糖を水に溶かして作る甘味料。シンプルシロップと同義で使われることが多いです。",
	},
	"オルジェー・シロップ": {
		group: "シロップ",
		description:
			"アーモンドと砂糖、オレンジフラワーウォーターなどから作られる、甘く香ばしいシロップです。",
	},
	"ハチミツ・シロップ": {
		group: "シロップ",
		description:
			"ハチミツと湯を混ぜて作るシロップ。自然な甘さと香りを加えます。",
	},
	"パッションフルーツ・シロップ": {
		group: "シロップ",
		description: "パッションフルーツの風味を付けたトロピカルなシロップです。",
	},
	"エルダーフラワー・コーディアル": {
		group: "シロップ",
		description:
			"エルダーフラワー（ニワトコの花）から作られる、マスカットのような爽やかな香りのシロップです。",
	},
	"アガベ・シロップ": {
		group: "シロップ",
		description:
			"リュウゼツランから作られる天然の甘味料。砂糖より甘みが強いです。",
	},
	"カモミール・コーディアル": {
		group: "シロップ",
		description:
			"カモミールの花から作られる、リンゴのような優しい香りのシロップです。",
	},
	"塩": {
		group: "塩",
		description:
			"味わいを引き締めたり、グラスの縁に飾ったりするのに使われます。",
	},
	"セロリソルト": {
		group: "塩",
		description: "塩とセロリの種を挽いたものを混ぜたブレンド調味料です。",
	},
	"砂糖": {
		group: "砂糖",
		description: "カクテルの甘みを調整するために使われる基本的な材料です。",
	},
	"角砂糖": { group: "砂糖", description: "立方体に固めた砂糖。" },
	"卵白": {
		group: "卵",
		description:
			"カクテルにまろやかな口当たりと美しい泡の層を作るために使われます。",
	},
	"卵黄": {
		group: "卵",
		description: "カクテルにコクと栄養価を加えるために使われます。",
	},
	"パイナップルの塊": {
		group: "果物",
		description: "カットしたパイナップル。材料や飾りとして使われます。",
	},
	"ライム": {
		group: "果物",
		description: "フレッシュなライム。果汁を搾ったり、飾りとして使われます。",
	},
	"ライムのくし切り": {
		group: "果物",
		description:
			"くし形にカットしたライム。グラスに添えたり、搾ったりして使います。",
	},
	"オレンジの輪切り": {
		group: "果物",
		description: "輪切りにしたオレンジ。飾りとして使われます。",
	},
	"レモンの輪切り": {
		group: "果物",
		description: "輪切りにしたレモン。飾りとして使われます。",
	},
	"白桃ピュレ": {
		group: "ピュレ",
		description: "白桃をすり潰して裏ごししたもの。ベリーニなどに使われます。",
	},
	"パッションフルーツピュレ": {
		group: "ピュレ",
		description:
			"パッションフルーツをすり潰して裏ごししたもの。濃厚なトロピカル風味を加えます。",
	},
	"生クリーム": {
		group: "クリーム",
		description:
			"牛乳から脂肪分を分離したもの。カクテルにまろやかさとコクを加えます。",
	},
	"ココナッツクリーム": {
		group: "クリーム",
		description:
			"ココナッツの果肉から作られる濃厚なクリーム。ピニャ・コラーダなどに使われます。",
	},
	"オレンジフラワーウォーター": {
		group: "その他",
		description: "ビターオレンジの花を蒸留して作られる香りの良い液体です。",
	},
	"バニラエッセンス": {
		group: "その他",
		description: "バニラビーンズから抽出した香料。甘い香りを加えます。",
	},
	"バニラシュガー": {
		group: "その他",
		description: "砂糖にバニラの香りを付けたものです。",
	},
	"ドンズ・ミックス": {
		group: "その他",
		description:
			"ドン・ビーチコンバーが考案したとされる、グレープフルーツジュースとシナモンシロップを混ぜたミックスです。",
	},
	"ハチミツ": {
		group: "その他",
		description: "ミツバチが集めた花の蜜。自然な甘味料として使われます。",
	},
	"ショウガのスライス": {
		group: "その他",
		description: "スライスしたショウガ。スパイシーな風味を加えます。",
	},
	"ミントの小枝": {
		group: "その他",
		description: "ミントの枝。飾りや香りづけに使われます。",
	},
	"ミントの葉": {
		group: "その他",
		description: "ミントの葉。モヒートなどで潰して香りを引き出します。",
	},
	"イタリアンバジルの葉": {
		group: "その他",
		description: "バジルの葉。爽やかなハーブの香りを加えます。",
	},
	"チョウジ": {
		group: "その他",
		description: "クローブとも呼ばれるスパイス。甘く刺激的な香りが特徴です。",
	},
	"コショウ": {
		group: "その他",
		description: "料理にも使われる基本的なスパイス。風味を引き締めます。",
	},
	"赤唐辛子薄切り": {
		group: "その他",
		description: "スライスした赤唐辛子。ピリッとした辛味を加えます。",
	},
	"ウスターソース": {
		group: "その他",
		description: "野菜や果実、スパイスから作られるソース。",
	},
	"タバスコ": {
		group: "その他",
		description: "唐辛子と酢、塩を原料とする辛いソース。",
	},
};

const ingredientGroupsData = [
	{
		displayName: "ワイン",
		order: 1,
		description:
			"ブドウを発酵させて造られる醸造酒。ワインカクテルや風味付けに使われます。",
	},
	{
		displayName: "ジン",
		order: 20,
		description:
			"ジュニパーベリーを主原料とする蒸留酒。爽やかな香りが特徴です。",
	},
	{
		displayName: "ウォッカ",
		order: 21,
		description:
			"穀物やジャガイモを原料とする蒸留酒。クリアでニュートラルな味わいです。",
	},
	{
		displayName: "ラム",
		order: 22,
		description: "サトウキビを原料とする蒸留酒。甘く豊かな風味が特徴です。",
	},
	{
		displayName: "テキーラ",
		order: 23,
		description:
			"リュウゼツランを原料とするメキシコ産蒸留酒。独特の風味が魅力です。",
	},
	{
		displayName: "ウイスキー",
		order: 24,
		description:
			"大麦やトウモロコシなどの穀物を原料とする蒸留酒。豊かな香りと深いコクが楽しめます。",
	},
	{
		displayName: "ブランデー",
		order: 25,
		description:
			"果実を原料とする蒸留酒。特にブドウから作られるものが有名です。",
	},
	{
		displayName: "その他の蒸留酒",
		order: 26,
		description: "上記以外の様々な原料や製法で造られる蒸留酒です。",
	},
	{
		displayName: "リキュール",
		order: 40,
		description:
			"蒸留酒に果実やハーブ、スパイスなどを加えて風味を付けた混成酒。",
	},
	{
		displayName: "ビターズ",
		order: 41,
		description:
			"薬草や香辛料をアルコールに浸漬して造られる苦味酒。カクテルの風味を引き締めます。",
	},
	{ displayName: "ジュース", order: 60, description: "" },
	{ displayName: "炭酸水", order: 61, description: "" },
	{ displayName: "コーヒー", order: 62, description: "" },
	{ displayName: "水", order: 63, description: "" },
	{ displayName: "クリーム", order: 80, description: "" },
	{ displayName: "シロップ", order: 81, description: "" },
	{ displayName: "果物", order: 82, description: "" },
	{
		displayName: "ピュレ",
		order: 83,
		description:
			"果物や野菜をすり潰して裏ごししたもの。濃厚な果実感を加えます。",
	},
	{ displayName: "卵", order: 84, description: "" },
	{ displayName: "砂糖", order: 85, description: "" },
	{ displayName: "塩", order: 86, description: "" },
	{
		displayName: "その他",
		order: 99,
		description: "ハーブ、スパイスなど、カクテルに使われるその他の材料です。",
	},
];

export async function seed(env: Env) {
	const db = drizzle(env.DB);

	console.log("🌱 Seeding database...");

	// 既存のデータをクリア
	await db.delete(cocktailTags);
	await db.delete(tags);
	await db.delete(instructions);
	await db.delete(cocktailIngredients);
	await db.delete(ingredients);
	await db.delete(cocktails);
	await db.delete(categories);
	console.log("🗑️ Cleared existing data.");

	const allCocktails = [...unforgettables, ...contemporaryClassics, ...newEra];

	// カテゴリの登録（並び順を管理）
	const categoryData = [
		{
			name: "醸造酒",
			sortOrder: 1,
			icon: "WineBar",
			description: "穀物や果物などを発酵させて造られたお酒。",
		},
		{
			name: "蒸留酒",
			sortOrder: 2,
			icon: "Liquor",
			description: "醸造酒を蒸留してアルコール度数を高めたお酒。",
		},
		{
			name: "混成酒",
			sortOrder: 3,
			icon: "LocalBar",
			description: "醸造酒や蒸留酒に糖類、香料、果実などを加えたお酒。",
		},
		{
			name: "ノンアルコール",
			sortOrder: 4,
			icon: "LocalDrink",
			description: "アルコールを含まない飲料。",
		},
		{
			name: "その他",
			sortOrder: 5,
			icon: "Restaurant",
			description: "上記以外の材料（シロップ、果物、香辛料など）。",
		},
	];

	const categoryMapByName = new Map<string, number>();
	for (const category of categoryData) {
		const [newCategory] = await db.insert(categories).values(category).returning({ id: categories.id });
		categoryMapByName.set(category.name, newCategory.id);
	}
	console.log("📁 Seeded categories.");

	// タグの登録
	const tagMap = new Map<string, number>();
	for (const cocktailData of allCocktails) {
		for (const tagName of cocktailData.tags) {
			if (!tagMap.has(tagName)) {
				const [newTag] = await db
					.insert(tags)
					.values({ name: tagName })
					.returning({ id: tags.id });
				tagMap.set(tagName, newTag.id);
			}
		}
	}
	console.log("🏷️  Seeded tags.");

	// 材料グループの登録
	const groupMap = new Map<string, number>();
	for (const group of ingredientGroupsData) {
		const [newGroup] = await db
			.insert(ingredientGroups)
			.values({
				displayName: group.displayName,
				sortOrder: group.order,
				description: group.description,
			})
			.returning({ id: ingredientGroups.id });
		groupMap.set(group.displayName, newGroup.id);
	}
	console.log("📦 Seeded ingredient groups.");

	// 材料の登録
	const ingredientMap = new Map<string, number>();
	for (const cocktailData of allCocktails) {
		for (const ing of cocktailData.ingredients) {
			if (!ingredientMap.has(ing.name)) {
				const groupDisplayName = ingredientDetails[ing.name]?.group;
				if (!groupDisplayName) {
					throw new Error(
						`Ingredient group not found for ingredient: ${ing.name}`,
					);
				}
				const groupId = groupMap.get(groupDisplayName);
				if (groupId === undefined) {
					throw new Error(
						`Group ID not found for group display name: ${groupDisplayName}`,
					);
				}
				const description = ingredientDetails[ing.name]?.description;
				const categoryId = categoryMapByName.get(ing.category);
				if (categoryId === undefined) {
					throw new Error(`Category ID not found for category: ${ing.category}`);
				}

				const [newIngredient] = await db
					.insert(ingredients)
					.values({
						name: ing.name,
						groupId: groupId,
						categoryId: categoryId,
						description: description ?? null,
					})
					.returning({ id: ingredients.id });
				ingredientMap.set(ing.name, newIngredient.id);
			}
		}
	}
	console.log("🌿 Seeded ingredients.");

	// カクテル、作り方、中間テーブルの登録
	for (const cocktailData of allCocktails) {
		const cocktailId = uuidv4();
		const slug = cocktailData.imageUrl.replace(/\.[^/.]+$/, "");

		// cocktails テーブル
		await db.insert(cocktails).values({
			id: cocktailId,
			name: cocktailData.name,
			slug,
			description: cocktailData.description,
			garnish: cocktailData.garnish,
			imageUrl: cocktailData.imageUrl,
		});

		// instructions テーブル
		await db.insert(instructions).values(
			cocktailData.instructions.map((text, index) => ({
				cocktailId,
				step: index + 1,
				text,
			})),
		);

		// cocktail_ingredients テーブル
		await db.insert(cocktailIngredients).values(
			cocktailData.ingredients.map((ing: IngredientData) => {
				const ingredientId = ingredientMap.get(ing.name);
				if (ingredientId === undefined) {
					throw new Error(`Ingredient not found: ${ing.name}`);
				}
				return {
					cocktailId,
					ingredientId,
					amount: ing.amount,
					option_group: ing.option_group,
				};
			}),
		);

		// cocktail_tags テーブル
		await db.insert(cocktailTags).values(
			cocktailData.tags.map((tagName) => {
				const tagId = tagMap.get(tagName);
				if (tagId === undefined) {
					throw new Error(`Tag not found: ${tagName}`);
				}
				return {
					cocktailId,
					tagId,
				};
			}),
		);
	}
	console.log(`🍹 Seeded ${allCocktails.length} cocktails.`);

	console.log("✅ Seeding complete.");
}

// エラーハンドリングを改善したseed関数のラッパー
export async function runSeed(env: Env) {
	try {
		await seed(env);
		console.log("✅ Seed script completed successfully.");
		return true;
	} catch (error) {
		console.error("❌ Seed script failed:", error);
		if (error instanceof Error) {
			console.error("Error details:", error.message);
			console.error("Stack trace:", error.stack);
		}
		throw error;
	}
}

// Node.js環境で直接実行される場合（開発用）
// この場合、WranglerのローカルD1環境を使用する必要があります
if (
	typeof require !== "undefined" &&
	require.main === module &&
	typeof process !== "undefined"
) {
	console.log("⚠️  This script requires a Cloudflare D1 database connection.");
	console.log("");
	console.log("💡 To run this script, use one of the following methods:");
	console.log("");
	console.log("   Method 1: Using Wrangler (Recommended)");
	console.log(
		"   npx wrangler d1 execute yourmix-db --local --file=./scripts/seed-executor.ts",
	);
	console.log("");
	console.log("   Method 2: Using npm script");
	console.log("   npm run seed:local  (for local database)");
	console.log("   npm run seed:remote (for remote database)");
	console.log("");
	console.log("   Method 3: Create a worker that calls this script");
	console.log("   See wrangler.jsonc for D1 database configuration");
	console.log("");
	process.exit(1);
}
