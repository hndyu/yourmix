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
// 共通化された関数をインポート
import {
	calculateMatchScore,
	sortCocktailsByMatchScore,
} from "../utils/cocktail-filter";
import { useRouter } from "next/navigation";

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
	onCocktailSelect: (cocktail: Cocktail) => void;
	show?: boolean;
}

export default function CocktailSearchResults({
	cocktails,
	selectedIngredients,
	onCocktailSelect,
	show = true,
}: CocktailSearchResultsProps) {
	const router = useRouter();

	// マッチ度順にソート（共通化された関数を使用）
	const sortedCocktails = sortCocktailsByMatchScore(
		cocktails,
		selectedIngredients,
	);

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

	// カクテル詳細ページに遷移する関数
	const handleCocktailClick = React.useCallback(
		(cocktail: Cocktail) => {
			console.log(
				"カクテルをクリックしました:",
				cocktail.name,
				"ID:",
				cocktail.id,
			); // デバッグ用
			router.push(`/recipes/${cocktail.id}`);
		},
		[router],
	);

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
						// 共通化された関数を使用してマッチ度を計算
						const matchScore = calculateMatchScore(
							cocktail,
							selectedIngredients,
						);
						return (
							<Grid key={cocktail.name} size={{ xs: 12, sm: 6, md: 4 }}>
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
											onClick={() => handleCocktailClick(cocktail)}
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
