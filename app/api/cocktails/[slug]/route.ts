import { initAuth } from "@/app/auth";
import { getCocktailBySlug } from "@/app/lib/cocktail-data";
import { NextResponse } from "next/server";

/**
 * 特定のカクテルを取得するAPIエンドポイント
 * GET /api/cocktails/[slug]
 */

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		const { slug } = await params;
		if (!slug) {
			return NextResponse.json(
				{ error: "スラグが指定されていません。" },
				{ status: 400 },
			);
		}

		// ユーザーがいいねしているか確認
		let userId: string | undefined;
		const session = await (await initAuth()).api.getSession({
			headers: request.headers,
		});

		if (session) {
			userId = session.user.id;
		}

		const cocktailData = await getCocktailBySlug(slug, userId);

		if (!cocktailData) {
			return NextResponse.json(
				{ error: "指定されたカクテルが見つかりません。" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ cocktail: cocktailData }, { status: 200 });
	} catch (error) {
		console.error("Error fetching cocktail for slug:", error);
		return NextResponse.json(
			{ error: "カクテルの取得中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}
