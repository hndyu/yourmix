import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as schema from "@/app/db/schema";
import getDb from "@/app/db/db";

/**
 * カクテル一覧を取得するAPIエンドポイント
 * GET /api/cocktails
 * @param request - NextRequestオブジェクト
 * @returns カクテルデータのJSONレスポンス
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const ingredientsParam = searchParams.get("ingredients");
		const selectedIngredientIds = ingredientsParam
			? ingredientsParam.split(",").map(Number)
			: [];

		const db = getDb();

		// DrizzleのRelational Queriesを使用してデータを取得
		const allCocktails = await db.query.cocktails.findMany({
			where:
				selectedIngredientIds.length > 0
					? (cocktails, { exists }) =>
							exists(
								db
									.select()
									.from(schema.cocktailIngredients)
									.where(
										and(
											eq(schema.cocktailIngredients.cocktailId, cocktails.id),
											inArray(
												schema.cocktailIngredients.ingredientId,
												selectedIngredientIds,
											),
										),
									),
							)
					: undefined,
			with: {
				cocktailIngredients: {
					with: {
						ingredient: true,
					},
				},
				instructions: {
					orderBy: (instructions, { asc }) => [asc(instructions.step)],
				},
				cocktailTags: {
					with: {
						tag: true,
					},
				},
			},
		});

		// APIレスポンスの型に変換
		const formattedCocktails = allCocktails.map((cocktail) => ({
			...cocktail,
			imageUrl: cocktail.imageUrl ?? undefined,
			description: cocktail.description ?? "",
			garnish: cocktail.garnish ?? undefined,
			ingredients: cocktail.cocktailIngredients.map((ci) => ({
				id: ci.ingredient.id,
				name: ci.ingredient.name,
				amount: ci.amount,
				category: ci.ingredient.categoryId ?? "",
			})),
			tags: cocktail.cocktailTags.map((ct) => ct.tag.name),
			instructions: cocktail.instructions.map((inst) => inst.text),
		}));

		return NextResponse.json(
			{ cocktails: formattedCocktails },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching cocktails:", error);
		return NextResponse.json(
			{ error: "カクテルの取得中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}
