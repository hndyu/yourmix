import { GoogleGenAI, Type } from "@google/genai";
import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as schema from "@/app/db/schema";
import getDb from "@/app/db/db";

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
		const db = getDb();

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

		// 材料リストを処理して、特定の材料名をより具体的な指示に置き換える
		const processedIngredients = await Promise.all(
			selectedIngredients.map(async (ingredient) => {
				if (ingredient === "その他の蒸留酒") {
					// "蒸留酒"カテゴリのIDを取得
					const spiritsCategory = await db
						.select({ id: schema.categories.id })
						.from(schema.categories)
						.where(eq(schema.categories.name, "蒸留酒"))
						.limit(1);

					if (spiritsCategory.length > 0) {
						const spiritsCategoryId = spiritsCategory[0].id;

						// "蒸留酒"カテゴリに属し、"その他の蒸留酒"グループ以外のグループ名を取得
						const spiritGroups = await db
							.selectDistinct({
								displayName: schema.ingredientGroups.displayName,
							})
							.from(schema.ingredientGroups)
							.innerJoin(
								schema.ingredients,
								eq(schema.ingredientGroups.id, schema.ingredients.groupId),
							)
							.where(
								and(
									eq(schema.ingredients.categoryId, spiritsCategoryId),
									ne(schema.ingredientGroups.displayName, "その他の蒸留酒"),
								),
							);

						const exclusionList = spiritGroups
							.map((g) => g.displayName)
							.join("・");
						return `${exclusionList}以外の蒸留酒`;
					}
				}

				if (ingredient === "その他") {
					// "その他"カテゴリ以外のカテゴリ名を取得
					const otherCategories = await db
						.select({ name: schema.categories.name })
						.from(schema.categories)
						.where(ne(schema.categories.name, "その他"));

					const exclusionList = otherCategories.map((c) => c.name).join("・");
					return `${exclusionList}など以外のもの`;
				}

				// それ以外の場合は、元の材料名をそのまま使用
				return ingredient;
			}),
		);

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
