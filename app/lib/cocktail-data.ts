import { getDb } from "@/app/db/db";
import { cocktails, deliciousLikes } from "@/app/db/schema";
import type { Cocktail } from "@/app/types/cocktail";
import { and, eq, sql } from "drizzle-orm";

export async function getCocktailBySlug(
	slug: string,
	userId?: string,
): Promise<Cocktail | null> {
	const db = await getDb();

	// ⚡ Bolt: Use Drizzle Relational Queries to avoid Cartesian product and manual deduplication
	// Expected impact: Significant reduction in data transfer and O(1) instead of O(N^2) mapping complexity
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
	});

	if (!result) {
		return null;
	}

	// ⚡ Bolt: Consolidate parallel DB calls into a single query to further reduce round-trips
	const likeInfo = await db
		.select({
			count: sql<number>`COUNT(*)`,
			isLiked: userId
				? sql<number>`COALESCE(MAX(CASE WHEN ${deliciousLikes.userId} = ${userId} THEN 1 ELSE 0 END), 0)`
				: sql<number>`0`,
		})
		.from(deliciousLikes)
		.where(eq(deliciousLikes.cocktailId, result.id));

	const deliciousCount = likeInfo[0]?.count ?? 0;
	const isLiked = (likeInfo[0]?.isLiked ?? 0) === 1;

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
}
