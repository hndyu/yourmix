"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	Link as MuiLink,
} from "@mui/material";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		await signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: () => {
					router.push("/");
				},
				onError: (ctx) => {
					setError(ctx.error.message);
				},
			},
		);
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Card sx={{ width: "100%", p: 2 }}>
					<CardContent>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								mb: 3,
							}}
						>
							<Typography component="h1" variant="h5">
								ログイン
							</Typography>
						</Box>
						{error && (
							<Typography color="error" variant="body2" sx={{ mb: 2 }}>
								{error}
							</Typography>
						)}
						<Box component="form" onSubmit={handleSubmit} noValidate>
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="メールアドレス"
								name="email"
								autoComplete="email"
								autoFocus
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								inputProps={{ "data-testid": "email-input" }}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="パスワード"
								type="password"
								id="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								inputProps={{ "data-testid": "password-input" }}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								data-testid="sign-in-button"
							>
								ログイン
							</Button>
							<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
								<Link href="/auth/sign-up">
									<Typography
										variant="body2"
										sx={{
											color: "primary.main",
											textDecoration: "none",
											"&:hover": { textDecoration: "underline" },
										}}
									>
										アカウントをお持ちでない方: 登録
									</Typography>
								</Link>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
}
