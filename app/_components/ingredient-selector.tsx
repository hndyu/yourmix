"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Checkbox,
	Chip,
	FormControlLabel,
	FormGroup,
	Paper,
	Tooltip,
	Typography,
} from "@mui/material";
import * as React from "react";
import type { Category, Ingredient } from "../types/cocktail";
import { DefaultIcon, iconMap } from "../utils/icon-map";
import IngredientSelectorSkeleton from "./ingredient-selector-skeleton";

interface IngredientSelectorProps {
	selectedIngredientIds: number[];
	ingredients: Ingredient[];
	categories: Category[];
	onIngredientsChange: (ids: number[], names: string[]) => void;
	disabled?: boolean;
	isInitialLoading?: boolean;
}

export default function IngredientSelector({
	selectedIngredientIds,
	ingredients,
	categories,
	onIngredientsChange,
	disabled = false,
	isInitialLoading = false,
}: IngredientSelectorProps) {
	const ingredientsById = React.useMemo(() => {
		return new Map(ingredients.map((ing) => [ing.id, ing]));
	}, [ingredients]);

	const ingredientCategories = React.useMemo(() => {
		const categorized: Record<string, Ingredient[]> = {};
		for (const ingredient of ingredients) {
			const category = ingredient.categoryName || "その他";
			if (!categorized[category]) {
				categorized[category] = [];
			}
			categorized[category].push(ingredient);
		}
		return categorized;
	}, [ingredients]);

	const sortedCategoryEntries = React.useMemo(() => {
		return Object.entries(ingredientCategories).sort(
			([categoryA], [categoryB]) => {
				const catA = categories.find((c) => c.name === categoryA);
				const catB = categories.find((c) => c.name === categoryB);
				const sortOrderA = catA?.sortOrder ?? Number.POSITIVE_INFINITY;
				const sortOrderB = catB?.sortOrder ?? Number.POSITIVE_INFINITY;
				return sortOrderA - sortOrderB;
			},
		);
	}, [ingredientCategories, categories]);

	const selectedIngredients = React.useMemo(() => {
		return selectedIngredientIds
			.map((id) => ingredientsById.get(id))
			.filter((ing): ing is Ingredient => !!ing)
			.sort((a, b) => {
				const sortA = a.sortOrder ?? Number.POSITIVE_INFINITY;
				const sortB = b.sortOrder ?? Number.POSITIVE_INFINITY;
				return sortA - sortB;
			});
	}, [selectedIngredientIds, ingredientsById]);

	const selectedCount = selectedIngredients.length;

	const handleIngredientToggle = (ingredientId: number) => {
		if (disabled) return;

		const isCurrentlySelected = selectedIngredientIds.includes(ingredientId);
		let newSelectedIds: number[];

		if (isCurrentlySelected) {
			newSelectedIds = selectedIngredientIds.filter((id) => id !== ingredientId);
		} else {
			if (selectedCount < 5) {
				newSelectedIds = [...selectedIngredientIds, ingredientId];
			} else {
				return;
			}
		}

		const newSelectedNames = newSelectedIds
			.map((id) => ingredientsById.get(id)?.name)
			.filter((name): name is string => !!name);

		onIngredientsChange(newSelectedIds, newSelectedNames);
	};

	const handleClearAll = () => {
		if (disabled) return;
		onIngredientsChange([], []);
	};

	if (isInitialLoading) {
		return <IngredientSelectorSkeleton />;
	}

	return (
		<Box component="section" sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
			<Typography
				variant="h6"
				component="h3"
				gutterBottom
				sx={{
					textAlign: "center",
					color: "text.primary",
					mb: 2,
					fontWeight: "medium",
				}}
			>
				材料を選択してください
			</Typography>

			{selectedCount >= 5 && (
				<Typography
					variant="body2"
					color="text.secondary"
					textAlign="center"
					sx={{ mb: 2 }}
				>
					材料は5つまで選択できます。
				</Typography>
			)}

			{selectedCount > 0 && (
				<Paper
					elevation={1}
					sx={{
						p: 2,
						mb: 3,
						backgroundColor: "primary.light",
						color: "primary.contrastText",
						opacity: disabled ? 0.6 : 1,
						transition: "opacity 0.3s ease",
					}}
				>
					<Typography variant="subtitle2" gutterBottom>
						選択された材料 ({selectedCount}個):
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
						{selectedIngredients.map((ingredient) => (
							<Chip
								key={ingredient.id}
								label={ingredient.name}
								size="small"
								onDelete={() => handleIngredientToggle(ingredient.id)}
								sx={{
									backgroundColor: "primary.main",
									color: "primary.contrastText",
									"& .MuiChip-deleteIcon": {
										color: "primary.contrastText",
									},
								}}
							/>
						))}
					</Box>
				</Paper>
			)}

			{selectedCount > 0 && (
				<Box sx={{ display: "flex", gap: 1, mb: 2, justifyContent: "center" }}>
					<Chip
						label="全解除"
						onClick={handleClearAll}
						variant="outlined"
						color="secondary"
						clickable
						disabled={disabled}
						sx={{
							opacity: disabled ? 0.6 : 1,
							cursor: disabled ? "not-allowed" : "pointer",
						}}
					/>
				</Box>
			)}

			{sortedCategoryEntries.map(([category, ingredients]) => {
				const categoryInfo = categories.find((c) => c.name === category);
				const iconName = categoryInfo?.icon;
				const IconComponent = (iconName && iconMap[iconName]) || DefaultIcon;

				return (
					<Accordion
						key={category}
						defaultExpanded
						disabled={disabled}
						sx={{
							opacity: disabled ? 0.6 : 1,
							pointerEvents: disabled ? "none" : "auto",
						}}
					>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									width: "100%",
								}}
							>
								{IconComponent && React.createElement(IconComponent)}
								<Typography
									component="h4"
									variant="subtitle1"
									sx={{ fontWeight: "medium" }}
								>
									{category}
								</Typography>
								{categoryInfo?.description && (
									<Tooltip title={categoryInfo.description} arrow>
										<HelpOutlineIcon
											fontSize="small"
											sx={{ color: "text.secondary", cursor: "pointer" }}
										/>
									</Tooltip>
								)}
							</Box>
						</AccordionSummary>
						<AccordionDetails>
							<FormGroup>
								<Box
									sx={{
										display: "grid",
										gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
										gap: 1,
									}}
								>
									{ingredients.map((ingredient) => {
										const isSelected = selectedIngredientIds.includes(
											ingredient.id,
										);
										const isLimitReached = selectedCount >= 5;

										return (
											<FormControlLabel
												key={ingredient.id}
												control={
													<Checkbox
														checked={isSelected}
														onChange={() => handleIngredientToggle(ingredient.id)}
														color="primary"
														disabled={disabled || (!isSelected && isLimitReached)}
													/>
												}
												label={
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.5,
														}}
													>
														<Typography sx={{ fontSize: "0.9rem" }}>
															{ingredient.name}
														</Typography>
														{ingredient.description && (
															<Tooltip title={ingredient.description} arrow>
																<HelpOutlineIcon
																	fontSize="small"
																	sx={{
																		color: "text.secondary",
																		cursor: "pointer",
																		verticalAlign: "middle",
																	}}
																/>
															</Tooltip>
														)}
													</Box>
												}
											/>
										);
									})}
								</Box>
							</FormGroup>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</Box>
	);
}
