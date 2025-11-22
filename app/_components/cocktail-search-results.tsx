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
import type { Category, Cocktail, Ingredient } from "../types/cocktail";

const StyledResultCard = styled(Card)(({ theme }) => ({
	borderRadius: "15px",
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
	transition: "all 0.3s ease-in-out",
	"&:hover": {
		transform: "translateY(-4px)",
		boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
	},
}));

interface CocktailSearchResultsProps {
	cocktails: Cocktail[];
	selectedIngredients: string[];
	show?: boolean;
	categories: Category[];
	allIngredients: Ingredient[];
}

export default function CocktailSearchResults({
	cocktails,
	selectedIngredients,
	categories,
	show = true,
	allIngredients,
}: CocktailSearchResultsProps) {
	const ingredientSortOrderMap = React.useMemo(() => {
		const map = new Map<
			string,
			{ categoryOrder: number; groupOrder: number }
		>();
		const categoryOrderMap = new Map(
			categories.map((c) => [c.name, c.sortOrder ?? Number.POSITIVE_INFINITY]),
		);

		for (const group of allIngredients) {
			const groupOrder = group.sortOrder ?? Number.POSITIVE_INFINITY;
			const categoryOrder =
				categoryOrderMap.get(group.categoryName ?? "") ??
				Number.POSITIVE_INFINITY;

			const orderInfo = { categoryOrder, groupOrder };
			map.set(group.name, orderInfo);
			if (group.actualNames) {
				for (const actualName of group.actualNames) {
					map.set(actualName, orderInfo);
				}
			}
		}
		return map;
	}, [allIngredients, categories]);

	const isIngredientSelected = React.useCallback(
		(ingredientName: string) => {
			const isDirectlySelected = selectedIngredients.includes(ingredientName);
			if (isDirectlySelected) return true;

			const parentIngredient = allIngredients.find((ing) =>
				ing.actualNames?.includes(ingredientName),
			);
			return parentIngredient
				? selectedIngredients.includes(parentIngredient.name)
				: false;
		},
		[selectedIngredients, allIngredients],
	);

	// カクテルを「ユーザーが選択しマッチした材料数 / カクテルを作るのに必要なすべての材料数」の割合が高い順に並び替える
	const sortedCocktails = React.useMemo(() => {
		return [...cocktails].sort((a, b) => {
			const calculateMatchRatio = (cocktail: Cocktail) => {
				if (cocktail.ingredients.length === 0) {
					return 0; // 材料がないカクテルは比率0とする
				}
				const matchedCount = cocktail.ingredients.filter((ingredient) =>
					isIngredientSelected(ingredient.name),
				).length;

				return matchedCount / cocktail.ingredients.length;
			};

			const ratioA = calculateMatchRatio(a);
			const ratioB = calculateMatchRatio(b);

			// 比率が高い順にソート (降順)
			// 比率が同じ場合は、元の順序を維持
			return ratioB - ratioA;
		});
	}, [cocktails, isIngredientSelected]);

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

				<Grid container spacing={3}>
					{sortedCocktails.map((cocktail) => (
						<Grid key={cocktail.id} size={{ xs: 12, sm: 6, md: 4 }}>
							<StyledResultCard>
								<CardContent sx={{ p: 3 }}>
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
										{[...cocktail.ingredients] // idが0の材料も表示するため、フィルタリングを削除
											.sort((a, b) => {
												const orderInfoA = ingredientSortOrderMap.get(
													a.name,
												) ?? {
													categoryOrder: Number.POSITIVE_INFINITY,
													groupOrder: Number.POSITIVE_INFINITY,
												};
												const orderInfoB = ingredientSortOrderMap.get(
													b.name,
												) ?? {
													categoryOrder: Number.POSITIVE_INFINITY,
													groupOrder: Number.POSITIVE_INFINITY,
												};

												if (
													orderInfoA.categoryOrder !== orderInfoB.categoryOrder
												) {
													return (
														orderInfoA.categoryOrder - orderInfoB.categoryOrder
													);
												}

												if (orderInfoA.groupOrder !== orderInfoB.groupOrder) {
													return orderInfoA.groupOrder - orderInfoB.groupOrder;
												}

												return (a.id ?? 0) - (b.id ?? 0);
											})
											.map((ingredient) => {
												const isSelected = isIngredientSelected(
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
					))}
				</Grid>
			</Box>
		</Fade>
	);
}
