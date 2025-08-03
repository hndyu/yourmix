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
import { LocalBar, WineBar, LocalDrink, Restaurant } from "@mui/icons-material";

// カテゴリとアイコンのマッピング
const categoryIcons: Record<string, React.ComponentType> = {
	ベーススピリッツ: LocalBar,
	リキュール: WineBar,
	ジュースシロップ: LocalDrink,
	その他: Restaurant,
};

// 利用可能な材料のリスト
const availableIngredients = [
	// ベーススピリッツ
	"ラム",
	"テキーラ",
	"ウイスキー",
	"ジン",
	"ウォッカ",
	"ブランデー",
	// リキュール
	"トリプルセック",
	"ブルーキュラソー",
	"アマレット",
	"カンパリ",
	// ジュース・シロップ
	"ライムジュース",
	"レモンジュース",
	"オレンジジュース",
	"グレープフルーツジュース",
	"シンプルシロップ",
	"グレナデンシロップ",
	// その他
	"トニックウォーター",
	"ソーダ水",
	"ジンジャーエール",
	"コーラ",
	"アンゴスチュラビターズ",
	"オレンジビターズ",
	"ミントの葉",
	"ライムスライス",
	"レモンスライス",
	"オレンジスライス",
];

interface IngredientSelectorProps {
	selectedIngredients: string[];
	onIngredientsChange: (ingredients: string[]) => void;
}

export default function IngredientSelector({
	selectedIngredients,
	onIngredientsChange,
}: IngredientSelectorProps) {
	// 材料のカテゴリ分け
	const ingredientCategories = {
		ベーススピリッツ: [
			"ラム",
			"テキーラ",
			"ウイスキー",
			"ジン",
			"ウォッカ",
			"ブランデー",
		],
		リキュール: [
			"トリプルセック",
			"ブルーキュラソー",
			"アマレット",
			"カンパリ",
		],
		ジュースシロップ: [
			"ライムジュース",
			"レモンジュース",
			"オレンジジュース",
			"グレープフルーツジュース",
			"シンプルシロップ",
			"グレナデンシロップ",
		],
		その他: [
			"トニックウォーター",
			"ソーダ水",
			"ジンジャーエール",
			"コーラ",
			"アンゴスチュラビターズ",
			"オレンジビターズ",
			"ミントの葉",
			"ライムスライス",
			"レモンスライス",
			"オレンジスライス",
		],
	};

	// 材料の選択状態を変更する関数
	const handleIngredientToggle = (ingredient: string) => {
		const newSelected = selectedIngredients.includes(ingredient)
			? selectedIngredients.filter((item) => item !== ingredient)
			: [...selectedIngredients, ingredient];
		onIngredientsChange(newSelected);
	};

	// 全選択・全解除の関数
	const handleSelectAll = () => {
		onIngredientsChange(availableIngredients);
	};

	const handleClearAll = () => {
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
				/>
				<Chip
					label="全解除"
					onClick={handleClearAll}
					variant="outlined"
					color="secondary"
					clickable
				/>
			</Box>

			{/* 材料カテゴリ別の選択UI */}
			{Object.entries(ingredientCategories).map(([category, ingredients]) => (
				<Accordion key={category} defaultExpanded>
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
										key={ingredient}
										control={
											<Checkbox
												checked={selectedIngredients.includes(ingredient)}
												onChange={() => handleIngredientToggle(ingredient)}
												color="primary"
											/>
										}
										label={ingredient}
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
