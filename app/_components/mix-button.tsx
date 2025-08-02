"use client";

import * as React from "react";
import Button from "@mui/material/Button";
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

interface MixButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

export default function MixButton({
	onClick,
	disabled = false,
}: MixButtonProps) {
	return (
		<StyledMixButton
			onClick={onClick}
			variant="contained"
			size="large"
			disabled={disabled}
		>
			🍹 Mix!
		</StyledMixButton>
	);
}
