"use client";

import { ArrowBack, Restaurant } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Container,
	Fade,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import type { Cocktail, Ingredient } from "../../types/cocktail";
import Footer from "../../_components/footer";
import CocktailDisplay from "../../_components/cocktail-display";
import Header from "../../_components/header";

// カスタムスタイルのカード
const StyledDetailCard = styled(Card)(({ theme }) => ({
	borderRadius: "20px",
	boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
}));

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

	// 材料をグループ化する処理
	const processedIngredients = React.useMemo(() => {
		if (!cocktail?.ingredients) return [];

		const ingredientsMap = new Map<number, Ingredient[]>();
		const otherIngredients: Ingredient[] = [];

		// option_group ごとに材料を分類
		for (const ingredient of cocktail.ingredients) {
			if (ingredient.option_group) {
				let group = ingredientsMap.get(ingredient.option_group);
				if (!group) {
					group = [];
					ingredientsMap.set(ingredient.option_group, group);
				}
				group.push(ingredient);
			} else {
				otherIngredients.push(ingredient);
			}
		}

		// グループ化された材料を「または」で連結
		const groupedIngredients: Ingredient[] = [];
		for (const group of ingredientsMap.values()) {
			// グループ化された材料オブジェクトを作成する際に、Ingredient型の必須プロパティを追加します。
			// idはユニークである必要があるため、グループ内の最初の材料IDとグループ名を組み合わせて生成します。
			groupedIngredients.push({
				// @ts-expect-error `id` is a number in the database, but we are creating a synthetic one here.
				id: `${group[0].id}-group`,
				name: group.map((ing) => ing.name).join(" または "),
				amount: group[0].amount, //量は同じと仮定
				description: group.map((ing) => ing.description).join("、"),
				categoryName: group[0].categoryName,
				sortOrder: group[0].sortOrder,
			});
		}

		return [...groupedIngredients, ...otherIngredients];
	}, [cocktail]);

	// 作り方を処理し、ユニークなIDを付与する
	const processedInstructions = React.useMemo(() => {
		if (!cocktail?.instructions) return [];
		// cocktail.idとインデックスを組み合わせてユニークなIDを生成
		return cocktail.instructions.map((instruction, index) => ({
			id: `${cocktail.id}-instruction-${index}`,
			text: instruction,
		}));
	}, [cocktail]);

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
						{/* ヘッダー */}
						<Button
							variant="outlined"
							onClick={() => router.back()}
							startIcon={<ArrowBack />}
							sx={{ mb: 3 }}
						>
							戻る
						</Button>

						{/* カクテル表示コンポーネントを再利用 */}
						<CocktailDisplay cocktail={cocktail} show />
					</Box>
				</Fade>
			</Container>
			<Footer />
		</>
	);
}
