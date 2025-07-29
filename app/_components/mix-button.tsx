"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// カスタムスタイルのボタン
const StyledMixButton = styled(Button)(({ theme }) => ({
	// グラデーション背景
	background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
	borderRadius: "50px",
	border: 0,
	color: "white",
	height: "80px",
	width: "200px",
	padding: "0 30px",
	boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
	fontSize: "1.2rem",
	fontWeight: "bold",
	textTransform: "none",
	transition: "all 0.3s ease-in-out",

	"&:hover": {
		background: "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
		transform: "scale(1.05)",
		boxShadow: "0 6px 10px 4px rgba(255, 105, 135, .4)",
	},

	"&:active": {
		transform: "scale(0.95)",
	},
}));

// アニメーション用のコンテナ
const AnimatedContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "300px",
	padding: theme.spacing(4),

	// パルスアニメーション
	"@keyframes pulse": {
		"0%": {
			transform: "scale(1)",
		},
		"50%": {
			transform: "scale(1.02)",
		},
		"100%": {
			transform: "scale(1)",
		},
	},

	"&:hover": {
		animation: "pulse 2s infinite",
	},
}));

export default function MixButton() {
	// モックアップ用のクリックハンドラー
	const handleMixClick = () => {
		console.log("Mixボタンがクリックされました！");
		// ここに実際のレシピ検索・生成ロジックが入ります
		alert("レシピ検索・生成機能は現在開発中です！");
	};

	return (
		<AnimatedContainer>
			{/* 説明テキスト */}
			<Typography
				variant="h5"
				component="h2"
				gutterBottom
				sx={{
					textAlign: "center",
					color: "text.secondary",
					mb: 3,
					fontWeight: "medium",
				}}
			>
				あなただけのカクテルを作ってみよう
			</Typography>

			{/* Mixボタン */}
			<StyledMixButton
				onClick={handleMixClick}
				variant="contained"
				size="large"
			>
				🍹 Mix!
			</StyledMixButton>

			{/* サブテキスト */}
			<Typography
				variant="body2"
				sx={{
					mt: 2,
					textAlign: "center",
					color: "text.secondary",
					opacity: 0.8,
				}}
			>
				お好みの材料からレシピを生成します
			</Typography>
		</AnimatedContainer>
	);
}
