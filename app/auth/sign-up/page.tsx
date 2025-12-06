"use client";

import { signUp } from "@/lib/auth-client";
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

export default function SignUpPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		await signUp.email(
			{
				email,
				password,
				name,
			},
			{
				onSuccess: () => {
					router.push("/auth/sign-in");
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
								アカウント登録
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
								id="name"
								label="名前"
								name="name"
								autoComplete="name"
								autoFocus
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="メールアドレス"
								name="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="パスワード"
								type="password"
								id="password"
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								アカウント登録
							</Button>
							<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
								<Link href="/auth/sign-in" passHref legacyBehavior>
									<MuiLink variant="body2" underline="hover">
										すでにアカウントをお持ちの方: ログイン
									</MuiLink>
								</Link>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
}
