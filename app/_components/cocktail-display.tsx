"use client";

import {
	ContentCopy as CopyIcon,
	LocalOffer as LocalOfferIcon,
	Share as ShareIcon,
	ShoppingCart as ShoppingCartIcon,
	Twitter as TwitterIcon,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Fade,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
	Snackbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import type { Cocktail } from "../types/cocktail";
import {
	extractIngredientKeyword,
	getAffiliateLink,
} from "../utils/affiliate-links";
import { canUseWebShare, shareCocktail } from "../utils/share-utils";

// カスタムスタイルのカード
const StyledCocktailCard = styled(Card)(({ theme }) => ({
	borderRadius: "20px",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
	marginBottom: theme.spacing(3),
}));

interface CocktailDisplayProps {
	cocktail: Cocktail;
	onRemove?: () => void;
	show?: boolean;
	isDetailPage?: boolean;
}

export default function CocktailDisplay({
	cocktail,
	onRemove,
	show = true,
	isDetailPage = false,
}: CocktailDisplayProps) {
	const [isWebShareSupported, setIsWebShareSupported] = React.useState(false);
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);

	React.useEffect(() => {
		// クライアントサイドでnavigator.shareの存在を確認
		setIsWebShareSupported(canUseWebShare());
	}, []);

	// 共有ボタンのクリックハンドラー
	const handleShare = async () => {
		const success = await shareCocktail(cocktail);
		// Web Share APIがサポートされておらず、コピーが成功した場合にスナックバーを表示
		if (success && !isWebShareSupported) {
			setSnackbarOpen(true);
		}
	};
	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	return (
		<>
			{/* カクテルカードをFadeでアニメーション */}
			<Fade in={show} timeout={1200} easing="ease-out">
				<StyledCocktailCard
					sx={{
						transform: show ? "translateY(0)" : "translateY(20px)",
						opacity: show ? 1 : 0,
						transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
					}}
				>
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
									variant={isDetailPage ? "h3" : "h4"}
									component={isDetailPage ? "h1" : "h2"}
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
									<Tooltip
										title={isWebShareSupported ? "共有" : "レシピをコピー"}
									>
										<IconButton
											onClick={handleShare}
											sx={{
												backgroundColor: isWebShareSupported
													? "#1976d2"
													: "#4caf50",
												color: "white",
												"&:hover": {
													backgroundColor: isWebShareSupported
														? "#1565c0"
														: "#388e3c",
												},
											}}
										>
											{isWebShareSupported ? <ShareIcon /> : <CopyIcon />}
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
								{cocktail.tags?.map((tag) => (
									<Chip
										key={tag}
										icon={<LocalOfferIcon />}
										label={tag}
										size="small"
										sx={{
											backgroundColor: "#e0e0e0",
											color: "#333",
											fontWeight: "medium",
										}}
									/>
								))}
							</Box>
						</Box>

						{/* 材料と作り方を横並びで表示 */}
						<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
							{/* 材料 */}
							<Box sx={{ flex: 1, minWidth: 300 }}>
								<Typography
									component={isDetailPage ? "h2" : "h3"}
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
										{cocktail.ingredients.map((ingredient) =>
											(() => {
												const keyword = extractIngredientKeyword(
													ingredient.name,
												);
												const link = getAffiliateLink(keyword);
												return (
													<ListItem key={ingredient.name} sx={{ py: 0.5 }}>
														<Box
															sx={{
																display: "flex",
																justifyContent: "space-between",
																alignItems: "center",
																width: "100%",
															}}
														>
															<ListItemText
																primary={ingredient.name}
																secondary={ingredient.amount}
																sx={{
																	"& .MuiListItemText-primary": {
																		fontSize: "0.95rem",
																	},
																}}
															/>
															{link && (
																<Chip
																	component="a"
																	href={link}
																	target="_blank"
																	rel="noopener noreferrer"
																	icon={<ShoppingCartIcon />}
																	label="材料を買う"
																	clickable
																	sx={{
																		backgroundColor: "#ff6b35",
																		color: "white",
																		fontSize: "0.75rem",
																		height: "24px",
																		textDecoration: "none",
																		"&:hover": {
																			backgroundColor: "#e55a2b",
																		},
																	}}
																	size="small"
																/>
															)}
														</Box>
													</ListItem>
												);
											})(),
										)}
									</List>
								</Paper>
							</Box>

							{/* 作り方 */}
							<Box sx={{ flex: 1, minWidth: 300 }}>
								<Typography
									component={isDetailPage ? "h2" : "h3"}
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
									component={isDetailPage ? "h2" : "h3"}
									variant="h6"
									sx={{
										fontWeight: "bold",
										color: "#34495e",
										mb: 1,
									}}
								>
									🌿 飾り
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{cocktail.garnish}
								</Typography>
							</Box>
						)}

						{/* 削除ボタン（オプション） */}
						{onRemove && (
							<Box sx={{ textAlign: "center", mt: 3 }}>
								<Button // このボタンはオリジナルカクテルでのみ表示される想定
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
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity="success"
					sx={{ width: "100%" }}
				>
					レシピをクリップボードにコピーしました！
				</Alert>
			</Snackbar>
		</>
	);
}
