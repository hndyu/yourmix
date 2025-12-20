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
import type { Cocktail } from "@/app/types/cocktail";
import { and, asc, eq, sql } from "drizzle-orm";

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

export async function getCocktailBySlug(
	slug: string,
	userId?: string,
): Promise<Cocktail | null> {
	const db = await getDb();

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
			schema.ingredientGroups,
			eq(schema.ingredients.groupId, schema.ingredientGroups.id),
		)
		.leftJoin(
			schema.categories,
			eq(schema.ingredientGroups.categoryId, schema.categories.id),
		)
		.orderBy(
			asc(schema.categories.sortOrder),
			asc(schema.ingredientGroups.sortOrder),
			asc(schema.instructions.step),
		);

	if (results.length === 0) {
		return null;
	}

	const cocktailId = results[0].cocktails.id;

	// ユーティリティ: モックが関数を返す場合に対応して解決する
	const resolveQuery = async (q: unknown) => {
		if (typeof q === "function") {
			// 関数を返すモックは呼び出してPromiseを得る
			return await q();
		}
		// 通常のPromise/thenableまたは値をawaitする
		return await q;
	};

	// 1. Delicious数 (いいね数) の取得
	const countQuery = db
		.select({ count: sql<number>`count(*)` })
		.from(schema.deliciousLikes)
		.where(eq(schema.deliciousLikes.cocktailId, cocktailId));
	const [countResult] = await resolveQuery(countQuery);

	// 2. ユーザーがいいねしているか確認
	let isLiked = false;
	if (userId) {
		const likeQuery = db
			.select()
			.from(schema.deliciousLikes)
			.where(
				and(
					eq(schema.deliciousLikes.cocktailId, cocktailId),
					eq(schema.deliciousLikes.userId, userId),
				),
			);
		const [like] = await resolveQuery(likeQuery);
		isLiked = !!like;
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

			deliciousCount: countResult?.count ?? 0,
			isLiked: isLiked,
		} as Cocktail,
	);

	return cocktailData;
}
