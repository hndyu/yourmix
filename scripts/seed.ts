import { drizzle } from "drizzle-orm/d1";
import {
	cocktails,
	ingredients,
	cocktailIngredients,
	instructions,
	tags,
	cocktailTags,
} from "../schema"; // Drizzle ORM のスキーマ定義
import { v4 as uuidv4 } from "uuid";

// D1 Client の型定義 (wrangler.jsonc の設定に合わせる)
interface Env {
	DB: D1Database;
}

// シードデータ
const contemporaryClassics = [
	{
		name: "ベリーニ",
		ingredients: [
			{ name: "プロセッコ", amount: "100ml" },
			{ name: "白桃ピュレ", amount: "50ml" },
		],
		instructions: [
			"氷を入れたミキシンググラスに桃のピューレを注ぎ、プロセッコワインを加えます。",
			"軽くかき混ぜて冷やしたフルートグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "bellini.jpg",
	},
	{
		name: "ブラック・ルシアン",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml" },
			{ name: "コーヒーリキュール", amount: "20ml" },
		],
		instructions: [
			"氷を入れたオールドファッショングラスに材料を注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "black-russian.jpg",
	},
	{
		name: "ブラッディ・マリー",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml" },
			{ name: "トマトジュース", amount: "90ml" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "ウスターソース", amount: "2ダッシュ" },
			{ name: "タバスコ", amount: "お好みで" },
			{ name: "セロリソルト", amount: "お好みで" },
			{ name: "コショウ", amount: "お好みで" },
		],
		instructions: [
			"氷を入れたミキシンググラスですべての材料を静かにかき混ぜ、ロックグラスに注ぎます。",
		],
		garnish: "お好みでセロリ、レモンのくし切り。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "bloody-mary.jpg",
	},
	{
		name: "カイピリーニャ",
		ingredients: [
			{ name: "カシャッサ", amount: "60ml" },
			{ name: "ライム", amount: "1個（くし切り）" },
			{ name: "砂糖", amount: "小さじ4" },
		],
		instructions: [
			"ダブルのオールドファッションドグラスにライムと砂糖を入れ、軽く混ぜます。",
			"グラスに砕いた氷を入れ、カシャッサを注ぎます。材料が混ざるように優しくステアします。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "caipirinha.jpg",
	},
	{
		name: "カーディナル",
		ingredients: [
			{ name: "ジン", amount: "90ml" },
			{ name: "ベルモット", amount: "10ml" },
			{ name: "カンパリ", amount: "10ml" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "champagne-cocktail.jpg",
	},
	{
		name: "シャンパン・カクテル",
		ingredients: [
			{ name: "シャンパン（冷）", amount: "90ml" },
			{ name: "コニャック", amount: "10ml" },
			{ name: "ビターズ", amount: "2ダッシュ" },
			{ name: "グランマルニエ", amount: "数滴（お好みで）" },
			{ name: "角砂糖", amount: "1個" },
		],
		instructions: [
			"大きめのシャンパングラスに角砂糖とビターズを2滴入れ、コニャックを加えます。",
			"軽く冷やしたシャンパンを注ぎます。",
		],
		garnish: "オレンジの皮とマラスキーノチェリーを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "champagne-cocktail.jpg",
	},
	{
		name: "コープス・リバイバー #2",
		ingredients: [
			{ name: "ジン", amount: "30ml" },
			{ name: "コアントロー", amount: "30ml" },
			{ name: "リレ・ブラン", amount: "30ml" },
			{ name: "レモンジュース", amount: "30ml" },
			{ name: "アブサン", amount: "1ダッシュ" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振って冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "オレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "cosmopolitan.jpg",
	},
	{
		name: "コスモポリタン",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml" },
			{ name: "コアントロー", amount: "15ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "クランベリージュース", amount: "30ml" },
		],
		instructions: [
			"氷を入れたカクテルシェイカーにすべての材料を加えます。",
			"よく振って、大きめのカクテルグラスに注ぎます。",
		],
		garnish: "レモンツイストを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "cosmopolitan.jpg",
	},
	{
		name: "キューバ・リブレ",
		ingredients: [
			{ name: "ラム", amount: "50ml" },
			{ name: "コーラ", amount: "120ml" },
			{ name: "ライムジュース", amount: "10ml" },
		],
		instructions: ["氷を入れたハイボールグラスに全ての材料を入れます。"],
		garnish: "ライムのくし切りを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "cuba-libre.jpg",
	},
	{
		name: "フレンチ75",
		ingredients: [
			{ name: "ジン", amount: "30ml" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "シュガーシロップ", amount: "15ml" },
			{ name: "シャンパン", amount: "60ml" },
		],
		instructions: [
			"シャンパン以外の材料を全てシェイカーに注ぎます。",
			"よく振ってシャンパンフルートに注ぎます。",
			"シャンパンを注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "french-75.jpg",
	},
	{
		name: "フレンチ・コネクション",
		ingredients: [
			{ name: "コニャック", amount: "35ml" },
			{ name: "アマレット", amount: "35ml" },
		],
		instructions: [
			"すべての材料を氷を入れたオールドファッショングラスに直接注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "french-connection.jpg",
	},
	{
		name: "ガリバルディ",
		ingredients: [
			{ name: "カンパリ", amount: "45ml" },
			{ name: "オレンジジュース ", amount: "120ml" },
		],
		instructions: [
			"氷を入れたハイボールグラスに全ての材料を入れます。",
		],
		garnish: "オレンジのくし切りを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "french-connection.jpg",
	},
	{
		name: "グラスホッパー",
		ingredients: [
			{ name: "クレーム・ド・カカオ", amount: "20ml" },
			{ name: "クレーム・ド・ミント", amount: "20ml" },
			{ name: "生クリーム", amount: "20ml" },
		],
		instructions: [
			"氷を入れたシェイカーに全ての材料を注ぎます。",
			"数秒間勢いよくシェイクします。冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "お好みでミントの葉を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "grasshopper.jpg",
	},
	{
		name: "ヘミングウェイ・スペシャル",
		ingredients: [
			{ name: "ラム", amount: "60ml" },
			{ name: "グレープフルーツジュース", amount: "40ml" },
			{ name: "マラスキーノ・リキュール", amount: "15ml" },
			{ name: "フレッシュライム", amount: "15ml" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振って大きめのカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "hemingway-special.jpg",
	},
	{
		name: "ホーセズ・ネック",
		ingredients: [
			{ name: "コニャック", amount: "40ml" },
			{ name: "ジンジャーエール", amount: "120ml" },
			{ name: "ビターズ（お好みで）", amount: "1ダッシュ" },
		],
		instructions: [
			"氷を入れたハイボールグラスにコニャックとジンジャーエールを直接注ぎます。",
			"軽くかき混ぜます。",
			"お好みに応じて、ビターズを少量加えます。",
		],
		garnish: "レモン1個分の皮をスパイラル状にして飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "horses-neck.jpg",
	},
	{
		name: "アイリッシュ・コーヒー",
		ingredients: [
			{ name: "アイリッシュ・ウイスキー", amount: "50ml" },
			{ name: "ホットコーヒー", amount: "120ml" },
			{ name: "生クリーム（冷）", amount: "50ml" },
			{ name: "砂糖", amount: "小さじ1" },
		],
		instructions: [
			"温めたブラックコーヒーを、予熱したアイリッシュコーヒーグラスに注ぎます。",
			"ウイスキーと少なくとも小さじ1杯の砂糖を加え、溶けるまでかき混ぜます。",
			"冷やした新鮮な濃厚なクリームを、コーヒーの表面のすぐ上に持ったスプーンの裏側に慎重に注ぎます。",
			"クリームの層は混ざらずにコーヒーの上に浮かびます。",
			"普通の砂糖は砂糖シロップに置き換えることができます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "irish-coffee.jpg",
	},
	{
		name: "キール",
		ingredients: [
			{ name: "白ワイン", amount: "90ml" },
			{ name: "クレーム・ド・カシス", amount: "10ml" },
		],
		instructions: ["グラスにクレーム・ド・カシスを注ぎ、白ワインで満たします。"],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "kir.jpg",
	},
	{
		name: "レモン・ドロップ・マティーニ",
		ingredients: [
			{ name: "ウォッカ", amount: "30ml" },
			{ name: "トリプルセック", amount: "20ml" },
			{ name: "レモンジュース", amount: "15ml" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに注ぎます。",
			"よく振って冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "long-island-iced-tea.jpg",
	},
	{
		name: "ロングアイランド・アイスティー",
		ingredients: [
			{ name: "ウォッカ", amount: "15ml" },
			{ name: "テキーラ", amount: "15ml" },
			{ name: "ラム", amount: "15ml" },
			{ name: "ジン", amount: "15ml" },
			{ name: "コアントロー", amount: "15ml" },
			{ name: "レモンジュース", amount: "25ml" },
			{ name: "シンプルシロップ", amount: "30ml" },
			{ name: "コーラ", amount: "適量" },
		],
		instructions: [
			"氷を入れたハイボールグラスに全ての材料を入れます。",
			"軽くかき混ぜます。",
		],
		garnish: "お好みでレモンスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "long-island-iced-tea.jpg",
	},
	{
		name: "マイタイ",
		ingredients: [
			{ name: "ゴールド・ラム", amount: "30ml" },
			{ name: "ダーク・ラム", amount: "30ml" },
			{ name: "キュラソー", amount: "15ml" },
			{ name: "オルジェー・シロップ", amount: "15ml" },
			{ name: "ライムジュース", amount: "30ml" },
			{ name: "シンプルシロップ ", amount: "7.5ml" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクしてダブルロックグラスまたはハイボールグラスに注ぎます。",
		],
		garnish: "パイナップルの茎、ミントの葉、ライムの皮を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mai-tai.jpg",
	},
	{
		name: "マルガリータ",
		ingredients: [
			{ name: "テキーラ", amount: "50ml" },
			{ name: "トリプルセック", amount: "20ml" },
			{ name: "ライムジュース", amount: "15ml" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクして冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "お好みで、グラスの縁の半分に塩をつけます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "margarita.jpg",
	},
	{
		name: "ミモザ",
		ingredients: [
			{ name: "オレンジジュース", amount: "75ml" },
			{ name: "プロセッコ", amount: "75ml" },
		],
		instructions: [
			"フルートグラスにオレンジジュースを注ぎ、スパークリングワインを静かに注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "お好みでオレンジのツイストを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mimosa.jpg",
	},
	{
		name: "ミント・ジュレップ",
		ingredients: [
			{ name: "バーボン・ウイスキー", amount: "60ml" },
			{ name: "ミントの小枝", amount: "4本" },
			{ name: "砂糖", amount: "小さじ1" },
			{ name: "水", amount: "小さじ2" },
		],
		instructions: [
			"ジュレップのステンレススチールカップにミント、砂糖、水を入れて軽く混ぜます。",
			"グラスに砕いた氷を入れ、バーボンを加えて、カップが凍るまでよくかき混ぜます。",
		],
		garnish: "ミントの小枝を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mint-julep.jpg",
	},
	{
		name: "モヒート",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "45ml" },
			{ name: "ライムジュース", amount: "20ml" },
			{ name: "ミントの小枝", amount: "6本" },
			{ name: "砂糖", amount: "小さじ2" },
			{ name: "ソーダ水", amount: "適量" },
		],
		instructions: [
			"ミントスプリングを砂糖とライムジュースと混ぜます。",
			"少量のソーダ水を加え、グラスに氷を入れます。",
			"ラム酒を注ぎ、ソーダ水を注ぎます。軽く混ぜて全ての材料を混ぜ合わせます。",
		],
		garnish: "ミントの小枝とライムのスライスを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "mojito.jpg",
	},
	{
		name: "モスコミュール",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml" },
			{ name: "ジンジャービール", amount: "120ml" },
			{ name: "ライムジュース", amount: "10ml" },
		],
		instructions: [
			"ミュールカップまたはロックグラスにウォッカとジンジャービールを混ぜます。",
			"ライムジュースを加え、すべての材料が混ざるまで軽くかき混ぜます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "moscow-mule.jpg",
	},
	{
		name: "ピニャ・コラーダ",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "50ml" },
			{ name: "ココナッツクリーム", amount: "30ml" },
			{ name: "パイナップルジュース", amount: "50ml" },
		],
		instructions: [
			"全ての材料と氷を電気ブレンダーで混ぜる。",
			"大きなグラスに注ぎ、ストローを添えて提供します。",
		],
		garnish: "パイナップルのスライスとカクテルチェリーを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "pina-colada.jpg",
	},
	{
		name: "ピスコ・サワー",
		ingredients: [
			{ name: "ピスコ", amount: "60ml" },
			{ name: "レモンジュース", amount: "30ml" },
			{ name: "シンプルシロップ", amount: "20ml" },
			{ name: "卵白", amount: "1個" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"シェイクして冷やしたゴブレットグラスに注ぎます。",
		],
		garnish: "香り豊かな飾りとして、アマルゴ ビターズを数滴上に振りかけます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "pisco-sour.jpg",
	},
	{
		name: "ラボ・デ・ガロ",
		ingredients: [
			{ name: "カシャッサ", amount: "60ml" },
			{ name: "ベルモット", amount: "20ml" },
			{ name: "チナール ", amount: "15ml" },
			{ name: "ビターズ（お好みで）", amount: "2滴" },
		],
		instructions: [
			"ロックグラスにすべての材料を入れ、氷を加えて軽くかき混ぜます。",
		],
		garnish: "オレンジの皮をねじったものを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "pisco-sour.jpg",
	},
	{
		name: "シー・ブリーズ",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml" },
			{ name: "クランベリージュース", amount: "120ml" },
			{ name: "グレープフルーツジュース", amount: "30ml" },
		],
		instructions: ["氷を入れたハイボールグラスにすべての材料を入れます。"],
		garnish: "オレンジの皮とチェリーを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "sea-breeze.jpg",
	},
	{
		name: "セックス・オン・ザ・ビーチ",
		ingredients: [
			{ name: "ウォッカ", amount: "40ml" },
			{ name: "シュナップス", amount: "20ml" },
			{ name: "オレンジジュース", amount: "40ml" },
			{ name: "クランベリージュース", amount: "40ml" },
		],
		instructions: ["氷を入れたハイボールグラスにすべての材料を入れます。"],
		garnish: "オレンジの半分のスライスを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "sex-on-the-beach.jpg",
	},
	{
		name: "シンガポール・スリング",
		ingredients: [
			{ name: "ジン", amount: "30ml" },
			{ name: "モラッコ・チェリー", amount: "15ml" },
			{ name: "コアントロー", amount: "7.5ml" },
			{ name: "ベネディクティン", amount: "7.5ml" },
			{ name: "パイナップルジュース", amount: "120ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "グレナデンシロップ", amount: "10ml" },
			{ name: "ビターズ", amount: "1ダッシュ" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"よく振ってください。",
			"ハリケーングラスに注ぎます。",
		],
		garnish: "パイナップルとマラスキーノチェリーを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "singapore-sling.jpg",
	},
	{
		name: "テキーラ・サンライズ",
		ingredients: [
			{ name: "テキーラ", amount: "45ml" },
			{ name: "オレンジジュース", amount: "90ml" },
			{ name: "グレナデンシロップ", amount: "15ml" },
		],
		instructions: [
			"氷を入れたハイボールグラスにテキーラとオレンジジュースを直接注ぎます。",
			"グレナデンシロップを加えて色彩効果（日の出）を作りますが、かき混ぜないでください。",
		],
		garnish: "オレンジの半分のスライスまたはオレンジの皮を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "tequila-sunrise.jpg",
	},
	{
		name: "ヴェスパー",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "ウォッカ", amount: "15ml" },
			{ name: "リレ・ブラン", amount: "7.5ml" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"シェイクして冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "vesper.jpg",
	},
	{
		name: "ゾンビ",
		ingredients: [
			{ name: "ダーク・ラム", amount: "45ml" },
			{ name: "ゴールド・ラム", amount: "45ml" },
			{ name: "デメララ・ラム", amount: "30ml" },
			{ name: "ライムジュース", amount: "20ml" },
			{ name: "ファレルナム", amount: "15ml" },
			{ name: "ドンズ・ミックス", amount: "15ml" },
			{ name: "グレナデンシロップ", amount: "小さじ1杯" },
			{ name: "ビターズ", amount: "1ダッシュ" },
			{ name: "ペルノ", amount: "6滴" },
		],
		instructions: [
			"すべての材料を砕いた氷 170 グラムと一緒に電気ブレンダーに入れます。",
			"底を数秒間パルスさせながらブレンドします。背の高いタンブラーグラスに注ぎます",
		],
		garnish: "ミントの葉を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 現代のクラシック"],
		imageUrl: "zombie.jpg",
	},
];

const newEra = [
	{
		name: "ビーズ・ニーズ",
		ingredients: [
			{ name: "ジン", amount: "52.5ml" },
			{ name: "はちみつシロップ", amount: "小さじ2杯" },
			{ name: "レモンジュース", amount: "22.5ml" },
			{ name: "オレンジジュース", amount: "22.5ml" },
		],
		instructions: [
			"蜂蜜、レモンジュース、オレンジジュースを溶けるまでかき混ぜ、ジンを加えて氷と一緒にシェイクします。冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "お好みでレモンまたはオレンジの皮を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "bees-knees.jpg",
	},
	{
		name: "ブランブル",
		ingredients: [
			{ name: "ジン", amount: "50ml" },
			{ name: "レモンジュース", amount: "25ml" },
			{ name: "シュガーシロップ", amount: "12.5ml" },
			{ name: "クレーム・ド・ミュール", amount: "15ml" },
		],
		instructions: [
			"クレーム・ド・ミュール以外のすべての材料をカクテル シェイカーに注ぎ、氷と一緒によくシェイクし、砕いた氷を入れた冷やしたオールド ファッション グラスに濾し、クレーム ド ミュールを円を描くようにドリンクの上から注ぎます。",
		],
		garnish: "お好みでレモンスライスとブラックベリーを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "bramble.jpg",
	},
	{
		name: "カンチャンチャラ",
		ingredients: [
			{ name: "アグアルディエンテ", amount: "60ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "ハチミツ", amount: "15ml" },
			{ name: "水", amount: "50ml" },
		],
		instructions: [
			"蜂蜜を水とライムジュースと混ぜ、グラスの底と側面に塗ります。",
			"砕いた氷を加え、次にラム酒を加えます。",
			"最後に下から上に向かって勢いよくかき混ぜます。",
		],
		garnish: "ライムのくし切りを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "canchanchara.jpg",
	},
	{
		name: "シャルトリューズ・スウィズル",
		ingredients: [
			{ name: "シャルトリューズ", amount: "45ml" },
			{ name: "パイナップルジュース", amount: "30ml" },
			{ name: "ライムジュース", amount: "22.5ml" },
			{ name: "ファレルナム", amount: "15ml" },
		],
		instructions: [
			"すべての材料を背の高いグラスに注ぎ、ペブルアイスを加えます。",
			"スウィズル スティック (またはカクテル スプーン) を使って勢いよく混ぜ、グラスにさらにペブル アイスを入れて完成です。",
		],
		garnish: "ミントの葉とすりおろしたナツメグを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "dark-n-stormy.jpg",
	},
	{
		name: "ダーク・アンド・ストーミー",
		ingredients: [
			{ name: "ラム", amount: "60ml" },
			{ name: "ジンジャービール", amount: "100ml" },
		],
		instructions: [
			"氷を入れたハイボールグラスにジンジャービールを注ぎ、その上にラム酒を浮かべます。",
		],
		garnish: "ライムのくし切りまたはスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "dark-n-stormy.jpg",
	},
	{
		name: "ドンズ・スペシャル・ダイキリ",
		ingredients: [
			{ name: "ゴールド・ラム", amount: "30ml" },
			{ name: "キューバ産ラム", amount: "15ml" },
			{ name: "パッションフルーツシロップ", amount: "15ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "はちみつシロップ", amount: "15ml" },
		],
		instructions: [
			"砕いた氷と一緒にミルクシェイクミキサーで数秒間ブレンドし、脚付きコポグラスに注ぎます。",
			"グラスに砕いた氷をさらに注ぎます。",
		],
		garnish: "パッションフルーツ1/2個を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "espresso-martini.jpg",
	},
	{
		name: "エスプレッソ・マティーニ",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml" },
			{ name: "カルーア", amount: "30ml" },
			{ name: "シュガーシロップ", amount: "10ml" },
			{ name: "濃いエスプレッソ", amount: "1杯" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "コーヒー豆3粒。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "espresso-martini.jpg",
	},
	{
		name: "フェルナンディート",
		ingredients: [
			{ name: "フェルネット・ブランカ", amount: "50ml" },
			{ name: "コーラ", amount: "適量" },
		],
		instructions: [
			"フェルネット・ブランカを氷を入れたダブルオールドファッションドグラスに注ぎ、コーラでグラスをいっぱいに満たします。優しくかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "fernandito.jpg",
	},
	{
		name: "フレンチ・マティーニ",
		ingredients: [
			{ name: "ウォッカ", amount: "45ml" },
			{ name: "ラズベリー・リキュール", amount: "15ml" },
			{ name: "パイナップルジュース", amount: "15ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "レモンの皮からオイルを絞り出し、飲み物に注ぎます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "french-martini.jpg",
	},
	{
		name: "ジン・バジル・スマッシュ",
		ingredients: [
			{ name: "ジン", amount: "60ml" },
			{ name: "レモンジュース", amount: "22.5ml" },
			{ name: "シュガーシロップ", amount: "22.5ml" },
			{ name: "イタリアンバジルの葉", amount: "10枚" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに加えます。",
			"勢いよく振って冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "gin-basil-smash.jpg",
	},
	{
		name: "グラン・マルガリータ",
		ingredients: [
			{ name: "テキーラ", amount: "45ml" },
			{ name: "グラン・マルニエ", amount: "30ml" },
			{ name: "ライムジュース", amount: "15ml" },
		],
		instructions: [
			"ロックグラスの縁に良質の海塩を敷き詰めます。材料をシェーカーに注ぎます。",
			"グラスとシェイカーの両方に氷を入れます。",
			"10秒間強くシェイクし、濾してグラスに注ぎます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "illegal.jpg",
	},
	{
		name: "IBA Tiki",
		ingredients: [
			{ name: "ハバナ・クラブ プロフンド", amount: "30ml" },
			{ name: "ハバナ・クラブ スモーキー", amount: "30ml" },
			{ name: "アマレット・リキュール", amount: "15ml" },
			{ name: "フランジェリコ・リキュール", amount: "5ml" },
			{ name: "マラスキーノ・リキュール", amount: "5滴" },
			{ name: "パッションフルーツピュレ", amount: "30ml" },
			{ name: "パイナップルジュース", amount: "90ml" },
			{ name: "ライムジュース", amount: "30ml" },
			{ name: "生姜スライス", amount: "1枚" },
		],
		instructions: [
			"カクテルシェイカーにジンジブレの薄切りを入れて混ぜ、他の材料をすべて注ぎます。",
			"氷を入れて激しくシェイクします。",
			"砂利氷を入れた冷やしたティキグラスに注ぎます。",
		],
		garnish: "柑橘類と乾燥パイナップルのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "illegal.jpg",
	},
	{
		name: "イリーガル",
		ingredients: [
			{ name: "エスパディンメスカル", amount: "30ml" },
			{ name: "ホワイト・ラム", amount: "15ml" },
			{ name: "ファレルナム", amount: "15ml" },
			{ name: "マラスキーノ・リキュール", amount: "1バースプーン" },
			{ name: "フレッシュライムジュース", amount: "22.5ml" },
			{ name: "シンプルシロップ", amount: "15ml" },
			{ name: "卵白（お好みで）", amount: "数滴" },
		],
		instructions: [
			"すべての材料をシェイカーに注ぎ、氷を入れて勢いよくシェイクします。",
			"冷やしたカクテルグラスに注ぐか、伝統的な土製またはテラコッタ製のマグカップで「オン・ザ・ロック」としてお楽しみください。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "illegal.jpg",
	},
	{
		name: "ジャングル・バード",
		ingredients: [
			{ name: "ブラックストラップラム", amount: "45ml" },
			{ name: "カンパリ", amount: "22.5ml" },
			{ name: "パイナップルジュース", amount: "45ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "シュガーシロップ", amount: "15ml" },
		],
		instructions: [
			"すべての材料を氷を入れたシェイカーに入れてシェイクします。",
			"氷を入れたロックグラスに注ぎます。",
		],
		garnish: "パイナップルのくし切りを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "jungle-bird.jpg",
	},
	{
		name: "ミッショナリー・ダウンフォール",
		ingredients: [
			{ name: "ホワイト・ラム", amount: "30ml" },
			{ name: "ピーチブランデー", amount: "15ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "はちみつシロップ", amount: "30ml" },
			{ name: "ミントの葉", amount: "10枚" },
			{ name: "パイナップルの塊", amount: "3～4個" },
		],
		instructions: [
			"すべての材料を砕いた氷半カップと一緒に混ぜます。",
			"コッパグランデで提供します。",
		],
		garnish: "ミントの小枝とパイナップルのスライスを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "naked-and-famous.jpg",
	},
	{
		name: "ネイキッド・アンド・フェイマス",
		ingredients: [
			{ name: "メスカル", amount: "22.5ml" },
			{ name: "シャルトリューズ", amount: "22.5ml" },
			{ name: "アペロール", amount: "22.5ml" },
			{ name: "ライムジュース", amount: "22.5ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "naked-and-famous.jpg",
	},
	{
		name: "ニューヨーク・サワー",
		ingredients: [
			{ name: "ライ・ウイスキー", amount: "60ml", option_group: 2 },
			{ name: "バーボン", amount: "60ml", option_group: 2 },
			{ name: "シンプルシロップ", amount: "22.5ml" },
			{ name: "レモンジュース", amount: "30ml" },
			{ name: "卵白", amount: "数滴" },
			{ name: "赤ワイン", amount: "15ml" },
		],
		instructions: [
			"すべての材料をシェイカーに注ぎ、氷を入れて勢いよくシェイクします。",
			"氷を入れた冷やしたロックグラスに注ぎ、ワインを浮かべます。",
		],
		garnish: "レモンまたはオレンジの皮とチェリーを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "new-york-sour.jpg",
	},
	{
		name: "オールド・キューバン",
		ingredients: [
			{ name: "ミントの葉", amount: "6～8枚" },
			{ name: "ラム", amount: "45ml" },
			{ name: "ライムジュース", amount: "22.5ml" },
			{ name: "シンプルシロップ", amount: "30ml" },
			{ name: "ビターズ", amount: "2ダッシュ" },
			{ name: "シャンパン", amount: "60ml", option_group: 3 },
			{ name: "プロセッコ", amount: "60ml", option_group: 3 },
		],
		instructions: [
			"ワイン以外の材料をカクテル シェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたエレガントなカクテル グラスに注ぎます。",
			"スパークリングワインを注ぎます。",
		],
		garnish: "ミントの葉を添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "old-cuban.jpg",
	},
	{
		name: "パロマ",
		ingredients: [
			{ name: "テキーラ", amount: "50ml" },
			{ name: "フレッシュライム", amount: "5ml" },
			{ name: "塩", amount: "ひとつまみ" },
			{ name: "ピンクグレープフルーツソーダ", amount: "100ml" },
		],
		instructions: [
			"ハイボールグラスにテキーラを注ぎ、ライムジュースを絞ります。",
			"氷と塩を加え、ピンクグレープフルーツソーダを注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "paloma.jpg",
	},
	{
		name: "ペーパー・プレーン",
		ingredients: [
			{ name: "バーボン・ウイスキー", amount: "30ml" },
			{ name: "アマーロ・ノニーノ", amount: "30ml" },
			{ name: "アペロール", amount: "30ml" },
			{ name: "レモンジュース", amount: "30ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "paper-plane.jpg",
	},
	{
		name: "ペニシリン",
		ingredients: [
			{ name: "スコッチ・ウイスキー", amount: "60ml" },
			{ name: "ラガヴーリン", amount: "7.5ml" },
			{ name: "レモンジュース", amount: "22.5ml" },
			{ name: "はちみつシロップ", amount: "22.5ml" },
			{ name: "新鮮なショウガのスライス", amount: "2～3枚" },
		],
		instructions: [
			"シェイカーに生姜を入れて混ぜ、アイラ島のシングルモルトウイスキー以外の残りの材料を加えます。",
			"シェイカーに氷を入れてシェイクします。",
			"氷を入れたよく冷やしたオールドファッションドグラスに注ぎます。",
			"その上にシングルモルトウイスキーを浮かべます。",
		],
		garnish: "砂糖漬けの生姜のスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "penicillin.jpg",
	},
	{
		name: "ピスコパンチ",
		ingredients: [
			{ name: "ピスコ", amount: "60ml" },
			{ name: "パイナップルジュース", amount: "22.5ml" },
			{ name: "シンプルシロップ", amount: "15ml" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "白ワイン", amount: "30ml" },
			{ name: "チョウジ", amount: "3個" },
		],
		instructions: [
			"クローブとシロップを軽くつぶし、ワイン以外の残りの材料を加えます。",
			"勢いよく振って、大きめのゴブレットにダブルストレーナーで濾します。",
			"上にワインを加え、軽くかき混ぜます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "russian-spring-punch.jpg",
	},
	{
		name: "ポルノスター・マティーニ",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml" },
			{ name: "パッションフルーツリキュール", amount: "20ml" },
			{ name: "パッションフルーツピュレ", amount: "50ml" },
			{ name: "バニラシュガー", amount: "2バースプーン" },
			{ name: "シャンパン", amount: "50ml" },
		],
		instructions: [
			"すべての材料をカクテル シェイカーに注ぎ、氷と一緒によくシェイクし、冷やした大きめのカクテル グラスにダブル ストレーナーで注ぎます。",
			"シャンパン一杯を添えて。",
		],
		garnish: "パッションフルーツカップと砂糖を添えて飾り付けます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "russian-spring-punch.jpg",
	},
	{
		name: "ロシアン・スプリング・パンチ",
		ingredients: [
			{ name: "ウォッカ", amount: "25ml" },
			{ name: "レモンジュース", amount: "25ml" },
			{ name: "クレーム・ド・カシス", amount: "15ml" },
			{ name: "シュガーシロップ", amount: "10ml" },
			{ name: "スパークリングワイン", amount: "適量" },
		],
		instructions: [
			"スパークリングワイン以外の材料をカクテルシェーカーに注ぎ、氷を入れてよくシェイクし、氷を入れた冷やした背の高いタンブラーグラスに注ぎます。",
			"スパークリングワインを注ぎます。",
		],
		garnish: "ブラックベリーと、お好みでレモンスライスを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "russian-spring-punch.jpg",
	},
	{
		name: "シェリー・コブラー",
		ingredients: [
			{ name: "シェリー", amount: "45ml" },
			{ name: "パロ・コルタド", amount: "45ml" },
			{ name: "砂糖", amount: "小さじ1杯" },
			{ name: "オレンジの輪切り", amount: "1/2個" },
			{ name: "レモンの輪切り", amount: "1/2個" },
		],
		instructions: [
			"シェイカーにシェリー酒、砂糖、オレンジとレモンをそれぞれ 1/4 個ずつ入れ、氷を入れて勢いよくシェイクし、砕いた氷を入れたジュレップ カクテル カップに注ぎます。",
		],
		garnish: "新鮮なベリー、オレンジとレモンをそれぞれ1/4個ずつ飾り、ストローを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spritz.jpg",
	},
	{
		name: "サウスサイド",
		ingredients: [
			{ name: "ジン", amount: "60ml" },
			{ name: "レモンジュース", amount: "30ml" },
			{ name: "シンプルシロップ", amount: "15ml" },
			{ name: "ミントの葉", amount: "5～6枚" },
			{ name: "卵白", amount: "数滴" },
		],
		instructions: [
			"すべての材料をカクテル シェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテル グラスにダブル ストレーナーで注ぎます。",
			"注記：卵白を使用する場合は、激しく振ってください。",
		],
		garnish: "ミントの葉を添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spritz.jpg",
	},
	{
		name: "スパイシー・フィフティ",
		ingredients: [
			{ name: "ウォッカ", amount: "50ml" },
			{ name: "エルダーフラワー・コーディアル", amount: "15ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "はちみつシロップ", amount: "10ml" },
			{ name: "赤唐辛子薄切り", amount: "2枚" },
		],
		instructions: [
			"すべての材料をカクテル シェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテル グラスにダブル ストレーナーで注ぎます。",
		],
		garnish: "赤唐辛子を添える。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spritz.jpg",
	},
	{
		name: "スプリッツ",
		ingredients: [
			{ name: "プロセッコ", amount: "90ml" },
			{ name: "アペロール", amount: "60ml" },
			{ name: "ソーダ水", amount: "適量" },
		],
		instructions: [
			"氷を入れたワイングラスに全ての材料を入れます。",
			"軽くかき混ぜます。",
		],
		garnish: "オレンジのスライスを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spritz.jpg",
	},
	{
		name: "サファリング・バスタード",
		ingredients: [
			{ name: "コニャック", amount: "30ml", option_group: 4 },
			{ name: "ブランデー", amount: "30ml", option_group: 4 },
			{ name: "ジン", amount: "30ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "ビターズ", amount: "2ダッシュ" },
			{ name: "ジンジャービール", amount: "適量" },
		],
		instructions: [
			"ジンジャービール以外の材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクします。",
			"濾さずにコリンズグラスまたは元のグラスに注ぎます。",
			"S.バスタードのマグカップにジンジャービールを注ぎます。",
		],
		garnish: "ミントの葉と、お好みでオレンジのスライスを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spritz.jpg",
	},
	{
		name: "スリー・ドッツ・アンド・ダッシュ",
		ingredients: [
			{ name: "マルティニーク・ラム", amount: "45ml" },
			{ name: "ブレンド熟成ラム", amount: "15ml" },
			{ name: "ファレルナム", amount: "7.5ml" },
			{ name: "セントエリザベス・オールスパイス・ダム", amount: "7.5ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "オレンジジュース", amount: "15ml" },
			{ name: "はちみつシロップ", amount: "15ml" },
			{ name: "ビターズ", amount: "2ダッシュ" },
		],
		instructions: [
			"すべての材料を 12 オンスの砕いた氷とともにブレンダーに入れてフラッシュ ブレンドし、飲み物を脚付きコポ グラスに注ぎます。",
			"グラスに砕いた氷をさらに注ぎます。",
		],
		garnish: "チェリー 3 個と長方形に切ったパイナップル 1 個を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "spritz.jpg",
	},
	{
		name: "ティペラリー",
		ingredients: [
			{ name: "アイリッシュ・ウイスキー", amount: "50ml" },
			{ name: "ベルモット", amount: "25ml" },
			{ name: "シャルトリューズ", amount: "15ml" },
			{ name: "ビターズ", amount: "2ダッシュ" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたマティーニカクテルグラスに注ぎます。",
		],
		garnish: "オレンジのスライスを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "tipperary.jpg",
	},
	{
		name: "トミーズ・マルガリータ",
		ingredients: [
			{ name: "テキーラ", amount: "60ml" },
			{ name: "ライムジュース", amount: "30ml" },
			{ name: "アガベネクター", amount: "30ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、氷を入れた冷やしたロックグラスに注ぎます。",
		],
		garnish: "ライムのスライスを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "tommys-margarita.jpg",
	},
	{
		name: "トリニダード・サワー",
		ingredients: [
			{ name: "ビターズ", amount: "45ml" },
			{ name: "オルジェー・シロップ", amount: "30ml" },
			{ name: "レモンジュース", amount: "22.5ml" },
			{ name: "ライ・ウイスキー", amount: "15ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクします。",
			"冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "trinidad-sour.jpg",
	},
	{
		name: "VE.N.TO",
		ingredients: [
			{ name: "グラッパ", amount: "45ml" },
			{ name: "レモンジュース", amount: "22.5ml" },
			{ name: "はちみつシロップ", amount: "15ml" },
			{ name: "カモミール・コーディアル", amount: "15ml" },
			{ name: "卵白（お好みで）", amount: "数滴" },
		],
		instructions: [
			"すべての材料をシェイカーに注ぎ、氷を入れて勢いよくシェイクします。",
			"氷を入れた冷やした小さなタンブラーグラスに注ぎます。",
		],
		garnish: "レモンの皮と白ブドウを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 新時代の一杯"],
		imageUrl: "ve-n-to.jpg",
	},
];

const unforgettables = [
	{
		name: "アレクサンダー",
		ingredients: [
			{ name: "コニャック", amount: "30ml" },
			{ name: "クレーム・ド・カカオ", amount: "30ml" },
			{ name: "生クリーム", amount: "30ml" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"シェイクして冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "挽きたてのナツメグを上に振りかけます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "alexander.jpg", // R2にアップロードする画像ファイル名
	},
	{
		name: "アメリカーノ",
		ingredients: [
			{ name: "カンパリ", amount: "30ml" },
			{ name: "ベルモット", amount: "30ml" },
			{ name: "炭酸水", amount: "適量" },
		],
		instructions: [
			"氷を入れたオールドファッショングラスに材料を直接混ぜます。",
			"少量のソーダ水を加え、軽くかき混ぜます。",
		],
		garnish: "オレンジの半分のスライスとレモンの皮を飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "americano.jpg",
	},
	{
		name: "アビエーション",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "マラスキーノ・リキュール", amount: "15ml" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "クレーム・ド・バイオレット", amount: "5ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに加えます。",
			"砕いた氷と一緒にシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "お好みでマラスキーノ・チェリー。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "aviation.jpg",
	},
	{
		name: "エンジェル・フェイス",
		ingredients: [
			{ name: "ジン", amount: "30ml" },
			{ name: "アプリコット・ブランデー", amount: "30ml" },
			{ name: "カルヴァドス", amount: "30ml" },
		],
		instructions: [
			"氷が入ったカクテルシェイカーにすべての材料を注ぎます。",
			"シェイクして冷やしたカクテルグラスに注ぎます。 ",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "angel-face.jpg",
	},
	{
		name: "ビトウィーン・ザ・シーツ",
		ingredients: [
			{ name: "ラム", amount: "30ml" },
			{ name: "コニャック", amount: "30ml" },
			{ name: "トリプルセック", amount: "30ml" },
			{ name: "レモンジュース", amount: "20ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに加えます。",
			"氷と一緒にシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "between-the-sheets.jpg",
	},
	{
		name: "ブールヴァルディエ",
		ingredients: [
			{ name: "バーボン", amount: "45ml", option_group: 1 },
			{ name: "ライ・ウイスキー", amount: "45ml", option_group: 1 },
			{ name: "カンパリ", amount: "30ml" },
			{ name: "ベルモット", amount: "30ml" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "オレンジの皮を添え、お好みでレモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "boulevardier.jpg",
	},
	{
		name: "ブランデー・クラスタ",
		ingredients: [
			{ name: "ブランデー", amount: "52.5ml" },
			{ name: "マラスキーノ・リキュール", amount: "7.5ml" },
			{ name: "キュラソー", amount: "茶匙1杯" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "シンプルシロップ", amount: "茶匙1杯" },
			{ name: "アロマティックビターズ", amount: "2振" },
		],
		instructions: [
			"すべての材料を氷と一緒にミキシングボウルで混ぜます。",
			"グラスに注ぎ、用意しておいた細長いカクテルグラスに注ぎます。",
		],
		garnish:
			"オレンジ（またはレモン）のスライスをグラスの縁にこすりつけ、白い砂糖を細かく砕いて、グラスの縁に砂糖がくっつくようにします。オレンジ/レモンの皮をグラスの内側に慎重に丸めて置きます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "brandy-crusta.jpg",
	},
	{
		name: "カジノ",
		ingredients: [
			{ name: "ジン", amount: "40ml" },
			{ name: "マラスキーノ・リキュール", amount: "10ml" },
			{ name: "レモンジュース", amount: "10ml" },
			{ name: "オレンジビターズ", amount: "2ダッシュ" },
		],
		instructions: [
			"すべての材料をカクテルシェーカーに注ぎ、氷と一緒によくシェイクし、濾します。",
			"氷を入れた冷やしたロックグラスに注ぎます。",
		],
		garnish: "レモンの皮とマラスキーノ・チェリーを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "casino.jpg",
	},
	{
		name: "クローバー・クラブ",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "ラズベリーシロップ", amount: "15ml" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "卵白", amount: "数滴" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "新鮮なラズベリー。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "clover-club.jpg",
	},
	{
		name: "ダイキリ",
		ingredients: [
			{ name: "ラム", amount: "60ml" },
			{ name: "ライムジュース", amount: "20ml" },
			{ name: "砂糖", amount: "2バースプーン" },
		],
		instructions: [
			"カクテルシェイカーにすべての材料を入れ、よくかき混ぜて砂糖を溶かします。",
			"氷を加えてシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "daiquiri.jpg",
	},
	{
		name: "ドライ・マティーニ",
		ingredients: [
			{ name: "ジン", amount: "60ml" },
			{ name: "ベルモット", amount: "10ml" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたマティーニカクテルグラスに注ぎます。",
		],
		garnish:
			"レモンの皮から搾ったオイルをドリンクにかけたり、お好みでグリーンオリーブを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "dry-martini.jpg",
	},
	{
		name: "ジン・フィズ",
		ingredients: [
			{ name: "ジン", amount: "45ml" }
			{ name: "レモンジュース", amount: "30ml" },
			{ name: "シンプルシロップ", amount: "10ml" },
			{ name: "炭酸水", amount: "適量" },
		],
		instructions: [
			"ソーダ水以外の全ての材料を氷と一緒にシェイクします。",
			"細くて背の高いタンブラーグラスに注ぎ、ソーダ水を少し加えます。",
			"注記：氷を入れずにお召し上がりください。",
		],
		garnish: "レモンのスライス、お好みでレモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "gin-fizz.jpg",
	},
	{
		name: "ハンキー・パンキー",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "ベルモット", amount: "45ml" },
			{ name: "フェルネット", amount: "7.5ml" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "オレンジの皮。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "hanky-panky.jpg",
	},
	{
		name: "ジョン・コリンズ",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "レモンジュース", amount: "30ml" },
			{ name: "シンプルシロップ", amount: "15ml" },
			{ name: "炭酸水", amount: "60ml" },
		],
		instructions: [
			"氷を入れたハイボールに材料をすべて注ぎ、軽く混ぜます。",
		],
		garnish: "レモンスライスとマラスキーノ・チェリーを添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "john-collins.jpg",
	},
	{
		name: "ラスト・ワード",
		ingredients: [
			{ name: "ジン", amount: "22.5ml" },
			{ name: "シャルトルーズ", amount: "22.5ml" },
			{ name: "マラスキーノ・リキュール", amount: "22.5ml" },
			{ name: "ライムジュース", amount: "22.5ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに加えます。",
			"氷と一緒にシェイクし、冷やしたカクテルグラスに注ぎます。",],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "last-word.jpg",
	},
	{
		name: "マンハッタン",
		ingredients: [
			{ name: "ライ・ウイスキー", amount: "50ml" },
			{ name: "ベルモット", amount: "20ml" },
			{ name: "ビターズ", amount: "1ダッシュ" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "カクテルチェリーを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "manhattan.jpg",
	},
	{
		name: "マルティネス",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "ベルモット", amount: "45ml" },
			{ name: "マラスキーノ・リキュール", amount: "1バースプーン" },
			{ name: "ビターズ", amount: "2ダッシュ" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "レモンの皮。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "martinez.jpg",
	},
	{
		name: "メアリー・ピックフォード",
		ingredients: [
			{ name: "ラム", amount: "45ml" },
			{ name: "パイナップルジュース", amount: "45ml" },
			{ name: "マラスキーノ・リキュール", amount: "7.5ml" },
			{ name: "グレナデン・シロップ", amount: "5ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "mary-pickford.jpg",
	},
	{
		name: "モンキー・グランド",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "オレンジジュース", amount: "45ml" },
			{ name: "アブサン", amount: "1tsp" },
			{ name: "グレナデン・シロップ", amount: "1tsp" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "monkey-gland.jpg",
	},
	{
		name: "ネグローニ",
		ingredients: [
			{ name: "ジン", amount: "30ml" },
			{ name: "カンパリ", amount: "30ml" },
			{ name: "ベルモット", amount: "30ml" },
		],
		instructions: [
			"氷を入れた冷やしたオールドファッショングラスにすべての材料を直接注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "オレンジの半分のスライスを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "negroni.jpg",
	},
	{
		name: "オールド・ファッションド",
		ingredients: [
			{ name: "バーボン", amount: "45ml", option_group: 1 },
			{ name: "ライ・ウイスキー", amount: "45ml", option_group: 1 },
			{ name: "角砂糖", amount: "1個" },
			{ name: "ビターズ", amount: "数振" },
			{ name: "水", amount: "数振" },
		],
		instructions: [
			"角砂糖をオールドファッショングラスに入れ、ビターシュガーで十分に浸し、少量の水を加えます。溶けるまで混ぜます。グラスに氷を入れ、ウイスキーを注ぎます。",
			"軽くかき混ぜます。",],
		garnish: "オレンジのスライスまたは皮とカクテルチェリーを飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "old-fashioned.jpg",
	},
	{
		name: "パラダイス",
		ingredients: [
			{ name: "ジン", amount: "30ml" },
			{ name: "アプリコット・ブランデー", amount: "20ml" },
			{ name: "オレンジジュース", amount: "15ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "paradise.jpg",
	},
	{
		name: "プランターズ・パンチ",
		ingredients: [
			{ name: "ラム", amount: "45ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "サトウキビジュース", amount: "30ml" },
		],
		instructions: [
			"すべての材料を小さなタンブラーまたは一般的なテラコッタのグラスに直接注ぎます。",
			"注記：お好みに応じて水や氷、フレッシュジュースなどで割ってお召し上がりください。",],
		garnish: "オレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "planters-punch.jpg",
	},
	{
		name: "ポート・フリップ",
		ingredients: [
			{ name: "ブランデー", amount: "15ml" },
			{ name: "ポートワイン", amount: "45ml" },
			{ name: "卵黄", amount: "10ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "挽きたてのナツメグを振りかける。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "porto-flip.jpg",
	},
	{
		name: "ラモス・フィズ",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "ライムジュース", amount: "15ml" },
			{ name: "レモンジュース", amount: "15ml" },
			{ name: "シュガーシロップ", amount: "30ml" },
			{ name: "生クリーム", amount: "60ml" },
			{ name: "卵白", amount: "30ml" },
			{ name: "オレンジフラワーウォーター", amount: "3ダッシュ" },
			{ name: "バニラエッセンス", amount: "2滴ml" },
			{ name: "炭酸水", amount: "適量" },
		],
		instructions: [
			"ソーダ水以外の材料を氷を入れたカクテルシェイカーに注ぎます。",
			"2分間シェイクし、グラスにダブルストレーナーで濾し、ドリンクをシェイカーに戻し、氷を入れずに1分間激しくシェイクします。",
			"ハイボールグラスに注ぎ、ソーダを注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "ramos-fizz.jpg",
	},
	{
		name: "リメンバー・ザ・メイン",
		ingredients: [
			{ name: "ライ・ウイスキー", amount: "60ml" },
			{ name: "ベルモット", amount: "22.5ml" },
			{ name: "チェリー・ブランデー", amount: "15ml" },
			{ name: "アブサン", amount: "7.5ml" },
		],
		instructions: [
			"アブサンをクープグラスに注ぎ、内側が完全に覆われるまで回します。",
			"アブサンを捨て、グラスを脇に置きます。残りの材料をミキシンググラスに入れ、氷を4分の3まで入れます。冷えるまでかき混ぜ、アブサンで冷やしたグラスに注ぎます。",],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "remember-the-maine.jpg",
	},
	{
		name: "ラスティ・ネイル",
		ingredients: [
			{ name: "スコッチ・ウイスキー", amount: "45ml" },
			{ name: "ドランブイ", amount: "25ml" },
		],
		instructions: [
			"すべての材料を氷を入れたオールドファッショングラスに直接注ぎます。",
			"軽くかき混ぜます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "rusty-nail.jpg",
	},
	{
		name: "サゼラック",
		ingredients: [
			{ name: "コニャック", amount: "50ml" },
			{ name: "アブサン", amount: "10ml" },
			{ name: "角砂糖", amount: "1個" },
			{ name: "ビターズ", amount: "2ダッシュ" },
		],
		instructions: [
			"冷やしたオールドファッショングラスをアブサンで洗い、砕いた氷を加えて脇に置きます。残りの材料をミキシンググラスに氷を入れ、ステアします。",
			"用意したグラスから氷と余分なアブサンを取り除き、混ぜた飲み物をグラスに注ぎます。",
		],
		garnish: "レモンの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "sazerac.jpg",
	},
	{
		name: "サイドカー",
		ingredients: [
			{ name: "コニャック", amount: "50ml" },
			{ name: "トリプルセック", amount: "20ml" },
			{ name: "レモンジュース", amount: "20ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "sidecar.jpg",
	},
	{
		name: "スティンガー",
		ingredients: [
			{ name: "コニャック", amount: "50ml" },
			{ name: "ミントクリーム ", amount: "20ml" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたマティーニカクテルグラスに注ぎます。",],
		garnish: "お好みでミントの葉を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "stinger.jpg",
	},
	{
		name: "タキシード",
		ingredients: [
			{ name: "ジン", amount: "30ml" },
			{ name: "ベルモット", amount: "30ml" },
			{ name: "マラスキーノ・リキュール", amount: "1/2バースプーン" },
			{ name: "アブサン", amount: "1/4バースプーン" },
			{ name: "ビターズ", amount: "3ダッシュ" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎ、よくかき混ぜます。",
			"冷やしたマティーニカクテルグラスに注ぎます。",
		],
		garnish: "チェリーとレモンの皮を添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "tuxedo.jpg",
	},
	{
		name: "ヴュー・カレ",
		ingredients: [
			{ name: "ライ・ウイスキー", amount: "30ml" },
			{ name: "コニャック", amount: "30ml" },
			{ name: "ベルモット", amount: "30ml" },
			{ name: "ベネディクティン", amount: "1バースプーン" },
			{ name: "ビターズ", amount: "2ダッシュ" },
		],
		instructions: [
			"すべての材料を氷を入れたミキシンググラスに注ぎます。",
			"よくかき混ぜます。冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "オレンジの皮とマラスキーノチェリーを添えて飾ります。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "vieux-carre.jpg",
	},
	{
		name: "ウィスキー・サワー",
		ingredients: [
			{ name: "バーボン・ウイスキー", amount: "45ml" },
			{ name: "レモンジュース", amount: "25ml" },
			{ name: "シュガーシロップ", amount: "20ml" },
			{ name: "卵白", amount: "数滴" },
		],
		instructions: [
			"氷を入れたカクテルシェイカーにすべての材料を注ぎ、よくシェイクします。",
			"コブラーグラスに濾します。「オン・ザ・ロック」で提供する場合は、材料を濾します。",
			"氷が入ったオールドファッショングラスに注ぎます。",
			"注記：卵白を使用する場合は、卵白の泡を出して混ぜ合わせるために、少し強く振ってください。",
		],
		garnish: "オレンジのスライス半分とマラスキーノチェリーを飾り、お好みでオレンジの皮を添えます。",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "whiskey-sour.jpg",
	},
	{
		name: "ホワイト・レディ",
		ingredients: [
			{ name: "ジン", amount: "40ml" },
			{ name: "トリプルセック", amount: "30ml" },
			{ name: "レモンジュース", amount: "20ml" },
		],
		instructions: [
			"すべての材料をカクテルシェイカーに注ぎ、氷と一緒によくシェイクし、冷やしたカクテルグラスに注ぎます。",
		],
		garnish: "",
		tags: ["国際バーテンダー協会公認カクテル - 忘れられないカクテル"],
		imageUrl: "white-lady.jpg",
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
	console.log("🗑️ Cleared existing data.");

	const allCocktails = [...unforgettables, ...contemporaryClassics, ...newEra];

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

	// 材料の登録
	const ingredientMap = new Map<string, number>();
	for (const cocktailData of allCocktails) {
		for (const ing of cocktailData.ingredients) {
			if (!ingredientMap.has(ing.name)) {
				const [newIngredient] = await db
					.insert(ingredients)
					.values({ name: ing.name })
					.returning({ id: ingredients.id });
				ingredientMap.set(ing.name, newIngredient.id);
			}
		}
	}
	console.log("🌿 Seeded ingredients.");

	// カクテル、作り方、中間テーブルの登録
	for (const cocktailData of allCocktails) {
		const cocktailId = uuidv4();

		// cocktails テーブル
		await db.insert(cocktails).values({
			id: cocktailId,
			name: cocktailData.name,
			description: "", // OpenAPIで生成するため空にする
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
			cocktailData.ingredients.map((ing: any) => ({
				cocktailId,
				ingredientId: ingredientMap.get(ing.name)!,
				amount: ing.amount,
				option_group: ing.option_group,
			})),
		);

		// cocktail_tags テーブル
		await db.insert(cocktailTags).values(
			cocktailData.tags.map((tagName) => ({
				cocktailId,
				tagId: tagMap.get(tagName)!,
			})),
		);
	}
	console.log(`🍹 Seeded ${allCocktails.length} cocktails.`);

	console.log("✅ Seeding complete.");
}
