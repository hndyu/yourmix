import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import {
	cocktails,
	cocktailIngredients,
	ingredients,
	cocktailTags,
	tags,
	instructions,
} from "../../../schema";
import { eq } from "drizzle-orm";
import type { Cocktail } from "../../types/cocktail";
import type { Env } from "../../../cloudflare-env";

/**
 * カクテル一覧を取得するAPIエンドポイント
 * GET /api/cocktails
 */

export async function GET() {
	try {
		// Cloudflare環境からコンテキストを取得
		const context = getCloudflareContext();
		const env = context.env as Env;

		if (!env.DB) {
			console.error("DB binding is not available.");
			return NextResponse.json(
				{ error: "データベース接続に失敗しました。" },
				{ status: 500 },
			);
		}
		const db = drizzle(env.DB);

		// 関連するすべての情報をJOINして取得
		const results = await db
			.select()
			.from(cocktails)
			.leftJoin(
				cocktailIngredients,
				eq(cocktails.id, cocktailIngredients.cocktailId),
			)
			.leftJoin(
				ingredients,
				eq(cocktailIngredients.ingredientId, ingredients.id),
			)
			.leftJoin(cocktailTags, eq(cocktails.id, cocktailTags.cocktailId)) // cocktailTagsを結合
			.leftJoin(tags, eq(cocktailTags.tagId, tags.id)) // tagsをcocktailTags.tagIdで結合
			.leftJoin(instructions, eq(cocktails.id, instructions.cocktailId))
			.orderBy(instructions.step);

		// カクテルごとに材料とタグをグループ化
		const cocktailsMap = results.reduce((acc, row) => {
			const {
				cocktails: cocktail,
				ingredients: ingredient,
				cocktail_ingredients: cocktailIngredient,
				tags: tag,
				instructions: instruction,
			} = row;
			if (!cocktail) return acc;

			let entry = acc.get(cocktail.id);
			if (!entry) {
				entry = {
					...cocktail,
					imageUrl: cocktail.imageUrl ?? undefined,
					description: cocktail.description ?? "",
					garnish: cocktail.garnish ?? undefined,
					ingredients: [],
					tags: [],
					instructions: [],
				};
				acc.set(cocktail.id, entry);
			}

			if (
				ingredient && // 材料が存在し
				cocktailIngredient && // 中間テーブルのレコードが存在し
				!entry.ingredients.some((i) => i.name === ingredient.name)
			) {
				entry.ingredients.push({
					id: ingredient.id,
					name: ingredient.name,
					amount: cocktailIngredient.amount ?? "",
					category: ingredient.category ?? "",
				});
			}

			if (tag && entry.tags && !entry.tags.includes(tag.name)) {
				entry.tags.push(tag.name);
			}

			if (
				instruction?.text &&
				!entry.instructions.includes(instruction.text)
			) {
				entry.instructions.push(instruction.text);
			}
			return acc;
		}, new Map<string, Cocktail>());

		const allCocktails = Array.from(cocktailsMap.values());

		return NextResponse.json({ cocktails: allCocktails }, { status: 200 });
	} catch (error) {
		console.error("Error fetching cocktails:", error);
		return NextResponse.json(
			{ error: "カクテルの取得中にエラーが発生しました。" },
			{ status: 500 },
		);
	}
}
