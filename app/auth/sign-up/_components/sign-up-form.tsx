"use client";

import authClient from "@/app/lib/authClient";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	TextField,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignUpForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	// 登録前のページURLを取得（なければホームページに遷移）
	let callbackUrl = searchParams.get("callbackUrl") || "/";
	// callbackUrlが/auth/sign-upの場合はホームページに遷移
	if (callbackUrl === "%2Fauth%2Fsign-in") {
		callbackUrl = "/";
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		await authClient.signUp.email(
			{
				email,
				password,
				name,
			},
			{
				onSuccess: () => {
					// 登録成功後、元のページに遷移
					router.push(callbackUrl);
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
								slotProps={{
									htmlInput: {
										"data-testid": "name-input",
									},
								}}
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
								slotProps={{
									htmlInput: {
										"data-testid": "email-input",
									},
								}}
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
								slotProps={{
									htmlInput: {
										"data-testid": "password-input",
									},
								}}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								data-testid="sign-up-button"
							>
								アカウント登録
							</Button>
							<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
								<Link
									href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
								>
									<Typography
										variant="body2"
										sx={{
											color: "primary.main",
											textDecoration: "none",
											"&:hover": { textDecoration: "underline" },
										}}
									>
										すでにアカウントをお持ちの方: ログイン
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
