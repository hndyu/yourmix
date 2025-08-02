"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MixButton from "./mix-button";

interface MixSectionProps {
	onMixClick: () => void;
	disabled?: boolean;
}

export default function MixSection({
	onMixClick,
	disabled = false,
}: MixSectionProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
			}}
		>
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
			<MixButton onClick={onMixClick} disabled={disabled} />

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
		</Box>
	);
}
