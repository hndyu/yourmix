// app/_components/cocktail-display-skeleton.tsx
"use client";

import {
	Box,
	Card,
	CardContent,
	Chip,
	Grid,
	Skeleton,
	Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// CocktailDisplayからスタイル付きカードをインポートするか、同様のスタイルを定義
const StyledCocktailCard = styled(Card)(({ theme }) => ({
	borderRadius: "20px",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
	background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	overflow: "hidden",
	marginBottom: theme.spacing(3),
}));

export default function CocktailDisplaySkeleton() {
	return (
		<StyledCocktailCard>
			<CardContent sx={{ p: 4 }}>
				{/* ヘッダー部分のスケルトン */}
				<Box sx={{ mb: 3 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							mb: 2,
						}}
					>
						<Typography variant="h4" component="h2" sx={{ flex: 1 }}>
							<Skeleton width="70%" />
						</Typography>
						<Box sx={{ display: "flex", gap: 1, ml: 2 }}>
							<Skeleton variant="circular" width={40} height={40} />
							<Skeleton variant="circular" width={40} height={40} />
							<Skeleton variant="circular" width={40} height={40} />
						</Box>
					</Box>
					<Typography variant="body1" sx={{ fontStyle: "italic" }}>
						<Skeleton />
					</Typography>
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
						<Skeleton variant="rounded" width={90} height={24} />
						<Skeleton variant="rounded" width={110} height={24} />
						<Skeleton variant="rounded" width={80} height={24} />
					</Box>
				</Box>

				{/* 材料と作り方のスケルトン */}
				<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
					{/* 材料のスケルトン */}
					<Box sx={{ flex: 1, minWidth: 300 }}>
						<Typography variant="h6" sx={{ mb: 2 }}>
							<Skeleton width="40%" />
						</Typography>
						<Box sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 1 }}>
							{[...Array(3)].map((_, index) => (
								<Box
									key={index}
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										py: 1,
									}}
								>
									<Skeleton variant="text" width="60%" />
									<Skeleton variant="text" width="20%" />
								</Box>
							))}
						</Box>
					</Box>

					{/* 作り方のスケルトン */}
					<Box sx={{ flex: 1, minWidth: 300 }}>
						<Typography variant="h6" sx={{ mb: 2 }}>
							<Skeleton width="40%" />
						</Typography>
						<Box sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 1 }}>
							{[...Array(4)].map((_, index) => (
								<Box key={index} sx={{ display: "flex", alignItems: "flex-start", py: 0.5 }}>
									<Skeleton variant="text" width="100%" />
								</Box>
							))}
						</Box>
					</Box>
				</Box>

				{/* ガーニッシュのスケルトン */}
				<Box sx={{ mt: 3 }}>
					<Typography variant="h6">
						<Skeleton width="30%" />
					</Typography>
					<Typography variant="body2">
						<Skeleton />
					</Typography>
				</Box>
			</CardContent>
		</StyledCocktailCard>
	);
}