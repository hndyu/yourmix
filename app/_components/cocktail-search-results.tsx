"use client";

import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Fade,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import * as React from "react";
import type { Cocktail } from "../types/cocktail";
// 共通化された関数をインポート
import {
	type GroupMapping,
	calculateMatchScore,
	sortCocktailsByMatchScore,
} from "../utils/cocktail-filter";

// カスタムスタイルのカード
const StyledResultCard = styled(Card)(({ theme }) => ({
	borderRadius: "15px",
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
	transition: "all 0.3s ease-in-out",
	// cursor: "pointer" を削除

	"&:hover": {
		transform: "translateY(-4px)",
		boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
	},
}));

// マッチ度に応じた色を取得
const getMatchScoreColor = (score: number) => {
	if (score >= 0.8) return "#4caf50"; // 高マッチ度：緑
	if (score >= 0.5) return "#ff9800"; // 中マッチ度：オレンジ
	return "#f44336"; // 低マッチ度：赤
};

// マッチ度を日本語で表示
const getMatchScoreText = (score: number) => {
	if (score >= 0.8) return "高マッチ";
	if (score >= 0.5) return "中マッチ";
	return "低マッチ";
};

interface CocktailSearchResultsProps {
	cocktails: Cocktail[];
	selectedIngredients: string[];
	show?: boolean;
	groupMapping: GroupMapping;
	categories: import("../types/cocktail").Category[];
	allIngredients: import("../types/cocktail").Ingredient[];
}

