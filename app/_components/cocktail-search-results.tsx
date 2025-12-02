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
	Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import type { Category, Cocktail, Ingredient } from "../types/cocktail";
import { useCocktailSearch } from "../utils/useCocktailSearch";
import { NoResults } from "./no-results";

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

interface CocktailCardProps {
	cocktail: Cocktail;
	ingredientSortOrderMap: Map<
		string,
		{ categoryOrder: number; groupOrder: number }
	>;
	isIngredientSelected: (name: string) => boolean;
}

const CocktailCard = ({
	cocktail,
	ingredientSortOrderMap,
	isIngredientSelected,
}: CocktailCardProps) => {
	const [isImageVisible, setIsImageVisible] = React.useState(true);

	const handleImageError = () => {
		setIsImageVisible(false);
	};

	return (
		<Grid size={{ xs: 12, sm: 6, md: 4 }}>
			<StyledResultCard>
				{cocktail.imageUrl && isImageVisible && (
					<Box
						sx={{
							position: "relative",
							width: "100%",
							height: 140,
						}}
					>
						<Image
							src={`/cocktails/${cocktail.imageUrl}`}
							alt={cocktail.name}
							fill
							sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
							style={{ objectFit: "contain" }}
							onError={handleImageError}
						/>
					</Box>
				)}
				<CardContent
					sx={{ p: 3, pt: cocktail.imageUrl && isImageVisible ? 2 : 3 }}
				>
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
						{[...cocktail.ingredients]
							.sort((a, b) => {
								const orderInfoA = ingredientSortOrderMap.get(a.name) ?? {
									categoryOrder: Number.POSITIVE_INFINITY,
									groupOrder: Number.POSITIVE_INFINITY,
								};
								const orderInfoB = ingredientSortOrderMap.get(b.name) ?? {
									categoryOrder: Number.POSITIVE_INFINITY,
									groupOrder: Number.POSITIVE_INFINITY,
								};

								if (orderInfoA.categoryOrder !== orderInfoB.categoryOrder) {
									return orderInfoA.categoryOrder - orderInfoB.categoryOrder;
								}

								if (orderInfoA.groupOrder !== orderInfoB.groupOrder) {
									return orderInfoA.groupOrder - orderInfoB.groupOrder;
								}

								return (a.id ?? 0) - (b.id ?? 0);
							})
							.map((ingredient) => {
								const isSelected = isIngredientSelected(ingredient.name);

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
	);
};

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
	const { sortedCocktails, ingredientSortOrderMap, isIngredientSelected } =
		useCocktailSearch(cocktails, selectedIngredients, categories, allIngredients);

	if (cocktails.length === 0) {
		return <NoResults show={show} />;
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
						<CocktailCard
							key={cocktail.id}
							cocktail={cocktail}
							ingredientSortOrderMap={ingredientSortOrderMap}
							isIngredientSelected={isIngredientSelected}
						/>
					))}
				</Grid>
			</Box>
		</Fade>
	);
}
