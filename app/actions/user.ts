"use server";

import { initAuth } from "@/app/auth";
import { users } from "@/app/db/auth.schema";
import { getDb } from "@/app/db/db";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { type ActionResponse, createActionResponse } from "../lib/actions";

export async function deleteAccountAction(): Promise<ActionResponse> {
	return createActionResponse(async () => {
		const auth = await initAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			throw new Error("認証されていません。");
		}
		const { user } = session;

		const db = await getDb();
		await db.delete(users).where(eq(users.id, user.id));

		return;
	});
}

export async function updateProfileAction(data: {
	name?: string;
	email?: string;
}): Promise<ActionResponse> {
	return createActionResponse(async () => {
		const auth = await initAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			throw new Error("認証されていません。");
		}

		const { name, email } = data;
		const updateData: { name?: string; email?: string } = {};

		if (name !== undefined) {
			if (name.trim().length === 0) {
				throw new Error("無効な名前です。");
			}
			updateData.name = name.trim();
		}

		if (email !== undefined) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				throw new Error("無効なメールアドレスです。");
			}
			updateData.email = email.trim();
		}

		if (Object.keys(updateData).length === 0) {
			throw new Error("変更内容がありません。");
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
				throw new Error("使用できないメールアドレスです。");
			}
		}

		await db.update(users).set(updateData).where(eq(users.id, session.user.id));

		revalidatePath("/my-page");
	});
}
