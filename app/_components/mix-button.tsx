"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import * as React from "react";

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
	position: "relative",
	overflow: "hidden",

	"&:hover": {
		background: "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
		transform: "scale(1.05)",
		boxShadow: "0 6px 10px 4px rgba(255, 105, 135, .4)",
	},

	"&:active": {
		transform: "scale(0.95)",
	},

	"&:disabled": {
		background: "linear-gradient(45deg, #ccc 30%, #999 90%)",
		transform: "none",
		boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .2)",
		cursor: "not-allowed",
	},

	// ローディング中の背景アニメーション
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: "-100%",
		width: "100%",
		height: "100%",
		background:
			"linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
		transition: "left 0.5s",
	},

	"&.loading::before": {
		left: "100%",
	},
}));

interface MixButtonProps {
	onClick: () => void;
	disabled?: boolean;
	isLoading?: boolean;
}

export default function MixButton({
	onClick,
	disabled = false,
	isLoading = false,
}: MixButtonProps) {
	// ボタンの状態を管理
	const isButtonDisabled = disabled || isLoading;

	// クリックハンドラー（二重クリック防止）
	const handleClick = React.useCallback(() => {
		if (!isButtonDisabled) {
			onClick();
		}
	}, [onClick, isButtonDisabled]);

	return (
		<StyledMixButton
			onClick={handleClick}
			variant="contained"
			size="large"
			disabled={isButtonDisabled}
			className={isLoading ? "loading" : ""}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				{isLoading ? (
					<>
						<CircularProgress size={20} sx={{ color: "white" }} />
						<span>Mixing...</span>
					</>
				) : (
					<>
						<span>🍹 Mix!</span>
					</>
				)}
			</Box>
		</StyledMixButton>
	);
}
