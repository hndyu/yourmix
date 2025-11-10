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
	WineBar,
	Liquor,
	LocalBar,
	LocalDrink,
	Restaurant,
} from "@mui/icons-material";

// カテゴリとアイコンのマッピング（フォールバック用）
const categoryIcons: Record<string, React.ComponentType> = {
	醸造酒: WineBar,
	蒸留酒: Liquor,
	混成酒: LocalBar,
	ノンアルコール: LocalDrink,
	その他: Restaurant,
};

interface Category {
	id: number;
	name: string;
	sortOrder: number;
	icon: string | null;
	description: string | null;
}

interface Ingredient {
	id: number;
	name: string;
	category: string | null;
	actualNames: string[]; // グループ化された材料の実際の名称リスト
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
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [groupMapping, setGroupMapping] = React.useState<Record<string, string[]>>({});

	React.useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/ingredients");
			const data = (await res.json()) as {
				categories: Category[];
				ingredients: Ingredient[];
				groupMapping?: Record<string, string[]>;
			};
			setCategories(data.categories);
			setIngredients(data.ingredients);
			if (data.groupMapping) {
				setGroupMapping(data.groupMapping);
			}
		};
		fetchData();
	}, []);

	// 材料のカテゴリ分け
	const ingredientCategories = React.useMemo(() => {
		const categorized: Record<string, Ingredient[]> = {};
		for (const ingredient of ingredients) {
			const category = ingredient.category || "その他";
			if (!categorized[category]) {
				categorized[category] = [];
			}
			categorized[category].push(ingredient);
		}
		return categorized;
	}, [ingredients]);

	// カテゴリをデータベースの並び順でソートする関数
	const sortedCategoryEntries = React.useMemo(() => {
		return Object.entries(ingredientCategories).sort(
			([categoryA], [categoryB]) => {
				const catA = categories.find((c) => c.name === categoryA);
				const catB = categories.find((c) => c.name === categoryB);
				// 定義されていないカテゴリは最後に表示
				const sortOrderA = catA?.sortOrder ?? Infinity;
				const sortOrderB = catB?.sortOrder ?? Infinity;
				return sortOrderA - sortOrderB;
			},
		);
	}, [ingredientCategories, categories]);

	// 材料の選択状態を変更する関数
	const handleIngredientToggle = (displayName: string) => {
		if (disabled) return; // ローディング中は無効化

		// グループ化された材料の場合、実際の材料名を展開
		const ingredient = ingredients.find((ing) => ing.name === displayName);
		const actualNames = ingredient?.actualNames || [displayName];

		// 選択状態を確認（表示名または実際の材料名のいずれかが選択されているか）
		const isCurrentlySelected =
			selectedIngredients.includes(displayName) ||
			actualNames.some((name) => selectedIngredients.includes(name));

		let newSelected: string[];
		if (isCurrentlySelected) {
			// 解除: 表示名と全ての実際の材料名を削除
			newSelected = selectedIngredients.filter(
				(item) => item !== displayName && !actualNames.includes(item),
			);
		} else {
			// 選択: 表示名と全ての実際の材料名を追加
			newSelected = [
				...selectedIngredients.filter(
					(item) => item !== displayName && !actualNames.includes(item),
				),
				displayName,
				...actualNames,
			];
		}

		onIngredientsChange(newSelected);
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

			{/* 全解除ボタン */}
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

			{/* 材料カテゴリ別の選択UI */}
			{sortedCategoryEntries.map(([category, ingredients]) => {
				// カテゴリ情報からアイコン名を取得（フォールバック用に既存のマッピングも使用）
				const categoryInfo = categories.find((c) => c.name === category);
				const iconName = categoryInfo?.icon || category;
				const IconComponent =
					categoryIcons[iconName] || categoryIcons[category];
				
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
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							{IconComponent &&
								React.createElement(IconComponent)}
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
								{ingredients.map((ingredient) => {
									// 選択状態を確認（表示名または実際の材料名のいずれかが選択されているか）
									const isSelected =
										selectedIngredients.includes(ingredient.name) ||
										ingredient.actualNames.some((actualName) =>
											selectedIngredients.includes(actualName),
										);

									return (
										<FormControlLabel
											key={ingredient.id}
											control={
												<Checkbox
													checked={isSelected}
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
