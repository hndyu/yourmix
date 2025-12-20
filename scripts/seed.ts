import {
	categories,
	cocktailIngredients,
	cocktailTags,
	cocktails,
	deliciousLikes,
	ingredientGroups,
	ingredients,
	instructions,
	tags,
} from "@/app/db/schema";
import { v4 as uuidv4 } from "uuid";
import { contemporaryClassics } from "./data/contemporary-classics";
import { ingredientDetails, ingredientGroupsData } from "./data/ingredients";
import { newEra } from "./data/new-era";
import { unforgettables } from "./data/unforgettables";
import type { IngredientData, SeedDataOverrides } from "./types";

const schema = {
	categories,
	cocktailIngredients,
	cocktails,
	cocktailTags,
	deliciousLikes,
	ingredientGroups,
	ingredients,
	instructions,
	tags,
};

export async function seed(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	db: any,
	overrides: SeedDataOverrides = {},
) {
	console.log("🌱 Seeding database...");

	// 既存のデータをクリア
	await db.delete(schema.deliciousLikes);
	await db.delete(schema.cocktailTags);
	await db.delete(schema.tags);
	await db.delete(schema.instructions);
	await db.delete(schema.cocktailIngredients);
	await db.delete(schema.ingredients);
	await db.delete(schema.cocktails);
	await db.delete(schema.ingredientGroups);
	await db.delete(schema.categories);
	console.log("🗑️ Cleared existing data.");

	const usedUnforgettables = overrides?.unforgettables ?? unforgettables;
	const usedContemporaryClassics =
		overrides?.contemporaryClassics ?? contemporaryClassics;
	const usedNewEra = overrides?.newEra ?? newEra;
	const allCocktails = [
		...usedUnforgettables,
		...usedContemporaryClassics,
		...usedNewEra,
	];

	// カテゴリの登録（並び順を管理）
	const categoryData = [
		{
			name: "醸造酒",
			sortOrder: 1,
			icon: "WineBar",
			description: "穀物や果物などを発酵させて造られたお酒。",
		},
		{
			name: "蒸留酒",
			sortOrder: 2,
			icon: "Liquor",
			description: "醸造酒を蒸留してアルコール度数を高めたお酒。",
		},
		{
			name: "混成酒",
			sortOrder: 3,
			icon: "LocalBar",
			description: "醸造酒や蒸留酒に糖類、香料、果実などを加えたお酒。",
		},
		{
			name: "ノンアルコール",
			sortOrder: 4,
			icon: "LocalDrink",
			description: "アルコールを含まない飲料。",
		},
		{
			name: "食品",
			sortOrder: 5,
			icon: "Restaurant",
			description: "果物、卵、クリーム、調味料など、飲料以外の材料。",
		},
	];

	const categoryMapByName = new Map<string, number>();
	for (const category of categoryData) {
		const [newCategory] = await db
			.insert(schema.categories)
			.values(category)
			.returning({ id: schema.categories.id });
		categoryMapByName.set(category.name, newCategory.id);
	}
	console.log("📁 Seeded categories.");

	// タグの登録
	const tagMap = new Map<string, number>();
	for (const cocktailData of allCocktails) {
		for (const tagName of cocktailData.tags) {
			if (!tagMap.has(tagName)) {
				const [newTag] = await db
					.insert(schema.tags)
					.values({ name: tagName })
					.returning({ id: schema.tags.id });
				tagMap.set(tagName, newTag.id);
			}
		}
	}
	console.log("🏷️  Seeded tags.");

	// 材料グループの登録
	const groupsSource = overrides?.ingredientGroupsData ?? ingredientGroupsData;
	const groupMap = new Map<string, number>();
	for (const group of groupsSource) {
		const categoryId = categoryMapByName.get(group.category);
		if (categoryId === undefined) {
			throw new Error(`Category ID not found for category: ${group.category}`);
		}
		const [newGroup] = await db
			.insert(schema.ingredientGroups)
			.values({
				displayName: group.displayName,
				categoryId: categoryId,
				sortOrder: group.order,
				description: group.description,
			})
			.returning({ id: schema.ingredientGroups.id });
		groupMap.set(group.displayName, newGroup.id);
	}
	console.log("📦 Seeded ingredient groups.");

	// 材料の登録
	const ingredientMap = new Map<string, number>();
	const ingredientDetailsSource =
		overrides?.ingredientDetails ?? ingredientDetails;
	for (const cocktailData of allCocktails) {
		for (const ing of cocktailData.ingredients) {
			if (!ingredientMap.has(ing.name)) {
				const groupDisplayName = ingredientDetailsSource[ing.name]?.group;
				if (!groupDisplayName) {
					throw new Error(
						`Ingredient group not found for ingredient: ${ing.name}`,
					);
				}
				const groupId = groupMap.get(groupDisplayName);
				if (groupId === undefined) {
					throw new Error(
						`Group ID not found for group display name: ${groupDisplayName}`,
					);
				}
				const description = ingredientDetailsSource[ing.name]?.description;

				const details = ingredientDetailsSource[ing.name];
				const [newIngredient] = await db
					.insert(schema.ingredients)
					.values({
						name: ing.name,
						groupId: groupId,
						description: description ?? null,
						sortOrder: details?.order ?? 0,
					})
					.returning({ id: schema.ingredients.id });
				ingredientMap.set(ing.name, newIngredient.id);
			}
		}
	}
	console.log("🌿 Seeded ingredients.");

	// カクテル、作り方、中間テーブルの登録
	for (const cocktailData of allCocktails) {
		const cocktailId = uuidv4();
		const slug = cocktailData.imageUrl.replace(/\.[^/.]+$/, "");

		// cocktails テーブル
		await db.insert(schema.cocktails).values({
			id: cocktailId,
			name: cocktailData.name,
			slug,
			description: cocktailData.description,
			garnish: cocktailData.garnish,
			imageUrl: cocktailData.imageUrl,
		});

		// instructions テーブル
		await db.insert(schema.instructions).values(
			cocktailData.instructions.map((text: string, index: number) => ({
				cocktailId,
				step: index + 1,
				text,
			})),
		);

		// cocktail_ingredients テーブル
		await db.insert(schema.cocktailIngredients).values(
			cocktailData.ingredients.map((ing: IngredientData) => {
				const ingredientId = ingredientMap.get(ing.name);
				if (ingredientId === undefined) {
					throw new Error(`Ingredient not found: ${ing.name}`);
				}
				return {
					cocktailId,
					ingredientId,
					amount: ing.amount,
					option_group: ing.option_group,
				};
			}),
		);

		// cocktail_tags テーブル
		await db.insert(schema.cocktailTags).values(
			cocktailData.tags.map((tagName: string) => {
				const tagId = tagMap.get(tagName);
				if (tagId === undefined) {
					throw new Error(`Tag not found: ${tagName}`);
				}
				return {
					cocktailId,
					tagId,
				};
			}),
		);
	}
	console.log(`🍹 Seeded ${allCocktails.length} cocktails.`);

	console.log("✅ Seeding complete.");
}

// エラーハンドリングを改善したseed関数のラッパー
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function runSeed(db: any, overrides?: SeedDataOverrides) {
	try {
		await seed(db, overrides);
		console.log("✅ Seed script completed successfully.");
		return true;
	} catch (error) {
		console.error("❌ Seed script failed:", error);
		if (error instanceof Error) {
			console.error("Error details:", error.message);
			console.error("Stack trace:", error.stack);
		}
		throw error;
	}
}

// Node.js環境で直接実行される場合（開発用）
if (
	typeof require !== "undefined" &&
	require.main === module &&
	typeof process !== "undefined"
) {
	console.log(
		"⚠️  This script is a library and cannot be run directly without a database connection.",
	);
	console.log("");
	process.exit(1);
}
