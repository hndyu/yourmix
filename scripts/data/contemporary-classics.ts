import type { CocktailData } from "../types";

export const contemporaryClassics: CocktailData[] = [
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
		imageUrl: "bellini.avif",
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
		imageUrl: "black-russian.avif",
	},
	{
		name: "ブラッディ・マリー",
		description:
			"トマトジュースとスパイスを合わせた、食事にも合うピリッとした風味のカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml", category: "蒸留酒" },
			{ name: "トマトジュース", amount: "90ml", category: "ノンアルコール" },
			{ name: "レモンジュース", amount: "15ml", category: "ノンアルコール" },
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
		imageUrl: "bloody-mary.avif",
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
		imageUrl: "caipirinha.avif",
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
		imageUrl: "cardinal.avif",
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
		imageUrl: "champagne-cocktail.avif",
	},
	{
		name: "コープス・リバイバー #2",
		description:
			"ジンに柑橘とリキュールを合わせた、すっきりと目が覚めるような爽快なカクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "コアントロー", amount: "30ml", category: "混成酒" },
			{ name: "リレ・ブラン", amount: "30ml", category: "醸造酒" },
			{ name: "レモンジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "アブサン", amount: "1振", category: "混成酒" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振って冷やしたグラスに注ぎます。",
		],
		garnish: "オレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "corpse-reviver-2.avif",
	},
	{
		name: "コスモポリタン",
		description:
			"クランベリーの酸味とライムの爽やかさが広がる、軽やかで飲みやすいウォッカカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml", category: "蒸留酒" },
			{ name: "コアントロー", amount: "15ml", category: "混成酒" },
			{ name: "ライムジュース", amount: "15ml", category: "ノンアルコール" },
			{
				name: "クランベリージュース",
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
		imageUrl: "cosmopolitan.avif",
	},
	{
		name: "キューバ・リブレ",
		description:
			"ラムとコーラにライムを加えた、手軽で南国気分を味わえる爽やかな一杯。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "50ml", category: "蒸留酒" },
			{ name: "コーラ", amount: "120ml", category: "ノンアルコール" },
			{ name: "ライムジュース", amount: "10ml", category: "ノンアルコール" },
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "ライムのくし切りを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "cuba-libre.avif",
	},
	{
		name: "フレンチ75",
		description:
			"ジンとレモンをスパークリングワインで割った、華やかで飲みやすいシャンパン系カクテル。",
		ingredients: [
			{ name: "ジン", amount: "30ml", category: "蒸留酒" },
			{ name: "レモンジュース", amount: "15ml", category: "ノンアルコール" },
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
		imageUrl: "french-75.avif",
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
		imageUrl: "french-connection.avif",
	},
	{
		name: "ガリバルディ",
		description:
			"カンパリとオレンジジュースの鮮やかな色合いが美しい、軽やかな苦味のカクテル。",
		ingredients: [
			{ name: "カンパリ", amount: "45ml", category: "混成酒" },
			{
				name: "オレンジジュース",
				amount: "120ml",
				category: "ノンアルコール",
			},
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "オレンジのくし切りを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "garibaldi.avif",
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
		imageUrl: "grasshopper.avif",
	},
	{
		name: "ヘミングウェイ・スペシャル",
		description:
			"文豪ヘミングウェイの名を冠した、グレープフルーツとライムが香る爽快なラムカクテル。",
		ingredients: [
			{ name: "ラム", amount: "60ml", category: "蒸留酒" },
			{
				name: "グレープフルーツジュース",
				amount: "40ml",
				category: "ノンアルコール",
			},
			{
				name: "マラスキーノ・リキュール",
				amount: "15ml",
				category: "混成酒",
			},
			{ name: "ライムジュース", amount: "15ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振ってグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "hemingway-special.avif",
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
		imageUrl: "horses-neck.avif",
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
		imageUrl: "irish-coffee.avif",
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
		imageUrl: "kir.avif",
	},
	{
		name: "レモン・ドロップ・マティーニ",
		description:
			"レモンの酸味と甘みが調和した、すっきりとした味わいのウォッカカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "30ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "20ml", category: "混成酒" },
			{ name: "レモンジュース", amount: "15ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振って冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "lemon-drop-martini.avif",
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
			{ name: "レモンジュース", amount: "25ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "30ml", category: "その他" },
			{ name: "コーラ", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"氷を入れたグラスにすべての材料を入れます。",
			"軽くかき混ぜます。",
		],
		garnish: "お好みでレモンスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "long-island-iced-tea.avif",
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
			{ name: "ライムジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "7.5ml", category: "その他" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクしてグラスに注ぎます。",
		],
		garnish: "パイナップルの茎、ミントの葉、ライムの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mai-tai.avif",
	},
	{
		name: "マルガリータ",
		description:
			"テキーラとライムの酸味が爽やかな、塩のアクセントが印象的な定番カクテル。",
		ingredients: [
			{ name: "テキーラ", amount: "50ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "20ml", category: "混成酒" },
			{ name: "ライムジュース", amount: "15ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクして冷やしたグラスに注ぎます。",
		],
		garnish: "お好みで、グラスの縁の半分に塩をつけます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "margarita.avif",
	},
	{
		name: "ミモザ",
		description:
			"オレンジジュースとスパークリングワインを合わせた、朝にもぴったりの軽やかな一杯。",
		ingredients: [
			{
				name: "オレンジジュース",
				amount: "75ml",
				category: "ノンアルコール",
			},
			{ name: "プロセッコ", amount: "75ml", category: "醸造酒" },
		],
		instructions: [
			"グラスにオレンジジュースを注ぎ、プロセッコを静かに注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "お好みでオレンジの皮をねじったものを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mimosa.avif",
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
		imageUrl: "mint-julep.avif",
	},
	{
		name: "モヒート",
		description:
			"ミントとライムの香りが広がる、夏に人気のすっきりとしたラムカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "ライムジュース", amount: "20ml", category: "ノンアルコール" },
			{ name: "ミントの小枝", amount: "6本", category: "その他" },
			{ name: "砂糖", amount: "小さじ2杯", category: "その他" },
			{ name: "炭酸水", amount: "適量", category: "ノンアルコール" },
		],
		instructions: [
			"ミントの小枝を砂糖とライムジュースと混ぜます。",
			"少量の炭酸水を加え、グラスに氷を入れます。",
			"ホワイト・ラムを注ぎ、炭酸水を注ぎます。軽く混ぜてすべての材料を混ぜ合わせます。",
		],
		garnish: "ミントの小枝とライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mojito.avif",
	},
	{
		name: "モスコミュール",
		description:
			"ウォッカとジンジャービールを組み合わせた、さっぱりとした辛口の定番カクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml", category: "蒸留酒" },
			{ name: "ジンジャービール", amount: "120ml", category: "ノンアルコール" },
			{ name: "ライムジュース", amount: "10ml", category: "ノンアルコール" },
		],
		instructions: [
			"グラスにウォッカとジンジャービールを混ぜます。",
			"ライムジュースを加え、すべての材料が混ざるまで軽くかき混ぜます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "moscow-mule.avif",
	},
	{
		name: "ピニャ・コラーダ",
		description:
			"パイナップルとココナッツの甘い香りが南国気分を誘う、トロピカルなカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "50ml", category: "蒸留酒" },
			{ name: "ココナッツクリーム", amount: "30ml", category: "その他" },
			{
				name: "パイナップルジュース",
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
		imageUrl: "pina-colada.avif",
	},
	{
		name: "ピスコ・サワー",
		description:
			"ピスコとレモンを合わせた、軽い酸味とまろやかな口当たりが特徴の南米生まれのカクテル。",
		ingredients: [
			{ name: "ピスコ", amount: "60ml", category: "蒸留酒" },
			{ name: "レモンジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "20ml", category: "その他" },
			{ name: "卵白", amount: "1個", category: "その他" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクして冷やしたグラスに注ぎます。",
		],
		garnish: "香り豊かな飾りとして、ビターズを数滴上に振りかけます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "pisco-sour.avif",
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
		imageUrl: "rabo-de-galo.avif",
	},
	{
		name: "シー・ブリーズ",
		description:
			"ウォッカにクランベリーとグレープフルーツを合わせた、軽くてさっぱりとしたフルーティーな一杯。",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml", category: "蒸留酒" },
			{
				name: "クランベリージュース",
				amount: "120ml",
				category: "ノンアルコール",
			},
			{
				name: "グレープフルーツジュース",
				amount: "30ml",
				category: "ノンアルコール",
			},
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "オレンジの皮とチェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "sea-breeze.avif",
	},
	{
		name: "セックス・オン・ザ・ビーチ",
		description:
			"オレンジとクランベリーが調和した、甘酸っぱく飲みやすい人気のカクテル。",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml", category: "蒸留酒" },
			{ name: "シュナップス", amount: "20ml", category: "蒸留酒" },
			{
				name: "オレンジジュース",
				amount: "40ml",
				category: "ノンアルコール",
			},
			{
				name: "クランベリージュース",
				amount: "40ml",
				category: "ノンアルコール",
			},
		],
		instructions: ["氷を入れたグラスにすべての材料を入れます。"],
		garnish: "オレンジの半分のスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "sex-on-the-beach.avif",
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
				name: "パイナップルジュース",
				amount: "120ml",
				category: "ノンアルコール",
			},
			{ name: "ライムジュース", amount: "15ml", category: "ノンアルコール" },
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
		imageUrl: "singapore-sling.avif",
	},
	{
		name: "テキーラ・サンライズ",
		description:
			"オレンジジュースとグレナデンで朝焼けのような色を表現した、甘く爽やかなテキーラカクテル。",
		ingredients: [
			{ name: "テキーラ", amount: "45ml", category: "蒸留酒" },
			{
				name: "オレンジジュース",
				amount: "90ml",
				category: "ノンアルコール",
			},
			{ name: "グレナデン・シロップ", amount: "15ml", category: "その他" },
		],
		instructions: [
			"氷を入れたグラスにテキーラとオレンジジュースを直接注ぎます。",
			"グレナデン・シロップを加えて色彩効果を作りますが、かき混ぜないでください。",
		],
		garnish: "オレンジの半分のスライスまたはオレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "tequila-sunrise.avif",
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
		imageUrl: "vesper.avif",
	},
	{
		name: "ゾンビ",
		description:
			"ラムを贅沢に使った濃厚なトロピカルカクテルで、甘く力強い味わいが楽しめる。",
		ingredients: [
			{ name: "ダーク・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "ゴールド・ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "デメララ・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "ライムジュース", amount: "20ml", category: "ノンアルコール" },
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
		imageUrl: "zombie.avif",
	},
];
