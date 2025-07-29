"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// フッターコンポーネント
export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				py: 2,
				px: 2,
				mt: "auto",
				textAlign: "center",
				backgroundColor: "#f5f5f5",
				borderTop: "1px solid #e0e0e0",
			}}
		>
			<Typography variant="body2" color="text.secondary">
				&copy; 2025 YourMix
			</Typography>
		</Box>
	);
}
