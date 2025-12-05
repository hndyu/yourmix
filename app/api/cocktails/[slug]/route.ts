import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as schema from "@/app/db/schema";
import getDb from "@/app/db/db";
import type { Cocktail } from "@/app/types/cocktail";

/**
 * 特定のカクテルを取得するAPIエンドポイント
 * GET /api/cocktails/[slug]
 */

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		const { slug } = await params;
		if (!slug) {
			return NextResponse.json(
				{ error: "スラグが指定されていません。" },
				{ status: 400 },
			);
		}

		const db = getDb();

		// 特定のスラグに一致するカクテル情報をJOINして取得
		const results = await db
			.select()
			.from(schema.cocktails)
			.where(eq(schema.cocktails.slug, slug))
			.leftJoin(
				schema.cocktailIngredients,
				eq(schema.cocktails.id, schema.cocktailIngredients.cocktailId),
			)
			.leftJoin(
				schema.ingredients,
				eq(schema.cocktailIngredients.ingredientId, schema.ingredients.id),
			)
			.leftJoin(
				schema.cocktailTags,
				eq(schema.cocktails.id, schema.cocktailTags.cocktailId),
			)
			.leftJoin(schema.tags, eq(schema.cocktailTags.tagId, schema.tags.id))
			.leftJoin(
				schema.instructions,
				eq(schema.cocktails.id, schema.instructions.cocktailId),
			)
			.leftJoin(
				schema.categories,
				eq(schema.ingredients.categoryId, schema.categories.id),
			)
			.leftJoin(
				schema.ingredientGroups,
				eq(schema.ingredients.groupId, schema.ingredientGroups.id),
			)
			.orderBy(
				asc(schema.categories.sortOrder),
				asc(schema.ingredientGroups.sortOrder),
				asc(schema.instructions.step),
			);

		if (results.length === 0) {
			return NextResponse.json(
				{ error: "指定されたカクテルが見つかりません。" },
				{ status: 404 },
			);
		}

		// 取得したデータをカクテルオブジェクトに整形
		const cocktailData = results.reduce(
			(acc, row) => {
				acc.ingredients = acc.ingredients || [];
				acc.tags = acc.tags || [];
				acc.instructions = acc.instructions || [];

				if (
					row.ingredients &&
					row.cocktail_ingredients &&
					!acc.ingredients.some((i) => i.id === row.ingredients?.id)
				) {
					acc.ingredients.push({
						...row.ingredients,
						category: row.categories?.name ?? "", // categoryがnullの場合に空文字を設定
						amount: row.cocktail_ingredients?.amount,
						option_group: row.cocktail_ingredients?.option_group ?? undefined,
					});
				}
				if (row.tags && !acc.tags.includes(row.tags.name)) {
					acc.tags.push(row.tags.name);
				}
				if (
					row.instructions &&
					!acc.instructions.includes(row.instructions.text)
				) {
					acc.instructions.push(row.instructions.text);
				}
				return acc;
			},
			{
				...results[0].cocktails,
				ingredients: [],
				tags: [],
				instructions: [],
			} as Cocktail,
		);

		return NextResponse.json({ cocktail: cocktailData }, { status: 200 });
	} catch (error) {
		console.error("Error fetching cocktail for slug:", error);
		return NextResponse.json(
			{ error: "カクテルの取得中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}
