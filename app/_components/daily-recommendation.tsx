"use client";

import { AccessTime, LocalBar, TrendingUp } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { Cocktail } from "../types/cocktail";
import { getDailyRecommendation } from "../utils/cocktail-filter";

interface DailyRecommendationProps {
	cocktails: Cocktail[];
}

export default function DailyRecommendation({
	cocktails,
}: DailyRecommendationProps) {
	const router = useRouter();

	// 日替わりおすすめカクテルを取得
	const dailyCocktail = React.useMemo(() => {
		return getDailyRecommendation(cocktails);
	}, [cocktails]);

	// 詳細ページに遷移する関数
	const handleViewRecipe = () => {
		router.push(`/recipes/${dailyCocktail.slug}`);
	};

	return (
		<Box sx={{ mb: 4, textAlign: "center" }}>
			{/* セクションタイトル */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					mb: 2,
					justifyContent: "center",
				}}
			>
				<TrendingUp color="primary" />
				<Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
					今日のおすすめ
				</Typography>
			</Box>

			{/* おすすめカクテルカード */}
			<Card
				elevation={3}
				sx={{
					maxWidth: 400,
					mx: "auto",
					background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
					borderRadius: 3,
					overflow: "hidden",
					transition: "transform 0.3s ease, box-shadow 0.3s ease",
					"&:hover": {
						transform: "translateY(-4px)",
						boxShadow: 6,
					},
				}}
			>
				{/* カクテル画像（プレースホルダー） */}
				<CardMedia
					component="div"
					sx={{
						height: 200,
						background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
					}}
				>
					<LocalBar sx={{ fontSize: 60, color: "white" }} />
					{/* おすすめバッジ */}
					<Chip
						label="おすすめ"
						color="primary"
						size="small"
						sx={{
							position: "absolute",
							top: 16,
							right: 16,
							fontWeight: "bold",
						}}
					/>
				</CardMedia>

				<CardContent sx={{ p: 3 }}>
					{/* カクテル名 */}
					<Typography
						variant="h6"
						component="h3"
						gutterBottom
						sx={{ fontWeight: "bold", color: "text.primary" }}
					>
						{dailyCocktail.name}
					</Typography>

					{/* 説明 */}
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 2, lineHeight: 1.6 }}
					>
						{dailyCocktail.description}
					</Typography>

					{/* 材料のプレビュー */}
					<Typography variant="body2" sx={{ mb: 2 }}>
						<strong>材料:</strong>{" "}
						{dailyCocktail.ingredients
							.slice(0, 3)
							.map((i) => i.name)
							.join(", ")}
						{dailyCocktail.ingredients.length > 3 && "..."}
					</Typography>

					{/* メタ情報 */}
					<Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}></Box>

					{/* 詳細を見るボタン */}
					<Button
						variant="contained"
						fullWidth
						onClick={handleViewRecipe}
						sx={{
							background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
							color: "white",
							fontWeight: "bold",
							py: 1,
							"&:hover": {
								background: "linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)",
							},
						}}
					>
						レシピを見る
					</Button>
				</CardContent>
			</Card>
		</Box>
	);
}
