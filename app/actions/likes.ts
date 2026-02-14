"use server";

import { initAuth } from "@/app/auth";
import { getDb } from "@/app/db/db";
import { deliciousLikes } from "@/app/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { type ActionResponse, createActionResponse } from "../lib/actions";

interface LikeResult {
	isLiked: boolean;
	count: number;
}

export async function toggleLikeAction(
	cocktailId: string,
): Promise<ActionResponse<LikeResult>> {
	return createActionResponse(async () => {
		const auth = await initAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("ログインが必要です。");
		}

		const db = await getDb();
		const userId = session.user.id;

		// ⚡ Bolt: Use conditional aggregation to fetch like status and total count in one query
		// Reduces round-trips from 3 to 2 by combining the initial check and current count fetch
		const [statusInfo] = await db
			.select({
				isLiked: sql<number>`COALESCE(MAX(CASE WHEN ${deliciousLikes.userId} = ${userId} THEN 1 ELSE 0 END), 0)`,
				totalCount: sql<number>`COUNT(*)`,
			})
			.from(deliciousLikes)
			.where(eq(deliciousLikes.cocktailId, cocktailId));

		const currentlyLiked = statusInfo?.isLiked === 1;

		// ⚡ Bolt: Use db.batch to perform toggle and re-fetch count in a single round-trip
		// This ensures atomicity for the response and further minimizes round-trips to Cloudflare D1
		const results = await db.batch([
			currentlyLiked
				? db
						.delete(deliciousLikes)
						.where(
							and(
								eq(deliciousLikes.cocktailId, cocktailId),
								eq(deliciousLikes.userId, userId),
							),
						)
				: db.insert(deliciousLikes).values({
						cocktailId,
						userId,
					}),
			db
				.select({ count: sql<number>`count(*)` })
				.from(deliciousLikes)
				.where(eq(deliciousLikes.cocktailId, cocktailId)),
		]);

		// The second query in the batch returns the updated count
		const countResult = results[1] as { count: number }[];
		const isLiked = !currentlyLiked;

		// Revalidate to update UI
		revalidatePath(`/recipes/${cocktailId}`);
		revalidatePath("/");

		return {
			isLiked,
			count: countResult[0]?.count ?? 0,
		};
	});
}
