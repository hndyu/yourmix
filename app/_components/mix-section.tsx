"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MixButton from "./mix-button";
import IngredientSelector from "./ingredient-selector";

interface MixSectionProps {
	onMixClick: (selectedIngredients: string[]) => void;
	disabled?: boolean;
	isLoading?: boolean;
}

export default function MixSection({
	onMixClick,
	disabled = false,
	isLoading = false,
}: MixSectionProps) {
	// 選択された材料の状態管理
	const [selectedIngredients, setSelectedIngredients] = React.useState<
		string[]
	>([]);

	// 材料選択の変更ハンドラー
	const handleIngredientsChange = (ingredients: string[]) => {
		setSelectedIngredients(ingredients);
	};

	// Mixボタンクリックハンドラー
	const handleMixClick = () => {
		onMixClick(selectedIngredients);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				gap: 3,
			}}
		>
			{/* 説明テキスト */}
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

			{/* 材料選択UI */}
			<IngredientSelector
				selectedIngredients={selectedIngredients}
				onIngredientsChange={handleIngredientsChange}
				disabled={isLoading}
			/>

			{/* Mixボタン */}
			<MixButton
				onClick={handleMixClick}
				disabled={disabled || selectedIngredients.length === 0}
				isLoading={isLoading}
			/>

			{/* サブテキスト */}
			<Typography
				variant="body2"
				sx={{
					textAlign: "center",
					color: "text.secondary",
					opacity: 0.8,
				}}
			>
				{isLoading
					? "カクテルを生成中です..."
					: selectedIngredients.length > 0
					? `選択された材料 (${selectedIngredients.length}個) からレシピを生成します`
					: "材料を選択してからMixボタンを押してください"}
			</Typography>
		</Box>
	);
}
