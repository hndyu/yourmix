import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

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
		const { ingredients } = (await request.json()) as { ingredients: string[] };

		if (
			!ingredients ||
			!Array.isArray(ingredients) ||
			ingredients.length === 0
		) {
			return NextResponse.json(
				{ error: "材料が指定されていません。" },
				{ status: 400 },
			);
		}

		// 材料リストを処理して、特定の材料名をより具体的な指示に置き換える
		const processedIngredients = ingredients.map((ingredient) => {
			if (ingredient === "その他の蒸留酒") {
				return "ジン・ウォッカ・ラム・テキーラ・ウイスキー・ブランデー以外の蒸留酒";
			}
			if (ingredient === "その他") {
				return "醸造酒・蒸留酒・混成酒・ノンアルコール・クリーム・シロップ・果物・ピュレ・卵・砂糖・塩以外のもの";
			}
			return ingredient;
		});

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: `${processedIngredients.join(
				"、",
			)}をすべて材料として使い、独創的で美味しいオリジナルカクテルのレシピを1つ提案してください。回答は必ず日本語で行ってください。`,
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
