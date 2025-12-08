import { NextResponse } from "next/server";
import * as schema from "@/app/db/schema";
import getDb from "@/app/db/db";
import { getAuth } from "@/lib/auth";
import { and, eq, sql } from "drizzle-orm";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ cocktailId: string }> },
) {
	try {
		const { cocktailId } = await params;
		const session = await getAuth().api.getSession({
			headers: request.headers,
		});
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log(
			`[Delicious API] Request to toggle like for cocktailId: ${cocktailId} by user: ${session.user.id}`,
		);

		const db = getDb();
		const userId = session.user.id;

		// Check if already liked
		const [existingLike] = await db
			.select()
			.from(schema.deliciousLikes)
			.where(
				and(
					eq(schema.deliciousLikes.cocktailId, cocktailId),
					eq(schema.deliciousLikes.userId, userId),
				),
			);

		let isLiked = false;

		if (existingLike) {
			// Unlike
			await db
				.delete(schema.deliciousLikes)
				.where(
					and(
						eq(schema.deliciousLikes.cocktailId, cocktailId),
						eq(schema.deliciousLikes.userId, userId),
					),
				);
			isLiked = false;
		} else {
			// Like
			await db.insert(schema.deliciousLikes).values({
				cocktailId,
				userId,
			});
			isLiked = true;
		}

		// Get updated count
		const [countResult] = await db
			.select({ count: sql<number>`count(*)` })
			.from(schema.deliciousLikes)
			.where(eq(schema.deliciousLikes.cocktailId, cocktailId));

		return NextResponse.json({
			isLiked,
			count: countResult?.count ?? 0,
		});
	} catch (error) {
		console.error("Error in delicious API:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
