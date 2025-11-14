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
	Tooltip,
	Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import type { Ingredient, Category } from "../types/cocktail";
import { iconMap, DefaultIcon } from "../utils/icon-map";

interface IngredientSelectorProps {
	selectedIngredients: string[];
	ingredients: Ingredient[]; // 親から受け取る
	categories: Category[]; // 親から受け取る
	onIngredientsChange: (
		ingredients: string[],
		count: number,
		groups: string[],
	) => void;
	disabled?: boolean;
	isInitialLoading?: boolean;
}

export default function IngredientSelector({
	selectedIngredients,
	ingredients,
	categories,
	onIngredientsChange,
	disabled = false,
	isInitialLoading = false,
}: IngredientSelectorProps) {
	// 材料のカテゴリ分け
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

	// カテゴリをデータベースの並び順でソートする関数
	const sortedCategoryEntries = React.useMemo(() => {
		return Object.entries(ingredientCategories).sort(
			([categoryA], [categoryB]) => {
				const catA = categories.find((c) => c.name === categoryA);
				const catB = categories.find((c) => c.name === categoryB);
				// 定義されていないカテゴリは最後に表示
				const sortOrderA = catA?.sortOrder ?? Number.POSITIVE_INFINITY;
				const sortOrderB = catB?.sortOrder ?? Number.POSITIVE_INFINITY;
				return sortOrderA - sortOrderB;
			},
		);
	}, [ingredientCategories, categories]);

	// 選択されている材料の表示名リストを作成
	const displayedIngredients = React.useMemo(() => {
		const selected = [];
		for (const ing of ingredients) {
			// selectedIngredientsには表示名とその実際の材料名が含まれるため、
			// ing.name（表示名）がselectedIngredientsに含まれていれば選択されていると判断
			if (selectedIngredients.includes(ing.name)) {
				selected.push(ing);
			}
		}

		// sortOrderに基づいてソート
		selected.sort((a, b) => {
			const sortA = a.sortOrder ?? Number.POSITIVE_INFINITY;
			const sortB = b.sortOrder ?? Number.POSITIVE_INFINITY;
			return sortA - sortB;
		});

		// 表示名だけの配列を返す
		return selected.map((ing) => ing.name);
	}, [selectedIngredients, ingredients]);

	// 選択されている材料の数を計算 (表示名の数)
	const selectedCount = React.useMemo(() => {
		return displayedIngredients.length;
	}, [displayedIngredients]);

	// 材料の選択状態を変更する関数
	const handleIngredientToggle = (displayName: string) => {
		if (disabled) return; // ローディング中は無効化

		const ingredient = ingredients.find((ing) => ing.name === displayName);
		// ingredientが見つからない場合は、そのdisplayName自体が実際の材料名とみなす
		const actualNames = ingredient?.actualNames || [displayName];
		const isCurrentlySelected = selectedIngredients.includes(displayName);

		let newRawSelection: string[]; // onIngredientsChangeの第一引数（生の選択リスト）

		if (isCurrentlySelected) {
			// 解除: 表示名と関連する全ての実際の材料名をnewRawSelectionから削除
			newRawSelection = selectedIngredients.filter(
				(item) => item !== displayName && !actualNames.includes(item),
			);
		} else {
			// 選択: 選択上限に達していないか確認
			if (selectedCount < 5) {
				// 表示名と関連する全ての実際の材料名をnewRawSelectionに追加
				newRawSelection = [...selectedIngredients, displayName, ...actualNames];
			} else {
				return; // 5個以上選択できない場合は何もしない
			}
		}
		// 新しい生の選択リストに基づいて、新しい表示名リストを計算
		const tempDisplayed = new Set<string>();
		for (const ing of ingredients) {
			if (newRawSelection.includes(ing.name)) {
				tempDisplayed.add(ing.name);
			}
		}
		const newDisplayedSelection = Array.from(tempDisplayed);

		onIngredientsChange(
			newRawSelection,
			newDisplayedSelection.length, // countは表示名の数
			newDisplayedSelection,
		);
	};

	const handleClearAll = () => {
		if (disabled) return; // ローディング中は無効化
		onIngredientsChange([], 0, []);
	};

	// 初期ロード中にスケルトンUIを表示
	if (isInitialLoading) {
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

				{/* 全解除ボタンのスケルトン */}
				<Box sx={{ display: "flex", gap: 1, mb: 2, justifyContent: "center" }}>
					<Skeleton
						variant="rectangular"
						width={80}
						height={32}
						sx={{ borderRadius: "16px" }}
					/>
				</Box>

				{/* 材料カテゴリのスケルトン */}
				{Array.from(new Array(3)).map((_, index) => (
					<Accordion key={`skeleton-accordion-${index}`} disabled defaultExpanded>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									width: "100%",
								}}
							>
								<Skeleton variant="circular" width={24} height={24} />
								<Skeleton variant="text" width="30%" />
							</Box>
						</AccordionSummary>
						<AccordionDetails>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
									gap: 2,
								}}
							>
								{Array.from(new Array(4)).map((_, itemIndex) => (
									<Skeleton
										key={`skeleton-item-${index}-${itemIndex}`}
										variant="text"
										height={24} />
								))}
							</Box>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		);
	}

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

			{/* 上限メッセージ */}
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

			{/* 選択された材料の表示 */}
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
						{displayedIngredients.map((ingredient) => (
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
								<Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
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
										// 選択状態を確認（表示名または実際の材料名のいずれかが選択されているか）
										const isSelected = selectedIngredients.includes(
											ingredient.name,
										); // ingredient.nameはdisplayName
										const isLimitReached = selectedCount >= 5;

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
														disabled={!isSelected && isLimitReached}
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
