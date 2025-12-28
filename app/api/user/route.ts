// app/api/user/route.ts
import { initAuth } from "@/app/auth";
import { users } from "@/app/db/auth.schema";
import { getDb } from "@/app/db/db";
import { and, eq, ne } from "drizzle-orm";
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

export async function PATCH(req: NextRequest) {
	const auth = await initAuth();
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = (await req.json()) as { name?: unknown; email?: unknown };
		const { name, email } = body;

		const updateData: { name?: string; email?: string } = {};

		if (name !== undefined) {
			if (typeof name !== "string" || name.trim().length === 0) {
				return NextResponse.json({ error: "Invalid name" }, { status: 400 });
			}
			updateData.name = name.trim();
		}

		if (email !== undefined) {
			if (typeof email !== "string" || !email.includes("@")) {
				return NextResponse.json({ error: "Invalid email" }, { status: 400 });
			}
			updateData.email = email.trim();
		}

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ error: "No changes provided" },
				{ status: 400 },
			);
		}

		const db = await getDb();

		if (updateData.email) {
			const existingUser = await db.query.users.findFirst({
				where: and(
					eq(users.email, updateData.email),
					ne(users.id, session.user.id),
				),
			});

			if (existingUser) {
				return NextResponse.json(
					{ error: "Email already in use" },
					{ status: 409 },
				);
			}
		}

		await db.update(users).set(updateData).where(eq(users.id, session.user.id));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to update user:", error);
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 },
		);
	}
}
