"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

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
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: 2,
			}}
		>
			<Typography variant="body2" color="text.secondary">
				&copy; 2025 YourMix
			</Typography>
			<Link component={NextLink} href="/terms-of-service" variant="body2">
				利用規約
			</Link>
			<Link component={NextLink} href="/privacy-policy" variant="body2">
				プライバシーポリシー
			</Link>
		</Box>
	);
}
