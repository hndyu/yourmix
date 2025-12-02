"use client";
import { Fade, Paper, Typography } from "@mui/material";

interface NoResultsProps {
	show: boolean;
}

export function NoResults({ show }: NoResultsProps) {
	return (
		<Fade in={show} timeout={800} easing="ease-out">
			<Paper
				elevation={1}
				sx={{
					p: 4,
					textAlign: "center",
					backgroundColor: "#fafafa",
					borderRadius: "15px",
					transform: show ? "translateY(0)" : "translateY(20px)",
					opacity: show ? 1 : 0,
					transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
				}}
			>
				<Typography
					component="h2"
					variant="h6"
					color="text.secondary"
					gutterBottom
				>
					🔍 検索結果
				</Typography>
				<Typography variant="body1" color="text.secondary">
					選択された材料にマッチするレシピが見つかりませんでした。
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					他の材料を選択してみてください。
				</Typography>
			</Paper>
		</Fade>
	);
}
