import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as React from "react";
import type { BreadcrumbList, Recipe, WithContext } from "schema-dts";
import CocktailDisplay from "../../_components/cocktail-display";
import { initAuth } from "../../auth";
import { getCocktailBySlug } from "../../lib/cocktail-data";
import type { Cocktail } from "../../types/cocktail";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function getCocktail(slug: string, userId?: string): Promise<Cocktail> {
	const cocktail = await getCocktailBySlug(slug, userId);
	if (!cocktail) notFound();
	return cocktail;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const cocktail = await getCocktail(slug);
	const title = `${cocktail.name}のレシピ`;
	const description = `${cocktail.name}の作り方と材料を紹介します。${cocktail.description}`;

	const ogImage = cocktail.imageUrl
		? [`${API_BASE_URL}/cocktails/${cocktail.imageUrl}`]
		: [];

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			images: ogImage,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ogImage,
		},
	};
}

export default async function RecipeDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const session = await (await initAuth()).api.getSession({
		headers: await headers(),
	});
	const userId = session?.user?.id;
	const cocktail = await getCocktail(slug, userId);

	// JSON-LD Generation
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
		<div className="container mx-auto px-4 py-8">
			{/* Breadcrumbs */}
			<nav className="flex items-center text-sm text-stone-500 mb-6 animate-in fade-in duration-500">
				<Link href="/" className="hover:text-primary transition-colors">
					ホーム
				</Link>
				<ChevronRight size={16} className="mx-1" />
				<span className="text-stone-300 font-medium">{cocktail.name}</span>
			</nav>

			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify([recipeJsonLd, breadcrumbJsonLd]),
				}}
			/>

			<CocktailDisplay cocktail={cocktail} show isDetailPage />
		</div>
	);
}
