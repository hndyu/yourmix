"use client";

import {
	Box,
	Breadcrumbs,
	CircularProgress,
	Container,
	Fade,
	Link,
	Paper,
	Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import type { Cocktail } from "../../types/cocktail";
import CocktailDisplay from "../../_components/cocktail-display";
import Footer from "../../_components/footer";
import Header from "../../_components/header";

export default function RecipeDetailPage() {
	const params = useParams();
	const router = useRouter();
	const cocktailSlug = params.slug as string;

	const [cocktail, setCocktail] = React.useState<Cocktail | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (!cocktailSlug) return;

		const fetchCocktail = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/cocktails/${cocktailSlug}`);
				if (!res.ok) throw new Error("レシピの取得に失敗しました。");
				const data = (await res.json()) as { cocktail: Cocktail };
				setCocktail(data.cocktail);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "不明なエラーが発生しました。",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCocktail();
	}, [cocktailSlug]);

	// ローディング中の表示
	if (loading) {
		return (
			<Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
				<CircularProgress />
				<Typography sx={{ mt: 2 }}>レシピを読み込んでいます...</Typography>
			</Container>
		);
	}

	// エラーまたはカクテルが見つからない場合
	if (error || !cocktail) {
		return (
			<Container maxWidth="md" sx={{ py: 4 }}>
				<Fade in timeout={800}>
					<Paper
						elevation={1}
						sx={{
							p: 4,
							textAlign: "center",
							backgroundColor: "#fafafa",
							borderRadius: "15px",
						}}
					>
						<Typography variant="h5" color="error" gutterBottom>
							❌ レシピが見つかりません
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
							{error ||
								"指定されたURLのレシピは存在しないか、削除された可能性があります。"}
						</Typography>
						<Button
							variant="contained"
							onClick={() => router.push("/")}
							startIcon={<ArrowBack />}
						>
							ホームに戻る
						</Button>
					</Paper>
				</Fade>
			</Container>
		);
	}

	return (
		<>
			<Header />
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
						<CocktailDisplay cocktail={cocktail} show />
					</Box>
				</Fade>
			</Container>
			<Footer />
		</>
	);
}
