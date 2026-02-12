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

		// ⚡ Bolt: Consolidate check and initial count into a single query
		// Expected impact: Reduces initial DB round-trips from 2 (or sequential calls) to 1.
		const likeStatus = await db
			.select({
				isLiked: sql<number>`MAX(CASE WHEN ${deliciousLikes.userId} = ${userId} THEN 1 ELSE 0 END)`,
				currentCount: sql<number>`COUNT(*)`,
			})
			.from(deliciousLikes)
			.where(eq(deliciousLikes.cocktailId, cocktailId));

		const wasLiked = (likeStatus[0]?.isLiked ?? 0) === 1;

		let isLiked = false;

		// ⚡ Bolt: Combine toggle operation and final count retrieval into a single database round-trip using db.batch
		// Overall, this reduces the total round-trips for the toggle action from 3 to 2.
		const [_, finalCountResult] = await db.batch([
			wasLiked
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
				.select({ count: sql<number>`COUNT(*)` })
				.from(deliciousLikes)
				.where(eq(deliciousLikes.cocktailId, cocktailId)),
		]);

		isLiked = !wasLiked;

		// Revalidate to update UI
		revalidatePath(`/recipes/${cocktailId}`);
		revalidatePath("/");

		return {
			isLiked,
			count: finalCountResult[0]?.count ?? 0,
		};
	});
}
