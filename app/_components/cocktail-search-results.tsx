"use client";

import * as React from "react";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Chip,
	Grid,
	Button,
	Fade,
	Paper,
	Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Cocktail } from "../types/cocktail";

// カスタムスタイルのカード
const StyledResultCard = styled(Card)(({ theme }) => ({
	borderRadius: "15px",
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
	transition: "all 0.3s ease-in-out",
	cursor: "pointer",

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
	onCocktailSelect: (cocktail: Cocktail) => void;
}

export default function CocktailSearchResults({
	cocktails,
	selectedIngredients,
	onCocktailSelect,
}: CocktailSearchResultsProps) {
	// マッチ度を計算する関数
	const calculateMatchScore = (cocktail: Cocktail): number => {
		if (selectedIngredients.length === 0) return 0;

		const cocktailIngredientsText = cocktail.ingredients
			.join(" ")
			.toLowerCase();

		const matchedIngredients = selectedIngredients.filter((ingredient) => {
			const ingredientLower = ingredient.toLowerCase();
			return cocktailIngredientsText.includes(ingredientLower);
		});

		return matchedIngredients.length / selectedIngredients.length;
	};

	// マッチ度順にソート
	const sortedCocktails = [...cocktails].sort((a, b) => {
		const scoreA = calculateMatchScore(a);
		const scoreB = calculateMatchScore(b);
		return scoreB - scoreA;
	});

	if (cocktails.length === 0) {
		return (
			<Fade in={true} timeout={600}>
				<Paper
					elevation={1}
					sx={{
						p: 4,
						textAlign: "center",
						backgroundColor: "#fafafa",
						borderRadius: "15px",
					}}
				>
					<Typography variant="h6" color="text.secondary" gutterBottom>
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
		<Fade in={true} timeout={600}>
			<Box sx={{ mt: 4 }}>
				{/* ヘッダー */}
				<Box sx={{ mb: 3, textAlign: "center" }}>
					<Typography
						variant="h5"
						component="h3"
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
						const matchScore = calculateMatchScore(cocktail);
						return (
							<Grid item key={cocktail.name} xs={12} sm={6} md={4}>
								<StyledResultCard onClick={() => onCocktailSelect(cocktail)}>
									<CardContent sx={{ p: 3 }}>
										{/* カクテル名 */}
										<Typography
											variant="h6"
											component="h4"
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
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
											}}
										>
											{cocktail.description}
										</Typography>

										{/* メタ情報 */}
										<Box
											sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
										>
											<Chip
												label={getMatchScoreText(matchScore)}
												size="small"
												sx={{
													backgroundColor: getMatchScoreColor(matchScore),
													color: "white",
													fontWeight: "bold",
													fontSize: "0.75rem",
												}}
											/>
											<Chip
												label={`難易度: ${cocktail.difficulty === "easy" ? "簡単" : cocktail.difficulty === "medium" ? "普通" : "難しい"}`}
												size="small"
												variant="outlined"
											/>
											<Chip
												label={`${cocktail.prepTime}`}
												size="small"
												variant="outlined"
											/>
										</Box>

										{/* 材料（一部表示） */}
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
											{cocktail.ingredients.slice(0, 3).map((ingredient) => (
												<Chip
													key={ingredient}
													label={ingredient}
													size="small"
													variant="outlined"
													sx={{ fontSize: "0.7rem" }}
												/>
											))}
											{cocktail.ingredients.length > 3 && (
												<Chip
													label={`+${cocktail.ingredients.length - 3}`}
													size="small"
													variant="outlined"
													sx={{ fontSize: "0.7rem" }}
												/>
											)}
										</Box>

										{/* 詳細表示ボタン */}
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
