import { Suspense } from "react";
import SignInForm from "./_components/sign-in-form";
import { Box, CircularProgress } from "@mui/material";

export default function SignInPage() {
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
			<SignInForm />
		</Suspense>
	);
}
