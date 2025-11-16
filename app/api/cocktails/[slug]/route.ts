import { getCloudflareContext } from "@opennextjs/cloudflare";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { NextResponse } from "next/server";
import type { Env } from "../../../../cloudflare-env";
import {
	categories,
	cocktailIngredients,
	cocktailTags,
	cocktails,
	ingredientGroups,
	ingredients,
	instructions,
	tags,
} from "../../../../schema";
import type { Cocktail } from "../../../types/cocktail";

/**
 * 特定のカクテルを取得するAPIエンドポイント
 * GET /api/cocktails/[slug]
 */

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	try {
		const { slug } = await params;
		if (!slug) {
			return NextResponse.json(
				{ error: "スラグが指定されていません。" },
				{ status: 400 },
			);
		}

		// Cloudflare環境からコンテキストを取得
		const context = getCloudflareContext();
		const env = context.env as Env;

		if (!env.DB) {
			console.error("DB binding is not available.");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}
		const db = drizzle(env.DB);

		// 特定のスラグに一致するカクテル情報をJOINして取得
		const results = await db
			.select()
			.from(cocktails)
			.where(eq(cocktails.slug, slug))
			.leftJoin(
				cocktailIngredients,
				eq(cocktails.id, cocktailIngredients.cocktailId),
			)
			.leftJoin(
				ingredients,
				eq(cocktailIngredients.ingredientId, ingredients.id),
			)
			.leftJoin(cocktailTags, eq(cocktails.id, cocktailTags.cocktailId))
			.leftJoin(tags, eq(cocktailTags.tagId, tags.id))
			.leftJoin(instructions, eq(cocktails.id, instructions.cocktailId))
			.leftJoin(categories, eq(ingredients.categoryId, categories.id))
			.leftJoin(ingredientGroups, eq(ingredients.groupId, ingredientGroups.id))
			.orderBy(
				asc(categories.sortOrder),
				asc(ingredientGroups.sortOrder),
				asc(instructions.step),
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
