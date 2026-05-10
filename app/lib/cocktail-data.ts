import { getDb } from "@/app/db/db";
import { cocktailTags, deliciousLikes, tags } from "@/app/db/schema";
import type { Cocktail, Tag } from "@/app/types/cocktail";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

// ⚡ Bolt: Use React.cache to deduplicate data fetching within a single request.
// Especially useful for metadata generation and page rendering sharing the same data.
export const getCocktailBySlug = cache(
	async (slug: string, userId?: string): Promise<Cocktail | null> => {
		const db = await getDb();

		// ⚡ Bolt: Consolidate relational query and aggregate counts into a single SQL-level operation using `extras`.
		// This reduces the number of coordinated database round-trips from 2 to 1.
		const result = await db.query.cocktails.findFirst({
			where: (cocktails, { eq }) => eq(cocktails.slug, slug),
			with: {
				cocktailIngredients: {
					with: {
						ingredient: {
							with: {
								group: {
									with: {
										category: true,
									},
								},
							},
						},
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
			extras: (cocktails, { sql }) => ({
				deliciousCount:
					sql<number>`(SELECT COUNT(*) FROM ${deliciousLikes} WHERE ${deliciousLikes.cocktailId} = ${cocktails.id})`.as(
						"delicious_count",
					),
				isLiked: userId
					? sql<number>`(SELECT CASE WHEN EXISTS(SELECT 1 FROM ${deliciousLikes} WHERE ${deliciousLikes.cocktailId} = ${cocktails.id} AND ${deliciousLikes.userId} = ${userId}) THEN 1 ELSE 0 END)`.as(
							"is_liked",
						)
					: sql<number>`0`.as("is_liked"),
			}),
		});

		if (!result) {
			return null;
		}

		const deliciousCount = result.deliciousCount ?? 0;
		const isLiked = result.isLiked === 1;

		// Structure the data to match the Cocktail interface
		const cocktailData: Cocktail = {
			id: result.id,
			name: result.name,
			slug: result.slug,
			description: result.description ?? "",
			garnish: result.garnish ?? undefined,
			imageUrl: result.imageUrl ?? undefined,
			deliciousCount,
			isLiked,
			ingredients: result.cocktailIngredients.map((ci) => ({
				id: ci.ingredient.id,
				name: ci.ingredient.name,
				category: ci.ingredient.group.category.name,
				amount: ci.amount,
				option_group: ci.option_group ?? undefined,
			})),
			tags: result.cocktailTags.map((ct) => ({
				name: ct.tag.name,
				description: ct.tag.description,
			})),
			instructions: result.instructions.map((inst) => inst.text),
		};

		return cocktailData;
	},
);

/**
 * タグ名でタグ情報とそのタグを持つカクテル一覧を取得する。
 * カクテルはサマリー情報のみ（詳細ページへのリンク用）。
 * ⚡ Bolt: cache() により同一リクエスト内での重複DBクエリを排除
 * （generateMetadata とページ本体が同じタグ名で呼んでも1回のみ実行）。
 */
export const getCocktailsByTag = cache(
	async (
		tagName: string,
	): Promise<{ tag: Tag; cocktails: Cocktail[] } | null> => {
		const db = await getDb();

		// タグ名でタグを検索
		const tag = await db.query.tags.findFirst({
			where: eq(tags.name, tagName),
		});

		if (!tag) {
			return null;
		}

		// そのタグを持つカクテル一覧をサマリー情報で取得
		const cocktailsWithTag = await db.query.cocktails.findMany({
			with: {
				cocktailTags: {
					where: eq(cocktailTags.tagId, tag.id),
					with: {
						tag: true,
					},
				},
				cocktailIngredients: {
					columns: {
						amount: true,
					},
					with: {
						ingredient: {
							columns: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
			columns: {
				id: true,
				name: true,
				slug: true,
				description: true,
				imageUrl: true,
				garnish: true,
			},
			// cockailTags が空（対象タグなし）のものを除外
			where: (cocktails, { exists }) =>
				exists(
					db
						.select()
						.from(cocktailTags)
						.where(
							and(
								eq(cocktailTags.cocktailId, cocktails.id),
								eq(cocktailTags.tagId, tag.id),
							),
						),
				),
		});

		const mappedCocktails: Cocktail[] = cocktailsWithTag.map((cocktail) => ({
			id: cocktail.id,
			name: cocktail.name,
			slug: cocktail.slug,
			description: cocktail.description ?? "",
			imageUrl: cocktail.imageUrl ?? undefined,
			garnish: cocktail.garnish ?? undefined,
			ingredients: cocktail.cocktailIngredients.map((ci) => ({
				id: ci.ingredient.id,
				name: ci.ingredient.name,
				amount: ci.amount,
				category: "",
			})),
			tags: cocktail.cocktailTags.map((ct) => ({
				name: ct.tag.name,
				description: ct.tag.description,
			})),
			instructions: [],
		}));

		return {
			tag: { name: tag.name, description: tag.description },
			cocktails: mappedCocktails,
		};
	},
);
