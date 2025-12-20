import type { CocktailData } from "../types";

export const unforgettables: CocktailData[] = [
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
		imageUrl: "alexander.avif", // R2にアップロードする画像ファイル名
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
		imageUrl: "americano.avif",
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
			{ name: "レモンジュース", amount: "15ml", category: "ノンアルコール" },
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
		imageUrl: "aviation.avif",
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
		imageUrl: "angel-face.avif",
	},
	{
		name: "ビトウィーン・ザ・シーツ",
		description:
			"ラムとコニャックにレモンを重ねた、軽やかながら力のある古典的なカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "30ml", category: "蒸留酒" },
			{ name: "コニャック", amount: "30ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "30ml", category: "混成酒" },
			{ name: "レモンジュース", amount: "20ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに加えます。",
			"氷と一緒にシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "between-the-sheets.avif",
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
		imageUrl: "boulevardier.avif",
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
			{ name: "レモンジュース", amount: "15ml", category: "ノンアルコール" },
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
		imageUrl: "brandy-crusta.avif",
	},
	{
		name: "カジノ",
		description:
			"ジンとチェリーリキュールにオレンジの酸味を加えた、1900年代初頭生まれのクラシカルな軽めの一杯。",
		ingredients: [
			{ name: "ジン", amount: "40ml", category: "蒸留酒" },
			{
				name: "マラスキーノ・リキュール",
				amount: "10ml",
				category: "混成酒",
			},
			{ name: "レモンジュース", amount: "10ml", category: "ノンアルコール" },
			{ name: "オレンジ・ビターズ", amount: "2振", category: "混成酒" },
		],
		instructions: [
			"すべての材料をカクテルシェーカーに注ぎ、氷と一緒によくシェイクし、濾します。",
			"氷を入れた冷やしたグラスに注ぎます。",
		],
		garnish: "レモンの皮とマラスキーノ・チェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "casino.avif",
	},
	{
		name: "クローバー・クラブ",
		description:
			"ジンにラズベリー・シロップとレモンを合わせ、卵白でなめらかに仕上げた、ゆったり楽しむクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "ラズベリー・シロップ", amount: "15ml", category: "その他" },
			{ name: "レモンジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "卵白", amount: "数滴", category: "その他" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "新鮮なラズベリー。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "clover-club.avif",
	},
	{
		name: "ダイキリ",
		description:
			"キューバ生まれのラムとライム、砂糖を合わせた、誰にも親しみやすいシンプル＆爽やかな定番カクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "60ml", category: "蒸留酒" },
			{ name: "ライムジュース", amount: "20ml", category: "ノンアルコール" },
			{ name: "砂糖", amount: "茶匙2杯", category: "その他" },
		],
		instructions: [
			"カクテルシェイカーにすべての材料を入れ、よくかき混ぜて砂糖を溶かします。",
			"氷を加えてシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "daiquiri.avif",
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
		imageUrl: "dry-martini.avif",
	},
	{
		name: "ジン・フィズ",
		description:
			"ジンとレモン、砂糖に炭酸を加えた、軽やかで泡立つ爽快な古典ドリンク。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "レモンジュース", amount: "30ml", category: "ノンアルコール" },
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
		imageUrl: "gin-fizz.avif",
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
		imageUrl: "hanky-panky.avif",
	},
	{
		name: "ジョン・コリンズ",
		description:
			"ジン、レモン、砂糖、炭酸を合わせた、爽やかで軽快なクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "レモンジュース", amount: "30ml", category: "ノンアルコール" },
			{ name: "シンプル・シロップ", amount: "15ml", category: "その他" },
			{ name: "炭酸水", amount: "60ml", category: "ノンアルコール" },
		],
		instructions: ["氷を入れたグラスに材料をすべて注ぎ、軽く混ぜます。"],
		garnish: "レモンスライスとマラスキーノ・チェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "john-collins.avif",
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
				name: "ライムジュース",
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
		imageUrl: "last-word.avif",
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
		imageUrl: "manhattan.avif",
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
		imageUrl: "martinez.avif",
	},
	{
		name: "メアリー・ピックフォード",
		description:
			"ホワイト・ラムにパイナップルジュースとグレナデンを加えた、同名の女優にちなんで名付けられた軽やかなカクテル。",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "45ml", category: "蒸留酒" },
			{
				name: "パイナップルジュース",
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
		imageUrl: "mary-pickford.avif",
	},
	{
		name: "モンキー・グランド",
		description:
			"ジンにオレンジとグレナデンを加えた、1920年代のパリ発祥とされる遊び心あるクラシックカクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{
				name: "オレンジジュース",
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
		imageUrl: "monkey-gland.avif",
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
		imageUrl: "negroni.avif",
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
		imageUrl: "old-fashioned.avif",
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
				name: "オレンジジュース",
				amount: "15ml",
				category: "ノンアルコール",
			},
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "paradise.avif",
	},
	{
		name: "プランターズ・パンチ",
		description:
			"ラムとトロピカル・ジュースを使った、南国らしい甘酸っぱく陽気なカクテル。",
		ingredients: [
			{ name: "ジャマイカ産ラム", amount: "45ml", category: "蒸留酒" },
			{ name: "ライムジュース", amount: "15ml", category: "ノンアルコール" },
			{
				name: "サトウキビジュース",
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
		imageUrl: "planters-punch.avif",
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
		imageUrl: "porto-flip.avif",
	},
	{
		name: "ラモス・フィズ",
		description:
			"ジンとレモン、クリームを泡立てた、なめらかで軽やかな口当たりの老舗カクテル。",
		ingredients: [
			{ name: "ジン", amount: "45ml", category: "蒸留酒" },
			{ name: "ライムジュース", amount: "15ml", category: "ノンアルコール" },
			{ name: "レモンジュース", amount: "15ml", category: "ノンアルコール" },
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
		imageUrl: "ramos-fizz.avif",
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
		imageUrl: "remember-the-maine.avif",
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
		imageUrl: "rusty-nail.avif",
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
		imageUrl: "sazerac.avif",
	},
	{
		name: "サイドカー",
		description:
			"ブランデーにオレンジリキュールとレモンを合わせた、バランスの良い酸味と甘みのクラシックカクテル。",
		ingredients: [
			{ name: "コニャック", amount: "50ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "20ml", category: "混成酒" },
			{ name: "レモンジュース", amount: "20ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "sidecar.avif",
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
		imageUrl: "stinger.avif",
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
		imageUrl: "tuxedo.avif",
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
		imageUrl: "vieux-carre.avif",
	},
	{
		name: "ウィスキー・サワー",
		description:
			"ウイスキーとレモン、砂糖を合わせた、爽やかな酸味と甘みが調和した定番カクテル。",
		ingredients: [
			{ name: "バーボン・ウイスキー", amount: "45ml", category: "蒸留酒" },
			{ name: "レモンジュース", amount: "25ml", category: "ノンアルコール" },
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
		imageUrl: "whiskey-sour.avif",
	},
	{
		name: "ホワイト・レディ",
		description:
			"ジンとレモン、オレンジリキュールを合わせた、キリッとした酸味が心地よい上品なカクテル。",
		ingredients: [
			{ name: "ジン", amount: "40ml", category: "蒸留酒" },
			{ name: "トリプルセック", amount: "30ml", category: "混成酒" },
			{ name: "レモンジュース", amount: "20ml", category: "ノンアルコール" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "white-lady.avif",
	},
];
