import { getDb } from "@/app/db/db";
import {
	categories,
	cocktailIngredients,
	cocktailTags,
	cocktails,
	deliciousLikes,
	ingredientGroups,
	ingredients,
	instructions,
	tags,
} from "@/app/db/schema";
import { GoogleGenAI, Type } from "@google/genai";
import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

const schema = {
	cocktails,
	cocktailIngredients,
	cocktailTags,
	deliciousLikes,
	ingredients,
	tags,
	instructions,
	categories,
	ingredientGroups,
};

// APIキーを環境変数から取得
const apiKey = process.env.GEMINI_API_KEY;

// apiKeyが未設定の場合はエラーを返す
if (!apiKey) {
	console.error("GEMINI_API_KEY is not set.");
}

// GoogleGenAIのインスタンスを初期化
const ai = new GoogleGenAI({});

// コア体験なので認証（ログイン）なしでもユーザーが使える状態を保つ
// 無料枠のGemini APIを使用しているのでリクエストが多いとエラーになるが現時点では許容する
// 将来的に無料枠の多いGemma APIをテストする予定
export async function POST(request: Request) {
	if (!apiKey) {
		return NextResponse.json(
			{ error: "APIキーが設定されていません。" },
			{ status: 500 },
		);
	}

	let body: { ingredients?: unknown };
	try {
		body = await request.json();
	} catch (error) {
		return NextResponse.json(
			{ error: "リクエスト形式が正しくありません。" },
			{ status: 400 },
		);
	}

	try {
		const db = await getDb();

		const { ingredients: selectedIngredients } = (body || {}) as {
			ingredients: string[];
		};
		if (
			!selectedIngredients ||
			!Array.isArray(selectedIngredients) ||
			selectedIngredients.length === 0
		) {
			return NextResponse.json(
				{ error: "材料が指定されていません。" },
				{ status: 400 },
			);
		}

		// ⚡ Bolt: Parallelize independent DB calls to reduce total latency
		// Expected impact: Saves one sequential DB round-trip.
		const [validGroups, validIngredients] = await Promise.all([
			// DBから有効な材料グループ名を取得 (descriptionも併せて取得して後のクエリを削減)
			db
				.select({
					displayName: schema.ingredientGroups.displayName,
					description: schema.ingredientGroups.description,
				})
				.from(schema.ingredientGroups),
			// DBから有効な材料名を取得
			db
				.select({ name: schema.ingredients.name })
				.from(schema.ingredients),
		]);

		// ⚡ Bolt: Use a Map for O(1) lookup of group descriptions
		// Expected impact: Eliminates sequential DB queries within the mapping loop.
		const groupDescriptionMap = new Map(
			validGroups.map((g) => [g.displayName, g.description]),
		);

		// ⚡ Bolt: Use a Set for O(1) ingredient validation
		// Prevents O(N * M) complexity where N is total ingredients and M is selected ingredients.
		const validIngredientNamesSet = new Set([
			...validGroups.map((g) => g.displayName),
			...validIngredients.map((i) => i.name),
		]);

		// 送信された材料名がすべて有効か検証
		for (const ingredient of selectedIngredients) {
			if (!validIngredientNamesSet.has(ingredient)) {
				return NextResponse.json(
					{ error: `不正な材料名です: ${ingredient}` },
					{ status: 400 },
				);
			}
		}

		// 材料リストを処理して、特定の材料名をより具体的な指示に置き換える
		// ⚡ Bolt: Optimized lookup using pre-calculated Map instead of sequential DB queries
		// Expected impact: Reduces O(M) sequential queries to O(M) synchronous lookups.
		const processedIngredients = selectedIngredients.map((ingredient) => {
			if (ingredient === "スピリッツ（その他）") {
				const description = groupDescriptionMap.get(ingredient);
				if (description) {
					return description;
				}
			}
			return ingredient;
		});

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: `あなたは世界的に評価の高いプロのミクソロジストです。
以下の材料をベースに、創造性に溢れ、かつ味のバランスが完璧に整ったオリジナルのカクテルレシピを1つ考案してください。

材料: ${processedIngredients.join("、")}

## ガイドライン:
1. **味の構成**: ベース、酸味、甘味、苦味、そして香りのレイヤーを深く考慮してください。
2. **ネーミング**: カクテルのコンセプトを象徴する、洗練された印象的な名前を付けてください。
3. **説明文**: バーのメニューに相応しい、飲む人の期待を高める情緒的で魅力的な説明文を作成してください。
4. **手順**: プロの技術に基づいた、明確で再現性の高いステップを記述してください。
5. **用語**: カジュアル層がターゲットのため、専門用語は避けてください。
6. **言語**: 日本人向けに書いてください。基本的にはアルファベットではなくカタカナ表記が推奨されます。`,
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.ARRAY,
					nullable: false,
					items: {
						type: Type.OBJECT,
						properties: {
							name: {
								type: Type.STRING,
							},
							description: {
								type: Type.STRING,
							},
							ingredients: {
								type: Type.ARRAY,
								items: {
									type: Type.OBJECT,
									properties: {
										name: {
											type: Type.STRING,
										},
										amount: {
											type: Type.STRING,
										},
									},
									required: ["name", "amount"],
								},
							},
							instructions: {
								type: Type.ARRAY,
								items: {
									type: Type.STRING,
								},
							},
							garnish: {
								type: Type.STRING,
							},
						},
						required: ["name", "ingredients", "instructions"],
						propertyOrdering: ["name", "ingredients"],
					},
				},
			},
		});

		try {
			const responseText = response.text;
			if (!responseText) {
				throw new Error("AIからの応答が空です。");
			}
			const cocktailData = JSON.parse(responseText)[0];
			// AIが生成したデータはそのままクライアントに返す
			return NextResponse.json(cocktailData);
		} catch (e) {
			console.error("Failed to parse Gemini response:", response.text);
			return NextResponse.json(
				{ error: "AIからの応答を解析できませんでした。" },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Error generating cocktail:", error);
		return NextResponse.json(
			{ error: "カクテルの生成中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}
