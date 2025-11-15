// app/_components/ingredient-selector-skeleton.tsx
"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Skeleton,
	Typography,
} from "@mui/material";

export default function IngredientSelectorSkeleton() {
	return (
		<Box component="section" sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
			{/* タイトル */}
			<Typography
				variant="h6"
				component="h3"
				gutterBottom
				sx={{
					textAlign: "center",
					color: "text.primary",
					mb: 2,
					fontWeight: "medium",
				}}
			>
				材料を選択してください
			</Typography>

			{/* 材料カテゴリのスケルトン */}
			{Array.from(new Array(5)).map((_, index) => (
				<Accordion key={`skeleton-accordion-${index}`} disabled defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								width: "100%",
							}}
						>
							<Skeleton variant="circular" width={24} height={24} />
							<Skeleton variant="text" width="10%" />
							<Skeleton variant="circular" width={24} height={24} />
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
								gap: 2,
							}}
						>
							{Array.from(new Array(4)).map((_, itemIndex) => (
								<Box
									key={`skeleton-item-${index}-${itemIndex}`}
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<Skeleton variant="rectangular" width={24} height={24} />
									<Skeleton variant="text" width="30%" height={24} />
								</Box>
							))}
						</Box>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
}
