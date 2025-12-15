"use client";

import authClient from "@/app/lib/authClient";
import {
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
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
	const [termsAgreed, setTermsAgreed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
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

		if (!termsAgreed) {
			setOpenDialog(true);
			return;
		}

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

	const handleCloseDialog = () => {
		setOpenDialog(false);
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
							<FormControlLabel
								control={
									<Checkbox
										value="agree"
										color="primary"
										checked={termsAgreed}
										onChange={(e) => setTermsAgreed(e.target.checked)}
										data-testid="terms-agreement-checkbox"
									/>
								}
								label={
									<Typography variant="body2">
										<Link href="/terms-of-service" passHref>
											<Typography
												component="span"
												sx={{
													color: "primary.main",
													textDecoration: "none",
													"&:hover": { textDecoration: "underline" },
												}}
											>
												利用規約
											</Typography>
										</Link>
										に同意する
									</Typography>
								}
								sx={{ mt: 1, mb: 2 }}
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
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"利用規約への同意が必要です"}
				</DialogTitle>
				<DialogContent>
					<Typography id="alert-dialog-description">
						アカウント登録には、利用規約への同意が必要です。
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} autoFocus>
						閉じる
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}
