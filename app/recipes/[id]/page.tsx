"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid,
	Button,
	Chip,
	Divider,
	Paper,
	Fade,
	Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowBack, Share, Timer, Restaurant } from "@mui/icons-material";
import type { Cocktail } from "../../types/cocktail";
import { mockCocktails } from "../../types/cocktail";

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
	const cocktailId = params.id as string;

	// カクテルデータを取得（実際の実装ではAPIから取得）
	const cocktail = mockCocktails.find((c) => c.id === cocktailId);

	// カクテルが見つからない場合
	if (!cocktail) {
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
							指定されたIDのレシピは存在しません。
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

	// シェア機能
	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: `${cocktail.name} - レシピ`,
					text: cocktail.description,
					url: window.location.href,
				});
			} catch (error) {
				console.log("シェアがキャンセルされました");
			}
		} else {
			// フォールバック：URLをコピー
			navigator.clipboard.writeText(window.location.href);
			alert("URLをコピーしました！");
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Fade in timeout={1000}>
				<Box>
					{/* ヘッダー */}
					<Box sx={{ mb: 4 }}>
						<Button
							variant="outlined"
							onClick={() => router.back()}
							startIcon={<ArrowBack />}
							sx={{ mb: 2 }}
						>
							戻る
						</Button>
						<Typography
							variant="h3"
							component="h1"
							sx={{
								fontWeight: "bold",
								color: "#2c3e50",
								mb: 1,
							}}
						>
							🍹 {cocktail.name}
						</Typography>
						<Typography
							variant="h6"
							color="text.secondary"
							sx={{ mb: 3, lineHeight: 1.6 }}
						>
							{cocktail.description}
						</Typography>
					</Box>

					<Grid container spacing={4}>
						{/* メインコンテンツ */}
						<Grid size={{ xs: 12, lg: 8 }}>
							{/* 材料セクション */}
							<StyledDetailCard sx={{ mb: 4 }}>
								<CardContent sx={{ p: 4 }}>
									<Typography
										variant="h5"
										component="h2"
										sx={{
											fontWeight: "bold",
											color: "#2c3e50",
											mb: 3,
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}
									>
										<Restaurant sx={{ color: "#e74c3c" }} />
										材料
									</Typography>
									<Grid container spacing={2}>
										{cocktail.ingredients.map((ingredient, index) => (
											<Grid size={{ xs: 12, sm: 6 }} key={index}>
												<Paper
													elevation={1}
													sx={{
														p: 2,
														backgroundColor: "#f8f9fa",
														borderRadius: "10px",
														display: "flex",
														justifyContent: "space-between",
													}}
												>
													<Typography variant="body1" fontWeight="medium">
														{ingredient.name}
													</Typography>
													<Typography variant="body1" color="text.secondary">
														{ingredient.amount}
													</Typography>
												</Paper>
											</Grid>
										))}
									</Grid>
								</CardContent>
							</StyledDetailCard>

							{/* 作り方セクション */}
							<StyledDetailCard>
								<CardContent sx={{ p: 4 }}>
									<Typography
										variant="h5"
										component="h2"
										sx={{
											fontWeight: "bold",
											color: "#2c3e50",
											mb: 3,
										}}
									>
										📝 作り方
									</Typography>
									<Box>
										{cocktail.instructions.map((instruction, index) => (
											<Box key={index} sx={{ mb: 3 }}>
												<Paper
													elevation={1}
													sx={{
														p: 3,
														backgroundColor: "#f8f9fa",
														borderRadius: "10px",
														borderLeft: "4px solid #3498db",
													}}
												>
													<Typography
														variant="h6"
														sx={{
															color: "#3498db",
															fontWeight: "bold",
															mb: 1,
														}}
													>
														Step {index + 1}
													</Typography>
													<Typography variant="body1" lineHeight={1.8}>
														{instruction}
													</Typography>
												</Paper>
											</Box>
										))}
									</Box>
								</CardContent>
							</StyledDetailCard>
						</Grid>

						{/* サイドバー */}
						<Grid size={{ xs: 12, lg: 4 }}>
							{/* 基本情報 */}
							<StyledDetailCard sx={{ mb: 4 }}>
								<CardContent sx={{ p: 3 }}>
									<Typography
										variant="h6"
										component="h3"
										sx={{
											fontWeight: "bold",
											color: "#2c3e50",
											mb: 2,
										}}
									>
										基本情報
									</Typography>
									<Box
										sx={{ display: "flex", flexDirection: "column", gap: 2 }}
									>
										{cocktail.garnish && (
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												<Restaurant sx={{ color: "#f39c12" }} />
												<Typography variant="body2" color="text.secondary">
													ガーニッシュ: {cocktail.garnish}
												</Typography>
											</Box>
										)}
									</Box>
								</CardContent>
							</StyledDetailCard>

							{/* アクションボタン */}
							<StyledDetailCard>
								<CardContent sx={{ p: 3 }}>
									<Typography
										variant="h6"
										component="h3"
										sx={{
											fontWeight: "bold",
											color: "#2c3e50",
											mb: 2,
										}}
									>
										アクション
									</Typography>
									<Box
										sx={{ display: "flex", flexDirection: "column", gap: 2 }}
									>
										<Button
											variant="contained"
											fullWidth
											onClick={handleShare}
											startIcon={<Share />}
											sx={{
												borderRadius: "25px",
												textTransform: "none",
												fontWeight: "bold",
												py: 1.5,
											}}
										>
											シェアする
										</Button>
										<Button
											variant="outlined"
											fullWidth
											onClick={() => router.push("/")}
											startIcon={<ArrowBack />}
											sx={{
												borderRadius: "25px",
												textTransform: "none",
												fontWeight: "medium",
												py: 1.5,
											}}
										>
											ホームに戻る
										</Button>
									</Box>
								</CardContent>
							</StyledDetailCard>
						</Grid>
					</Grid>
				</Box>
			</Fade>
		</Container>
	);
}