export default function CocktailSearchResults({
	cocktails,
	selectedIngredients,
	categories,
	show = true,
	allIngredients,
	groupMapping,
}: CocktailSearchResultsProps) {
	const [sortedCocktails, setSortedCocktails] = React.useState<Cocktail[]>([]);
	const [matchScores, setMatchScores] = React.useState<Record<string, number>>(
		{},
	);

	// 材料のソート順を事前に計算しておくためのメモ化されたマップ
	const ingredientSortOrders = React.useMemo(() => {
		const categoryOrderMap = new Map(
			categories.map((c) => [c.name, c.sortOrder ?? Number.POSITIVE_INFINITY]),
		);
		const ingredientOrderMap = new Map(
			allIngredients
				.filter((i): i is typeof i & { id: number } => i.id != null) // idが存在し、number型であることを保証
				.map((i) => {
					const categoryOrder = i.categoryName
						? categoryOrderMap.get(i.categoryName)
						: undefined;
					return [
						i.id,
						{
							category: categoryOrder ?? Number.POSITIVE_INFINITY,
							ingredient: i.sortOrder ?? Number.POSITIVE_INFINITY,
						},
					];
				}),
		);
		return ingredientOrderMap;
	}, [categories, allIngredients]);

	React.useEffect(() => {
		let isMounted = true;
		const sortAndSetCocktails = async () => {
			// マッチ度順にソート（共通化された関数を使用）
			const sorted = await sortCocktailsByMatchScore(
				cocktails,
				selectedIngredients,
				groupMapping,
			);
			if (isMounted) {
				setSortedCocktails(sorted);
			}
		};

		sortAndSetCocktails();
		return () => {
			isMounted = false;
		};
	}, [cocktails, selectedIngredients, groupMapping]);

	React.useEffect(() => {
		if (sortedCocktails.length === 0) return;

		const calculateScores = async () => {
			const scores: Record<string, number> = {};
			await Promise.all(
				sortedCocktails.map(async (cocktail) => {
					const score = await calculateMatchScore(
						cocktail,
						selectedIngredients,
						groupMapping,
					);
					scores[cocktail.id] = score;
				}),
			);
			setMatchScores(scores);
		};
		calculateScores();
	}, [sortedCocktails, selectedIngredients, groupMapping]);

	if (cocktails.length === 0) {
		return (
			<Fade in={show} timeout={800} easing="ease-out">
				<Paper
					elevation={1}
					sx={{
						p: 4,
						textAlign: "center",
						backgroundColor: "#fafafa",
						borderRadius: "15px",
						transform: show ? "translateY(0)" : "translateY(20px)",
						opacity: show ? 1 : 0,
						transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
					}}
				>
					<Typography
						component="h2"
						variant="h6"
						color="text.secondary"
						gutterBottom
					>
						🔍 検索結果
					</Typography>
					<Typography variant="body1" color="text.secondary">
						選択された材料にマッチするレシピが見つかりませんでした。
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						他の材料を選択してみてください。
					</Typography>
				</Paper>
			</Fade>
		);
	}

	return (
		<Fade in={show} timeout={1000} easing="ease-out">
			<Box
				sx={{
					mt: 4,
					transform: show ? "translateY(0)" : "translateY(20px)",
					opacity: show ? 1 : 0,
					transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
				}}
			>
				{/* ヘッダー */}
				<Box sx={{ mb: 3, textAlign: "center" }}>
					<Typography
						variant="h5"
						component="h2"
						sx={{
							fontWeight: "bold",
							color: "#2c3e50",
							mb: 1,
						}}
					>
						🔍 検索結果 ({cocktails.length}件)
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
						選択された材料にマッチするレシピを表示しています
					</Typography>
					<Divider sx={{ my: 2 }} />
				</Box>

				{/* 検索結果グリッド */}
				<Grid container spacing={3}>
					{sortedCocktails.map((cocktail) => {
						const score = matchScores[cocktail.id] ?? 0;
						return (
							<Grid key={cocktail.id} size={{ xs: 12, sm: 6, md: 4 }}>
								<StyledResultCard
									// onClick、onKeyDown、role、tabIndexを削除
									sx={{
										// cursor: "pointer" を削除
										"&:focus": {
											outline: "2px solid #1976d2",
											outlineOffset: "2px",
										},
									}}
								>
									<CardContent sx={{ p: 3 }}>
										{/* カクテル名 */}
										<Typography
											variant="h6"
											component="h3"
											sx={{
												fontWeight: "bold",
												color: "#2c3e50",
												mb: 1,
												lineHeight: 1.3,
											}}
										>
											🍹 {cocktail.name}
										</Typography>

										{/* 説明 */}
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{
												mb: 2,
												lineHeight: 1.5,
											}}
										>
											{cocktail.description}
										</Typography>

										{/* メタ情報 */}
										<Box
											sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
										>
											<Chip
												label={getMatchScoreText(score)}
												size="small"
												sx={{
													backgroundColor: getMatchScoreColor(score),
													color: "white",
													fontWeight: "bold",
													fontSize: "0.75rem",
												}}
											/>
										</Box>

										{/* 材料 */}
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{
												display: "block",
												mb: 1,
												fontWeight: "medium",
											}}
										>
											材料:
										</Typography>
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
											{[...cocktail.ingredients]
												.filter((i) => i.id) // idが存在する材料のみを対象にする
												.sort((a: { id: number }, b: { id: number }) => {
													const orderA = ingredientSortOrders.get(a.id);
													const orderB = ingredientSortOrders.get(b.id);
													if (!orderA || !orderB) return 0;

													// カテゴリ順で比較
													if (orderA.category !== orderB.category) {
														return orderA.category - orderB.category;
													}
													// 材料順で比較
													return orderA.ingredient - orderB.ingredient;
												})
												.map((ingredient) => {
													const isSelected = selectedIngredients.includes(
														ingredient.name,
													);
													return (
														<Chip
															key={ingredient.name}
															label={ingredient.name}
															size="small"
															variant={isSelected ? "filled" : "outlined"}
															color={isSelected ? "primary" : "default"}
															sx={{
																fontSize: "0.7rem",
															}}
														/>
													);
												})}
										</Box>

										{/* 詳細表示ボタン */}
										<Link
											href={`/recipes/${cocktail.slug}`}
											style={{ textDecoration: "none", width: "100%" }}
										>
											<Button
												variant="outlined"
												size="small"
												fullWidth
												sx={{
													mt: 2,
													borderRadius: "20px",
													textTransform: "none",
													fontWeight: "medium",
												}}
											>
												詳細を見る
											</Button>
										</Link>
									</CardContent>
								</StyledResultCard>
							</Grid>
						);
					})}
				</Grid>
			</Box>
		</Fade>
	);
}
