// app/api/user/route.ts
import { initAuth } from "@/app/auth";
import { users } from "@/app/db/auth.schema";
import { getDb } from "@/app/db/db";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
	const auth = await initAuth();
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { user } = session;

	try {
		const db = await getDb();
		await db.delete(users).where(eq(users.id, user.id));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to delete user:", error);
		return NextResponse.json(
			{ error: "Failed to delete account" },
			{ status: 500 },
		);
	}
}
