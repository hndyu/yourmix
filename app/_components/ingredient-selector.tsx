"use client";

import * as React from "react";
import {
	Box,
	Typography,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Chip,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// カテゴリ用のアイコンをインポート
import {
	LocalBar,
	WineBar,
	LocalDrink,
	Restaurant,
	Liquor,
	BubbleChart,
} from "@mui/icons-material";

// カテゴリとアイコンのマッピング
const categoryIcons: Record<string, React.ComponentType> = {
	スピリッツ: LocalBar,
	リキュール: Liquor,
	ワイン: WineBar,
	ジュース: LocalDrink,
	シロップ: BubbleChart,
	その他: Restaurant,
};

interface Ingredient {
	id: number;
	name: string;
	category: string | null;
}

interface IngredientSelectorProps {
	selectedIngredients: string[];
	onIngredientsChange: (ingredients: string[]) => void;
	disabled?: boolean;
}

export default function IngredientSelector({
	selectedIngredients,
	onIngredientsChange,
	disabled = false,
}: IngredientSelectorProps) {
	const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);

	React.useEffect(() => {
		const fetchIngredients = async () => {
			const res = await fetch("/api/ingredients");
			const data = (await res.json()) as Ingredient[];
			setIngredients(data);
		};
		fetchIngredients();
	}, []);

	// 材料のカテゴリ分け
	const ingredientCategories = React.useMemo(() => {
		const categories: Record<string, Ingredient[]> = {};
		for (const ingredient of ingredients) {
			const category = ingredient.category || "その他";
			if (!categories[category]) {
				categories[category] = [];
			}
			categories[category].push(ingredient);
		}
		return categories;
	}, [ingredients]);

	// 材料の選択状態を変更する関数
	const handleIngredientToggle = (ingredientName: string) => {
		if (disabled) return; // ローディング中は無効化

		const newSelected = selectedIngredients.includes(ingredientName)
			? selectedIngredients.filter((item) => item !== ingredientName)
			: [...selectedIngredients, ingredientName];
		onIngredientsChange(newSelected);
	};

	// 全選択・全解除の関数
	const handleSelectAll = () => {
		if (disabled) return; // ローディング中は無効化
		onIngredientsChange(ingredients.map((ing) => ing.name));
	};

	const handleClearAll = () => {
		if (disabled) return; // ローディング中は無効化
		onIngredientsChange([]);
	};

	return (
		<Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
			{/* タイトル */}
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

			{/* 選択された材料の表示 */}
			{selectedIngredients.length > 0 && (
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
						選択された材料 ({selectedIngredients.length}個):
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
						{selectedIngredients.map((ingredient) => (
							<Chip
								key={ingredient}
								label={ingredient}
								size="small"
								onDelete={() => handleIngredientToggle(ingredient)}
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

			{/* 全選択・全解除ボタン */}
			<Box sx={{ display: "flex", gap: 1, mb: 2, justifyContent: "center" }}>
				<Chip
					label="全選択"
					onClick={handleSelectAll}
					variant="outlined"
					color="primary"
					clickable
					disabled={disabled}
					sx={{
						opacity: disabled ? 0.6 : 1,
						cursor: disabled ? "not-allowed" : "pointer",
					}}
				/>
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

			{/* 材料カテゴリ別の選択UI */}
			{Object.entries(ingredientCategories).map(([category, ingredients]) => (
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
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							{categoryIcons[category] &&
								React.createElement(categoryIcons[category])}
							<Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
								{category}
							</Typography>
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
								{ingredients.map((ingredient) => (
									<FormControlLabel
										key={ingredient.id}
										control={
											<Checkbox
												checked={selectedIngredients.includes(
													ingredient.name,
												)}
												onChange={() =>
													handleIngredientToggle(ingredient.name)
												}
												color="primary"
											/>
										}
										label={ingredient.name}
										sx={{
											"& .MuiFormControlLabel-label": {
												fontSize: "0.9rem",
											},
										}}
									/>
								))}
							</Box>
						</FormGroup>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
}
