"use client";

import * as React from "react";
import {
	Card,
	CardContent,
	Typography,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Divider,
	Button,
	Fade,
	Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Cocktail } from "../types/cocktail";

// カスタムスタイルのカード
const StyledCocktailCard = styled(Card)(({ theme }) => ({
	borderRadius: "20px",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
	marginBottom: theme.spacing(3),
}));

// 難易度に応じた色を取得
const getDifficultyColor = (difficulty: string) => {
	switch (difficulty) {
		case "easy":
			return "#4caf50";
		case "medium":
			return "#ff9800";
		case "hard":
			return "#f44336";
		default:
			return "#757575";
	}
};

interface CocktailDisplayProps {
	cocktail: Cocktail;
	onRemove?: () => void;
}

export default function CocktailDisplay({
	cocktail,
	onRemove,
}: CocktailDisplayProps) {
	return (
		<Fade in={true} timeout={800}>
			<StyledCocktailCard>
				<CardContent sx={{ p: 4 }}>
					{/* ヘッダー部分 */}
					<Box sx={{ mb: 3 }}>
						<Typography
							variant="h4"
							component="h2"
							sx={{
								fontWeight: "bold",
								color: "#2c3e50",
								mb: 1,
							}}
						>
							🍹 {cocktail.name}
						</Typography>
						<Typography
							variant="body1"
							sx={{
								color: "text.secondary",
								mb: 2,
								fontStyle: "italic",
							}}
						>
							{cocktail.description}
						</Typography>

						{/* メタ情報 */}
						<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
							<Chip
								label={`難易度: ${cocktail.difficulty === "easy" ? "簡単" : cocktail.difficulty === "medium" ? "普通" : "難しい"}`}
								sx={{
									backgroundColor: getDifficultyColor(cocktail.difficulty),
									color: "white",
									fontWeight: "bold",
								}}
							/>
							<Chip
								label={`準備時間: ${cocktail.prepTime}`}
								variant="outlined"
							/>
							<Chip
								label={`グラス: ${cocktail.glassType}`}
								variant="outlined"
							/>
						</Box>
					</Box>

					{/* 材料と作り方を横並びで表示 */}
					<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
						{/* 材料 */}
						<Box sx={{ flex: 1, minWidth: 300 }}>
							<Typography
								variant="h6"
								sx={{
									fontWeight: "bold",
									color: "#34495e",
									mb: 2,
								}}
							>
								📋 材料
							</Typography>
							<Paper elevation={1} sx={{ p: 2, backgroundColor: "#fafafa" }}>
								<List dense>
									{cocktail.ingredients.map((ingredient, index) => (
										<ListItem key={ingredient} sx={{ py: 0.5 }}>
											<ListItemText
												primary={ingredient}
												sx={{
													"& .MuiListItemText-primary": {
														fontSize: "0.95rem",
													},
												}}
											/>
										</ListItem>
									))}
								</List>
							</Paper>
						</Box>

						{/* 作り方 */}
						<Box sx={{ flex: 1, minWidth: 300 }}>
							<Typography
								variant="h6"
								sx={{
									fontWeight: "bold",
									color: "#34495e",
									mb: 2,
								}}
							>
								👨‍🍳 作り方
							</Typography>
							<Paper elevation={1} sx={{ p: 2, backgroundColor: "#fafafa" }}>
								<List>
									{cocktail.instructions.map((instruction, index) => (
										<ListItem key={instruction} sx={{ py: 1 }}>
											<ListItemText
												primary={`${index + 1}. ${instruction}`}
												sx={{
													"& .MuiListItemText-primary": {
														fontSize: "0.95rem",
														lineHeight: 1.6,
													},
												}}
											/>
										</ListItem>
									))}
								</List>
							</Paper>
						</Box>
					</Box>

					{/* ガーニッシュ */}
					{cocktail.garnish && (
						<Box sx={{ mt: 3 }}>
							<Typography
								variant="h6"
								sx={{
									fontWeight: "bold",
									color: "#34495e",
									mb: 1,
								}}
							>
								🌿 ガーニッシュ
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{cocktail.garnish}
							</Typography>
						</Box>
					)}

					{/* 削除ボタン（オプション） */}
					{onRemove && (
						<Box sx={{ textAlign: "center", mt: 3 }}>
							<Button
								variant="outlined"
								color="error"
								onClick={onRemove}
								sx={{
									borderRadius: "25px",
									px: 3,
									py: 1,
								}}
							>
								このレシピを削除
							</Button>
						</Box>
					)}
				</CardContent>
			</StyledCocktailCard>
		</Fade>
	);
}
