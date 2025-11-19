"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Category, Ingredient } from "../types/cocktail";
import IngredientSelector from "./ingredient-selector";
import MixButton from "./mix-button";

interface MixSectionProps {
	onMixClick: () => void;
	ingredients: Ingredient[];
	categories: Category[];
	selectedIngredientIds: number[];
	onIngredientsChange: (ids: number[], names: string[]) => void;
	isMixing?: boolean;
	isInitialLoading?: boolean;
}

export default function MixSection({
	onMixClick,
	ingredients,
	categories,
	selectedIngredientIds,
	onIngredientsChange,
	isMixing = false,
	isInitialLoading = false,
}: MixSectionProps) {
	const selectedCount = selectedIngredientIds.length;

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				gap: 3,
			}}
		>
			<Typography
				variant="h5"
				component="h2"
				gutterBottom
				sx={{
					textAlign: "center",
					color: "text.secondary",
					mb: 2,
					fontWeight: "medium",
				}}
			>
				あなただけのカクテルを作ってみよう
			</Typography>

			<IngredientSelector
				selectedIngredientIds={selectedIngredientIds}
				ingredients={ingredients}
				categories={categories}
				onIngredientsChange={onIngredientsChange}
				disabled={isMixing || isInitialLoading}
				isInitialLoading={isInitialLoading}
			/>

			<MixButton
				onClick={onMixClick}
				disabled={isInitialLoading || selectedCount === 0}
				isLoading={isMixing}
			/>

			<Typography
				variant="body2"
				sx={{
					textAlign: "center",
					color: "text.secondary",
					opacity: 0.8,
				}}
			>
				{isInitialLoading
					? "材料を読み込んでいます..."
					: isMixing
						? "カクテルを生成中です..."
						: selectedCount > 0
							? `選択された材料 (${selectedCount}個) からレシピを生成します`
							: "材料を選択してからMixボタンを押してください"}
			</Typography>
		</Box>
	);
}
