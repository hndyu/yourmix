"use client";

import * as React from "react";
import {
	Card,
	CardContent,
	Typography,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Divider,
	Button,
	Fade,
	Paper,
	IconButton,
	Tooltip,
	Snackbar,
	Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	Share as ShareIcon,
	Twitter as TwitterIcon,
	ContentCopy as CopyIcon,
} from "@mui/icons-material";
import type { Cocktail } from "../types/cocktail";
import {
	shareViaWebShare,
	shareViaTwitter,
	copyToClipboard,
} from "../utils/share-utils";

// カスタムスタイルのカード
const StyledCocktailCard = styled(Card)(({ theme }) => ({
	borderRadius: "20px",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
	marginBottom: theme.spacing(3),
}));

// 難易度に応じた色を取得
const getDifficultyColor = (difficulty: string) => {
	switch (difficulty) {
		case "easy":
			return "#4caf50";
		case "medium":
			return "#ff9800";
		case "hard":
			return "#f44336";
		default:
			return "#757575";
	}
};

interface CocktailDisplayProps {
	cocktail: Cocktail;
	onRemove?: () => void;
}

export default function CocktailDisplay({
	cocktail,
	onRemove,
}: CocktailDisplayProps) {
	// 共有成功時の通知状態
	const [shareSuccess, setShareSuccess] = React.useState(false);
	const [shareMessage, setShareMessage] = React.useState("");

	// 共有ボタンのクリックハンドラー
	const handleShare = async () => {
		await shareViaWebShare(cocktail);
	};

	// X共有ボタンのクリックハンドラー
	const handleTwitterShare = () => {
		shareViaTwitter(cocktail);
	};

	// クリップボードコピーのクリックハンドラー
	const handleCopyToClipboard = async () => {
		const success = await copyToClipboard(cocktail);
		if (success) {
			setShareMessage("レシピをクリップボードにコピーしました！");
			setShareSuccess(true);
		} else {
			setShareMessage("コピーに失敗しました。手動でコピーしてください。");
			setShareSuccess(true);
		}
	};

	// 通知を閉じる
	const handleCloseNotification = () => {
		setShareSuccess(false);
	};

	return (
		<>
			{/* カクテルカードをFadeでアニメーション */}
			<Fade in={true} timeout={800}>
				<StyledCocktailCard>
					<CardContent sx={{ p: 4 }}>
						{/* ヘッダー部分 */}
						<Box sx={{ mb: 3 }}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									mb: 2,
								}}
							>
								<Typography
									variant="h4"
									component="h2"
									sx={{
										fontWeight: "bold",
										color: "#2c3e50",
										flex: 1,
									}}
								>
									🍹 {cocktail.name}
								</Typography>

								{/* 共有ボタン群 */}
								<Box sx={{ display: "flex", gap: 1, ml: 2 }}>
									<Tooltip title="共有">
										<IconButton
											onClick={handleShare}
											sx={{
												backgroundColor: "#1976d2",
												color: "white",
												"&:hover": {
													backgroundColor: "#1565c0",
												},
											}}
										>
											<ShareIcon />
										</IconButton>
									</Tooltip>

									<Tooltip title="Xで共有">
										<IconButton
											onClick={handleTwitterShare}
											sx={{
												backgroundColor: "#1da1f2",
												color: "white",
												"&:hover": {
													backgroundColor: "#0d8bd9",
												},
											}}
										>
											<TwitterIcon />
										</IconButton>
									</Tooltip>

									<Tooltip title="クリップボードにコピー">
										<IconButton
											onClick={handleCopyToClipboard}
											sx={{
												backgroundColor: "#4caf50",
												color: "white",
												"&:hover": {
													backgroundColor: "#45a049",
												},
											}}
										>
											<CopyIcon />
										</IconButton>
									</Tooltip>
								</Box>
							</Box>

							<Typography
								variant="body1"
								sx={{
									color: "text.secondary",
									mb: 2,
									fontStyle: "italic",
								}}
							>
								{cocktail.description}
							</Typography>

							{/* メタ情報 */}
							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
								<Chip
									label={`難易度: ${cocktail.difficulty === "easy" ? "簡単" : cocktail.difficulty === "medium" ? "普通" : "難しい"}`}
									sx={{
										backgroundColor: getDifficultyColor(cocktail.difficulty),
										color: "white",
										fontWeight: "bold",
									}}
								/>
								<Chip
									label={`準備時間: ${cocktail.prepTime}`}
									variant="outlined"
								/>
								<Chip
									label={`グラス: ${cocktail.glassType}`}
									variant="outlined"
								/>
							</Box>
						</Box>

						{/* 材料と作り方を横並びで表示 */}
						<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
							{/* 材料 */}
							<Box sx={{ flex: 1, minWidth: 300 }}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: "bold",
										color: "#34495e",
										mb: 2,
									}}
								>
									📋 材料
								</Typography>
								<Paper elevation={1} sx={{ p: 2, backgroundColor: "#fafafa" }}>
									<List dense>
										{cocktail.ingredients.map((ingredient, index) => (
											<ListItem key={ingredient} sx={{ py: 0.5 }}>
												<ListItemText
													primary={ingredient}
													sx={{
														"& .MuiListItemText-primary": {
															fontSize: "0.95rem",
														},
													}}
												/>
											</ListItem>
										))}
									</List>
								</Paper>
							</Box>

							{/* 作り方 */}
							<Box sx={{ flex: 1, minWidth: 300 }}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: "bold",
										color: "#34495e",
										mb: 2,
									}}
								>
									👨‍🍳 作り方
								</Typography>
								<Paper elevation={1} sx={{ p: 2, backgroundColor: "#fafafa" }}>
									<List>
										{cocktail.instructions.map((instruction, index) => (
											<ListItem key={instruction} sx={{ py: 1 }}>
												<ListItemText
													primary={`${index + 1}. ${instruction}`}
													sx={{
														"& .MuiListItemText-primary": {
															fontSize: "0.95rem",
															lineHeight: 1.6,
														},
													}}
												/>
											</ListItem>
										))}
									</List>
								</Paper>
							</Box>
						</Box>

						{/* ガーニッシュ */}
						{cocktail.garnish && (
							<Box sx={{ mt: 3 }}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: "bold",
										color: "#34495e",
										mb: 1,
									}}
								>
									🌿 ガーニッシュ
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{cocktail.garnish}
								</Typography>
							</Box>
						)}

						{/* 削除ボタン（オプション） */}
						{onRemove && (
							<Box sx={{ textAlign: "center", mt: 3 }}>
								<Button
									variant="outlined"
									color="error"
									onClick={onRemove}
									sx={{
										borderRadius: "25px",
										px: 3,
										py: 1,
									}}
								>
									このレシピを削除
								</Button>
							</Box>
						)}
					</CardContent>
				</StyledCocktailCard>
			</Fade>

			{/* 共有成功時の通知 */}
			<Snackbar
				open={shareSuccess}
				autoHideDuration={3000}
				onClose={handleCloseNotification}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={handleCloseNotification}
					severity="success"
					sx={{ width: "100%" }}
				>
					{shareMessage}
				</Alert>
			</Snackbar>
		</>
	);
}
