"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function CustomError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// エラーをロギングサービスに記録します
		console.error(error);
	}, [error]);

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
				予期せぬエラーが発生しました
			</Typography>
			<Typography variant="body1" sx={{ mb: 3 }}>
				ご迷惑をおかけしております。時間をおいて再度お試しください。
			</Typography>
			<Button variant="contained" onClick={() => reset()}>
				再試行
			</Button>
		</Box>
	);
}
