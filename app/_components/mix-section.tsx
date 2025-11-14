"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MixButton from "./mix-button";
import IngredientSelector, {
	type Ingredient,
	type Category,
} from "./ingredient-selector";

interface MixSectionProps {
	onMixClick: (selectedGroups: string[]) => void;
	ingredients: Ingredient[]; // 親から受け取る
	categories: Category[]; // 親から受け取る
	isMixing?: boolean;
	isInitialLoading?: boolean;
}

export default function MixSection({
	onMixClick,
	ingredients,
	categories,
	isMixing = false,
	isInitialLoading = false,
}: MixSectionProps) {
	// 選択された材料の状態管理
	const [selectedIngredients, setSelectedIngredients] = React.useState<
		string[]
	>([]);
	const [selectedCount, setSelectedCount] = React.useState(0);
	const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);

	// 材料選択の変更ハンドラー
	const handleIngredientsChange = (
		ingredients: string[],
		count: number,
		groups: string[],
	) => {
		setSelectedIngredients(ingredients);
		setSelectedCount(count);
		setSelectedGroups(groups);
	};

	// Mixボタンクリックハンドラー
	const handleMixClick = () => {
		onMixClick(selectedGroups);
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
				ingredients={ingredients}
				categories={categories}
				onIngredientsChange={handleIngredientsChange}
				disabled={isMixing || isInitialLoading}
			/>

			{/* Mixボタン */}
			<MixButton
				onClick={handleMixClick}
				disabled={isInitialLoading || selectedCount === 0}
				isLoading={isMixing}
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
