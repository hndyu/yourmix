import {
	Box,
	Breadcrumbs,
	Container,
	Fade,
	Link,
	Typography,
} from "@mui/material";
import type { Metadata } from "next";
import { headers } from "next/headers";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import * as React from "react";
import type { BreadcrumbList, Recipe, WithContext } from "schema-dts";
import CocktailDisplay from "../../_components/cocktail-display";
import { initAuth } from "../../auth";
import { getCocktailBySlug } from "../../lib/cocktail-data";
import type { Cocktail } from "../../types/cocktail";

// 環境変数からAPIのベースURLを取得します。
// 開発環境では 'http://localhost:3000' などを設定し、本番環境ではデプロイされたURLを設定します。
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Fallback for development

async function getCocktail(slug: string, userId?: string): Promise<Cocktail> {
	const cocktail = await getCocktailBySlug(slug, userId);

	if (!cocktail) {
		notFound();
	}

	return cocktail;
}

export async function generateMetadata({
	params,
}: {
	// paramsがPromiseの可能性があるため、型を調整
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params; // paramsをawaitしてslugを取り出す
	const cocktail = await getCocktail(slug);

	const title = `${cocktail.name}のレシピ`;
	const description = `${cocktail.name}の作り方と材料を紹介します。${cocktail.description}`;

	return { title, description };
}

export default async function RecipeDetailPage({
	params,
}: {
	// paramsがPromiseの可能性があるため、型を調整
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params; // paramsをawaitしてslugを取り出す

	const session = await (await initAuth()).api.getSession({
		headers: await headers(),
	});
	const userId = session?.user?.id;

	const cocktail = await getCocktail(slug, userId);

	// 材料をグループ化して表示するための処理（JSON-LD用）
	const displayIngredients = [];
	const processedOptionGroups = new Set<number>();

	for (const ingredient of cocktail.ingredients) {
		if (ingredient.option_group) {
			if (!processedOptionGroups.has(ingredient.option_group)) {
				const groupIngredients = cocktail.ingredients.filter(
					(i) => i.option_group === ingredient.option_group,
				);
				displayIngredients.push(
					`${groupIngredients.map((i) => i.name).join(" または ")} ${ingredient.amount}`,
				);
				processedOptionGroups.add(ingredient.option_group);
			}
		} else {
			displayIngredients.push(`${ingredient.name} ${ingredient.amount}`);
		}
	}

	// Recipeスキーマ
	const recipeJsonLd: WithContext<Recipe> = {
		"@context": "https://schema.org",
		"@type": "Recipe",
		name: cocktail.name,
		description: cocktail.description,
		recipeIngredient: displayIngredients,
		recipeInstructions: cocktail.instructions.map((step, index) => ({
			"@type": "HowToStep",
			text: step,
			position: index + 1,
		})),
		image: cocktail.imageUrl
			? `${API_BASE_URL}/cocktails/${cocktail.imageUrl}`
			: undefined,
	};

	// BreadcrumbListスキーマ
	const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "ホーム",
				item: API_BASE_URL,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: cocktail.name,
				item: `${API_BASE_URL}/recipes/${cocktail.slug}`,
			},
		],
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Fade in timeout={1000}>
				<Box>
					{/* パンくずリスト */}
					<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
						<Link
							component={NextLink}
							underline="hover"
							color="inherit"
							href="/"
						>
							ホーム
						</Link>
						<Typography color="text.primary">{cocktail.name}</Typography>
					</Breadcrumbs>

					{/* カクテル表示コンポーネントを再利用 */}
					<script
						type="application/ld+json"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{
							__html: JSON.stringify([recipeJsonLd, breadcrumbJsonLd]),
						}}
					/>
					<CocktailDisplay cocktail={cocktail} show isDetailPage />
				</Box>
			</Fade>
		</Container>
	);
}
