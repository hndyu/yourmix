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

export async function POST(request: Request) {
	if (!apiKey) {
		return NextResponse.json(
			{ error: "APIキーが設定されていません。" },
			{ status: 500 },
		);
	}

	try {
		const db = await getDb();

		const { ingredients: selectedIngredients } = (await request.json()) as {
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

		// DBから有効な材料グループ名を取得
		const validGroups = await db
			.select({ displayName: schema.ingredientGroups.displayName })
			.from(schema.ingredientGroups);

		// DBから有効な材料名を取得
		const validIngredients = await db
			.select({ name: schema.ingredients.name })
			.from(schema.ingredients);

		const validIngredientNames = [
			...validGroups.map((g) => g.displayName),
			...validIngredients.map((i) => i.name),
		];

		// 送信された材料名がすべて有効か検証
		for (const ingredient of selectedIngredients) {
			if (!validIngredientNames.includes(ingredient)) {
				return NextResponse.json(
					{ error: `不正な材料名です: ${ingredient}` },
					{ status: 400 },
				);
			}
		}

		// 材料リストを処理して、特定の材料名をより具体的な指示に置き換える
		const processedIngredients = await Promise.all(
			selectedIngredients.map(async (ingredient) => {
				if (ingredient === "スピリッツ（その他）") {
					const group = await db
						.select({ description: schema.ingredientGroups.description })
						.from(schema.ingredientGroups)
						.where(eq(schema.ingredientGroups.displayName, ingredient))
						.limit(1);

					if (group.length > 0 && group[0].description) {
						return group[0].description;
					}
				}

				// それ以外の場合は、元の材料名をそのまま使用
				return ingredient;
			}),
		);

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
