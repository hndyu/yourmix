import type { CocktailData } from "../types";

export const newEra: CocktailData[] = [
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
		imageUrl: "bees-knees.avif",
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
		imageUrl: "bramble.avif",
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
		imageUrl: "canchanchara.avif",
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
		imageUrl: "chartreuse-swizzle.avif",
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
		imageUrl: "dark-n-stormy.avif",
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
		imageUrl: "dons-special-daiquiri.avif",
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
		imageUrl: "espresso-martini.avif",
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
		imageUrl: "fernandito.avif",
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
		imageUrl: "french-martini.avif",
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
		imageUrl: "gin-basil-smash.avif",
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
		imageUrl: "grand-margarita.avif",
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
		imageUrl: "iba-tiki.avif",
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
		imageUrl: "illegal.avif",
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
		imageUrl: "jungle-bird.avif",
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
		imageUrl: "missionarys-downfall.avif",
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
		imageUrl: "naked-and-famous.avif",
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
		imageUrl: "new-york-sour.avif",
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
		imageUrl: "old-cuban.avif",
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
		imageUrl: "paloma.avif",
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
		imageUrl: "paper-plane.avif",
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
		imageUrl: "penicillin.avif",
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
		imageUrl: "pisco-punch.avif",
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
		imageUrl: "porn-star-martini.avif",
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
		imageUrl: "russian-spring-punch.avif",
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
		imageUrl: "sherry-cobbler.avif",
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
		imageUrl: "south-side.avif",
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
		imageUrl: "spicy-fifty.avif",
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
		imageUrl: "spritz.avif",
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
		imageUrl: "suffering-bastard.avif",
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
		imageUrl: "three-dots-and-a-dash.avif",
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
		imageUrl: "tipperary.avif",
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
		imageUrl: "tommys-margarita.avif",
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
		imageUrl: "trinidad-sour.avif",
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
		imageUrl: "ve-n-to.avif",
	},
];
