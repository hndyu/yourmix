import { Suspense } from "react";
import SignUpForm from "./_components/sign-up-form";
import { Box, CircularProgress } from "@mui/material";

export default function SignUpPage() {
	return (
		<Suspense
			fallback={
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<CircularProgress />
				</Box>
			}
		>
			<SignUpForm />
		</Suspense>
	);
}
