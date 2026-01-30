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

	// ⚡ Bolt: Parallelize independent DB calls to reduce total latency
	const [countResult, likedResult] = await Promise.all([
		db
			.select({ count: sql<number>`count(*)` })
			.from(deliciousLikes)
			.where(eq(deliciousLikes.cocktailId, result.id)),
		userId
			? db
					.select()
					.from(deliciousLikes)
					.where(
						and(
							eq(deliciousLikes.cocktailId, result.id),
							eq(deliciousLikes.userId, userId),
						),
					)
			: Promise.resolve([]),
	]);

	const deliciousCount = countResult[0]?.count ?? 0;
	const isLiked = (likedResult?.length ?? 0) > 0;

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
