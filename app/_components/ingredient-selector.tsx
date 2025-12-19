"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Box,
	Checkbox,
	Chip,
	Collapse,
	FormGroup,
	IconButton,
	InputAdornment,
	TextField,
	Tooltip,
	Typography,
	createFilterOptions,
} from "@mui/material";
import * as React from "react";
import type { Category, Ingredient } from "../types/cocktail";
import { DefaultIcon, iconMap } from "../utils/icon-map";
import IngredientSelectorSkeleton from "./ingredient-selector-skeleton";

interface IngredientSelectorProps {
	selectedIngredientIds: number[];
	selectedIngredientNames: string[];
	ingredients: Ingredient[];
	categories: Category[];
	onIngredientsChange: (ids: number[], names: string[]) => void;
	disabled?: boolean;
	isInitialLoading?: boolean;
}

// 検索オプションの型定義
interface SearchOption {
	label: string;
	ingredient: Ingredient;
	type: "group" | "detail";
	groupName?: string;
}

export default function IngredientSelector({
	selectedIngredientIds,
	selectedIngredientNames,
	ingredients,
	categories,
	onIngredientsChange,
	disabled = false,
	isInitialLoading = false,
}: IngredientSelectorProps) {
	// 詳細表示の展開状態を管理（ingredient.id -> boolean）
	const [expandedIngredients, setExpandedIngredients] = React.useState<
		Record<number, boolean>
	>({});

	const handleExpandClick = (ingredientId: number) => {
		setExpandedIngredients((prev) => ({
			...prev,
			[ingredientId]: !prev[ingredientId],
		}));
	};

	// 検索オプションの生成
	const searchOptions = React.useMemo(() => {
		const options: SearchOption[] = [];
		for (const ing of ingredients) {
			// 材料のみ追加
			if (ing.actualNames) {
				for (const actualName of ing.actualNames) {
					options.push({
						label: actualName,
						ingredient: ing,
						type: "detail",
						groupName: ing.name,
					});
				}
			}
		}

		// ソート順：カテゴリオブジェクトのsortOrder -> 親材料名 -> 詳細材料名
		return options.sort((a, b) => {
			const catA = categories.find((c) => c.name === a.ingredient.categoryName);
			const catB = categories.find((c) => c.name === b.ingredient.categoryName);

			const orderA = catA?.sortOrder ?? Number.POSITIVE_INFINITY;
			const orderB = catB?.sortOrder ?? Number.POSITIVE_INFINITY;

			if (orderA !== orderB) {
				return orderA - orderB;
			}

			const groupA = a.groupName || "";
			const groupB = b.groupName || "";
			if (groupA !== groupB) {
				return groupA.localeCompare(groupB, "ja");
			}

			return a.label.localeCompare(b.label, "ja");
		});
	}, [ingredients, categories]);

	// カテゴリごとのグルーピング
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

	const currentTotalCount = React.useMemo(() => {
		let count = 0;
		for (const id of selectedIngredientIds) {
			const ingredient = ingredients.find((ing) => ing.id === id);
			if (!ingredient) continue;

			// このグループで選択されている名前（親または詳細）
			const relatedNames = [ingredient.name, ...(ingredient.actualNames || [])];
			const currentSelectedGroupNames = selectedIngredientNames.filter((n) =>
				relatedNames.includes(n),
			);

			// 詳細が選択されているか？
			const details = ingredient.actualNames || [];
			const selectedDetails = currentSelectedGroupNames.filter((n) =>
				details.includes(n),
			);

			if (selectedDetails.length > 0) {
				count += selectedDetails.length;
			} else if (currentSelectedGroupNames.length > 0) {
				// 詳細なし、かつ（親などが）選択されている -> 1カウント
				count += 1;
			}
		}
		return count;
	}, [selectedIngredientIds, selectedIngredientNames, ingredients]);

	// 材料の選択/解除ロジック
	const handleToggle = (ingredient: Ingredient, specificName?: string) => {
		if (disabled) return;

		const targetName = specificName || ingredient.name;

		// このグループに関連する全ての名前（親＋子）
		const groupRelatedNames = [
			ingredient.name,
			...(ingredient.actualNames || []),
		];
		// 現在選択されている、このグループに関連する名前のリスト
		const currentSelectedGroupNames = selectedIngredientNames.filter((n) =>
			groupRelatedNames.includes(n),
		);

		const isIdSelected = selectedIngredientIds.includes(ingredient.id);

		// ケース1: 親グループのチェックボックスをクリックした場合 (specificName が undefined)
		if (!specificName) {
			// 既にこのグループの何かが選択されている場合 -> 全解除
			if (currentSelectedGroupNames.length > 0) {
				const newIds = selectedIngredientIds.filter(
					(id) => id !== ingredient.id,
				);
				const newNames = selectedIngredientNames.filter(
					(n) => !groupRelatedNames.includes(n),
				);
				onIngredientsChange(newIds, newNames);
				return;
			}
			// 何も選択されていない場合 -> 親を選択
			// 制限チェック
			if (currentTotalCount >= 5) {
				return;
			}

			onIngredientsChange(
				[...selectedIngredientIds, ingredient.id],
				[...selectedIngredientNames, ingredient.name],
			);
			return;
		}

		// ケース2: 詳細チップ（または検索からの詳細指定）をクリックした場合
		const isTargetNameSelected = selectedIngredientNames.includes(targetName);

		if (isTargetNameSelected) {
			// 選択解除
			const newNames = selectedIngredientNames.filter((n) => n !== targetName);

			// IDの解除判定
			// 解除後も、このグループに関連する名前が残っているかチェック
			const remainingGroupNames = newNames.filter((n) =>
				groupRelatedNames.includes(n),
			);

			let newIds = selectedIngredientIds;
			// もしもうこのグループの名前が一つもなければ、IDも外す
			if (remainingGroupNames.length === 0) {
				newIds = selectedIngredientIds.filter((id) => id !== ingredient.id);
			}

			onIngredientsChange(newIds, newNames);
		} else {
			// 追加選択
			// 制限チェック
			const details = ingredient.actualNames || [];

			const selectedDetails = currentSelectedGroupNames.filter((n) =>
				details.includes(n),
			);
			const isGroupOnlySelected =
				currentSelectedGroupNames.includes(ingredient.name) &&
				selectedDetails.length === 0;

			let willIncrease = false;
			if (selectedDetails.length > 0) {
				willIncrease = true;
			} else {
				// 詳細がまだ選択されていない
				if (isGroupOnlySelected) {
					willIncrease = false; // グループ名 -> 詳細 (1 -> 1)
				} else {
					willIncrease = true; // なし -> 詳細 (0 -> 1)
				}
			}

			if (willIncrease && currentTotalCount >= 5) {
				return;
			}

			// 親の名前が含まれていたら削除しつつ、新しい詳細を追加
			const newNames = selectedIngredientNames
				.filter((n) => n !== ingredient.name)
				.concat(targetName);

			// IDの追加判定
			let newIds = selectedIngredientIds;
			if (!isIdSelected) {
				newIds = [...selectedIngredientIds, ingredient.id];
			}

			onIngredientsChange(newIds, newNames);
		}
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

			{/* 検索バー */}
			<Box sx={{ mb: 3 }}>
				<Autocomplete
					options={searchOptions}
					groupBy={(option) => option.groupName || "詳細材料"}
					getOptionLabel={(option) => option.label}
					filterOptions={createFilterOptions({
						matchFrom: "any",
						stringify: (option) =>
							`${option.label} ${option.groupName || ""} ${option.ingredient.categoryName || ""}`,
					})}
					renderInput={(params) => (
						<TextField
							{...params}
							placeholder="材料を検索 (例: ジン、レモン...)"
							slotProps={{
								input: {
									...params.InputProps,
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon color="action" />
										</InputAdornment>
									),
								},
							}}
						/>
					)}
					onChange={(_, value) => {
						if (value) {
							handleToggle(
								value.ingredient,
								value.type === "detail" ? value.label : undefined,
							);
						}
					}}
					value={null} // 選択後に値をリセット
					blurOnSelect
					disabled={disabled}
					slotProps={{
						paper: { sx: { maxHeight: 300 } },
					}}
				/>
			</Box>

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
							"&.Mui-disabled": { backgroundColor: "transparent" },
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
											onClick={(e) => e.stopPropagation()}
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
										display: "flex",
										flexDirection: "column",
										gap: 1,
									}}
								>
									{ingredients.map((ingredient) => {
										const isSelected = selectedIngredientIds.includes(
											ingredient.id,
										);
										// このグループのどの名前が選択されているか（親 or 詳細）
										const selectedNames = selectedIngredientNames.filter(
											(n) =>
												n === ingredient.name ||
												ingredient.actualNames?.includes(n),
										);
										// グループ全体としての選択制限（何も選択されていない場合、制限数に達していたら選択不可）
										const isLimitReached =
											!isSelected && currentTotalCount >= 5;

										const hasDetails =
											ingredient.actualNames &&
											ingredient.actualNames.length > 0;
										const isExpanded = expandedIngredients[ingredient.id];

										// 詳細チップのための制限判定ロジック
										const details = ingredient.actualNames || [];
										const selectedDetails = selectedNames.filter((n) =>
											details.includes(n),
										);
										const isGroupSelected = selectedNames.includes(
											ingredient.name,
										);
										// 詳細を追加できるか：
										// 1. 全体制限未満である
										// 2. または、このグループの詳細がまだ選択されておらず、かつグループ名が選択されている（=置換なので増えない）
										const canAddDetail =
											currentTotalCount < 5 ||
											(selectedDetails.length === 0 && isGroupSelected);

										return (
											<Box
												key={ingredient.id}
												sx={{
													display: "flex",
													flexDirection: "column",
													width: "100%",
													borderBottom: "1px solid",
													borderColor: "divider",
													pb: 1,
													"&:last-child": { borderBottom: "none" },
												}}
											>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														width: "100%",
													}}
												>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															flexGrow: 1,
															cursor:
																disabled || isLimitReached
																	? "default"
																	: "pointer",
														}}
														onClick={() => {
															if (!disabled && !isLimitReached) {
																// グループ名でのトグル
																handleToggle(ingredient);
															} else if (isSelected && !disabled) {
																// 選択解除は可能
																handleToggle(ingredient);
															}
														}}
													>
														<Checkbox
															checked={isSelected}
															disabled={disabled || isLimitReached}
															slotProps={{
																input: {
																	"aria-label": ingredient.name,
																},
															}}
														/>
														<Box>
															<Typography
																sx={{
																	fontSize: "1rem",
																	fontWeight: isSelected ? "bold" : "normal",
																}}
															>
																{ingredient.name}
															</Typography>
															{/* 選択中の詳細名があれば表示 */}
															{isSelected &&
																selectedNames.length > 0 &&
																selectedNames.some(
																	(n) => n !== ingredient.name,
																) && (
																	<Typography
																		variant="caption"
																		color="primary"
																		sx={{ display: "block" }}
																	>
																		使用:{" "}
																		{selectedNames
																			.filter((n) => n !== ingredient.name)
																			.join("、")}
																	</Typography>
																)}
														</Box>
													</Box>

													{hasDetails && (
														<IconButton
															size="small"
															onClick={() => handleExpandClick(ingredient.id)}
															sx={{
																transform: isExpanded
																	? "rotate(180deg)"
																	: "rotate(0deg)",
																transition: "transform 0.2s",
															}}
														>
															<ExpandMoreIcon />
														</IconButton>
													)}
												</Box>

												{/* 詳細材料のチップ表示 */}
												<Collapse in={isExpanded} timeout="auto" unmountOnExit>
													<Box sx={{ pl: 5, pr: 1, pb: 1 }}>
														<Box
															sx={{
																display: "flex",
																flexWrap: "wrap",
																gap: 1,
															}}
														>
															{ingredient.actualNames?.map((detailName) => {
																const isDetailSelected =
																	selectedNames.includes(detailName);

																const isChipDisabled =
																	disabled ||
																	(!isDetailSelected && !canAddDetail);

																return (
																	<Chip
																		key={detailName}
																		label={detailName}
																		size="small"
																		variant={
																			isDetailSelected ? "filled" : "outlined"
																		}
																		color={
																			isDetailSelected ? "primary" : "default"
																		}
																		onClick={() =>
																			handleToggle(ingredient, detailName)
																		}
																		disabled={isChipDisabled}
																		sx={{
																			cursor: "pointer",
																			"&:hover": {
																				backgroundColor: isDetailSelected
																					? "primary.dark"
																					: "action.hover",
																			},
																		}}
																	/>
																);
															})}
														</Box>
													</Box>
												</Collapse>
											</Box>
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
