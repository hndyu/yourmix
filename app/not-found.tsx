import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import Link from "next/link";
import * as React from "react";

export const metadata: Metadata = {
	title: {
		absolute: "ページが見つかりません | YourMix",
	},
	description:
		"お探しのページは見つかりませんでした。URLが正しいかご確認ください。",
};

export default function NotFound() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "80vh",
				textAlign: "center",
				p: 3,
			}}
		>
			<Typography variant="h4" component="h1" gutterBottom>
				404 - ページが見つかりません
			</Typography>
			<Typography variant="body1" sx={{ mb: 3 }}>
				お探しのページは移動または削除された可能性があります。
			</Typography>
			<Button component={Link} href="/" variant="contained">
				トップページに戻る
			</Button>
		</Box>
	);
}
