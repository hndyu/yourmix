import {
	Box,
	Breadcrumbs,
	Container,
	Fade,
	Link,
	Typography,
} from "@mui/material";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Cocktail } from "../../types/cocktail";
import CocktailDisplay from "../../_components/cocktail-display";

// 環境変数からAPIのベースURLを取得します。
// 開発環境では 'http://localhost:3000' などを設定し、本番環境ではデプロイされたURLを設定します。
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Fallback for development

async function getCocktail(slug: string): Promise<Cocktail> {
	// APIエンドポイントを絶対URLで指定します
	const res = await fetch(`${API_BASE_URL}/api/cocktails/${slug}`, {
		cache: "no-store",
	});

	if (res.status === 404) {
		notFound();
	}

	if (!res.ok) {
		// その他のエラーの場合は error.tsx がレンダリングされます
		throw new Error("レシピの取得に失敗しました。");
	}

	const data = (await res.json()) as { cocktail: Cocktail };
	return data.cocktail;
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata | undefined> {
	const cocktail = await getCocktail(params.slug);

	const title = `${cocktail.name}のレシピ`;
	const description = `${cocktail.name}の作り方と材料を紹介します。${cocktail.description}`;

	return { title, description };
}

export default async function RecipeDetailPage({
	params,
}: {
	params: { slug: string };
}) {
	const cocktail = await getCocktail(params.slug);

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
					<CocktailDisplay cocktail={cocktail} show isDetailPage />
				</Box>
			</Fade>
		</Container>
	);
}
