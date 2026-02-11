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

		// Check if already liked
		const [existingLike] = await db
			.select()
			.from(deliciousLikes)
			.where(
				and(
					eq(deliciousLikes.cocktailId, cocktailId),
					eq(deliciousLikes.userId, userId),
				),
			);

		let isLiked = false;

		if (existingLike) {
			// Unlike
			await db
				.delete(deliciousLikes)
				.where(
					and(
						eq(deliciousLikes.cocktailId, cocktailId),
						eq(deliciousLikes.userId, userId),
					),
				);
			isLiked = false;
		} else {
			// Like
			await db.insert(deliciousLikes).values({
				cocktailId,
				userId,
			});
			isLiked = true;
		}

		// Get updated count
		const [countResult] = await db
			.select({ count: sql<number>`count(*)` })
			.from(deliciousLikes)
			.where(eq(deliciousLikes.cocktailId, cocktailId));

		// Revalidate to update UI
		revalidatePath(`/recipes/${cocktailId}`);
		revalidatePath("/");

		return {
			isLiked,
			count: countResult?.count ?? 0,
		};
	});
}
