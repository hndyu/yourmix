"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Autocomplete,
	Box,
	Checkbox,
	Chip,
	Collapse,
	FormGroup,
	IconButton,
	InputAdornment,
	Snackbar,
	Stack,
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

	// Snackbarの状態管理
	const [snackbar, setSnackbar] = React.useState<{
		open: boolean;
		message: string;
		severity: "success" | "warning" | "info" | "error";
	}>({
		open: false,
		message: "",
		severity: "info",
	});

	const handleCloseSnackbar = (
		event?: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbar((prev) => ({ ...prev, open: false }));
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

		// ソート順：カテゴリオブジェクトのsortOrder -> 材料のsortOrder -> 詳細材料の並び順
		return options.sort((a, b) => {
			const catA = categories.find((c) => c.name === a.ingredient.categoryName);
			const catB = categories.find((c) => c.name === b.ingredient.categoryName);

			const orderA = catA?.sortOrder ?? Number.POSITIVE_INFINITY;
			const orderB = catB?.sortOrder ?? Number.POSITIVE_INFINITY;

			if (orderA !== orderB) {
				return orderA - orderB;
			}

			const sortOrderA = a.ingredient.sortOrder ?? Number.POSITIVE_INFINITY;
			const sortOrderB = b.ingredient.sortOrder ?? Number.POSITIVE_INFINITY;

			if (sortOrderA !== sortOrderB) {
				return sortOrderA - sortOrderB;
			}

			// 同じグループ内の詳細材料の並び順は、actualNamesのインデックスに従う
			const indexA = a.ingredient.actualNames?.indexOf(a.label) ?? -1;
			const indexB = b.ingredient.actualNames?.indexOf(b.label) ?? -1;
			return indexA - indexB;
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
		// 選択された材料グループを特定
		const selectedGroups = new Set<number>();
		for (const name of selectedIngredientNames) {
			const ing = ingredients.find(
				(i) => i.name === name || i.actualNames?.includes(name),
			);
			if (ing) {
				selectedGroups.add(ing.id);
			}
		}

		for (const groupId of selectedGroups) {
			const ingredient = ingredients.find((ing) => ing.id === groupId);
			if (!ingredient) continue;

			// このグループに関連する全ての名前（親＋子）
			const groupRelatedNames = [
				ingredient.name,
				...(ingredient.actualNames || []),
			];
			// 現在選択されている、このグループに関連する名前のリスト
			const currentSelectedGroupNames = selectedIngredientNames.filter((n) =>
				groupRelatedNames.includes(n),
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
	}, [selectedIngredientNames, ingredients]);

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

		// ケース1: 親グループのチェックボックスをクリックした場合 (specificName が undefined)
		if (!specificName) {
			// 既にこのグループの何かが選択されている場合 -> 全解除
			if (currentSelectedGroupNames.length > 0) {
				const groupIds = ingredient.actualIds || [ingredient.id];
				const newIds = selectedIngredientIds.filter(
					(id) => !groupIds.includes(id),
				);
				const newNames = selectedIngredientNames.filter(
					(n) => !groupRelatedNames.includes(n),
				);
				onIngredientsChange(newIds, newNames);
				setSnackbar({
					open: true,
					message: `${ingredient.name}を削除しました`,
					severity: "info",
				});
				return;
			}
			// 何も選択されていない場合 -> 親を選択
			// 制限チェック
			if (currentTotalCount >= 5) {
				setSnackbar({
					open: true,
					message: "材料は5つまでです",
					severity: "warning",
				});
				return;
			}

			// グループ内のすべてのIDを追加
			const newIds = Array.from(
				new Set([
					...selectedIngredientIds,
					...(ingredient.actualIds || [ingredient.id]),
				]),
			);
			onIngredientsChange(newIds, [
				...selectedIngredientNames,
				ingredient.name,
			]);
			setSnackbar({
				open: true,
				message: `${ingredient.name}を追加しました`,
				severity: "success",
			});
			return;
		}

		// ケース2: 詳細チップ（または検索からの詳細指定）をクリックした場合
		const isTargetNameSelected = selectedIngredientNames.includes(targetName);
		const targetId =
			ingredient.actualDetails?.find((d) => d.name === targetName)?.id ||
			ingredient.id;

		if (isTargetNameSelected) {
			// 選択解除
			const newNames = selectedIngredientNames.filter((n) => n !== targetName);
			const newIds = selectedIngredientIds.filter((id) => id !== targetId);

			onIngredientsChange(newIds, newNames);
			setSnackbar({
				open: true,
				message: `${targetName}を削除しました`,
				severity: "info",
			});
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
				setSnackbar({
					open: true,
					message: "材料は5つまでです",
					severity: "warning",
				});
				return;
			}

			// 親の名前が含まれていたら削除しつつ、新しい詳細を追加
			const isGroupSelected = currentSelectedGroupNames.includes(
				ingredient.name,
			);
			let newNames = selectedIngredientNames;
			let newIds = selectedIngredientIds;

			if (isGroupSelected) {
				// 親を解除
				newNames = newNames.filter((n) => n !== ingredient.name);
				const groupIds = ingredient.actualIds || [ingredient.id];
				newIds = newIds.filter((id) => !groupIds.includes(id));
			}

			newNames = [...newNames, targetName];
			newIds = Array.from(new Set([...newIds, targetId]));

			onIngredientsChange(newIds, newNames);
			setSnackbar({
				open: true,
				message: `${targetName}を追加しました`,
				severity: "success",
			});
		}
	};

	// チップ削除のハンドラ
	const handleDeleteChip = (name: string) => {
		const ingredient = ingredients.find(
			(ing) => ing.name === name || ing.actualNames?.includes(name),
		);
		if (ingredient) {
			if (name === ingredient.name) {
				handleToggle(ingredient, undefined); // グループ全体の解除
			} else {
				handleToggle(ingredient, name); // 詳細の解除
			}
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

				{/* 選択された材料のチップ表示 */}
				<Box sx={{ minHeight: 32, mt: 1 }}>
					{selectedIngredientNames.length > 0 ? (
						<Stack direction="row" flexWrap="wrap" gap={1}>
							{selectedIngredientNames.map((name) => (
								<Chip
									key={name}
									label={name}
									onDelete={() => handleDeleteChip(name)}
									color="primary"
									variant="filled"
									size="medium"
								/>
							))}
						</Stack>
					) : (
						<Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
							選択された材料がここに表示されます
						</Typography>
					)}
				</Box>
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

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}
