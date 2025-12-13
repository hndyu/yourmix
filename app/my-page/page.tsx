"use client";

import authClient from "@/app/lib/authClient";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from "@mui/material";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorResponse {
	error?: string;
}

export default function MyPage() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [resultDialogOpen, setResultDialogOpen] = useState(false);
	const [resultDialogMessage, setResultDialogMessage] = useState("");

	const handleDeleteAccount = () => {
		setConfirmDialogOpen(true);
	};

	const executeDelete = async () => {
		setConfirmDialogOpen(false);
		try {
			const res = await fetch("/api/user", {
				method: "DELETE",
			});
			if (res.ok) {
				// Also sign out on the client
				setResultDialogMessage("アカウントが削除されました。");
				setResultDialogOpen(true);
			} else {
				const data: ErrorResponse = await res.json();
				setResultDialogMessage(
					`エラー: ${data.error || "アカウントの削除に失敗しました。"}`,
				);
				setResultDialogOpen(true);
			}
		} catch (error) {
			console.error("Account deletion failed:", error);
			setResultDialogMessage("アカウントの削除中にエラーが発生しました。");
			setResultDialogOpen(true);
		}
	};

	const handleResultDialogClose = async () => {
		setResultDialogOpen(false);
		if (resultDialogMessage === "アカウントが削除されました。") {
			await authClient.signOut();
			router.push("/");
			router.refresh(); // To ensure session is cleared
		}
	};
	if (isPending) {
		return (
			<main className="container mx-auto my-8 max-w-lg">
				<p>読み込み中...</p>
			</main>
		);
	}

	if (!session?.user) {
		redirect("/auth/sign-in?callbackUrl=/my-page");
	}

	return (
		<main className="container mx-auto my-8 max-w-lg">
			<Card>
				<CardHeader>
					<Typography variant="h5" component="div">
						マイページ
					</Typography>
					<Typography variant="body2" color="text.secondary">
						アカウント情報を確認・編集できます。
					</Typography>
				</CardHeader>
				<CardContent sx={{ "& > :not(style)": { mt: 2 } }}>
					<div>
						<Typography variant="subtitle1" component="h3" fontWeight="bold">
							お名前
						</Typography>
						<Typography>{session.user.name}</Typography>
					</div>
					<div>
						<Typography variant="subtitle1" component="h3" fontWeight="bold">
							メールアドレス
						</Typography>
						<Typography>{session.user.email}</Typography>
					</div>
					<div className="pt-4">
						<Button
							variant="contained"
							color="error"
							onClick={handleDeleteAccount}
						>
							アカウントを削除
						</Button>
						<Typography variant="caption" display="block" mt={1}>
							この操作は元に戻せません。すべてのお客様の情報が完全に削除されます。
						</Typography>
					</div>
				</CardContent>
			</Card>

			{/* Account Deletion Confirm Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
				aria-labelledby="confirm-delete-dialog-title"
				aria-describedby="confirm-delete-dialog-description"
			>
				<DialogTitle id="confirm-delete-dialog-title">
					アカウントの削除
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirm-delete-dialog-description">
						本当にアカウントを削除しますか？この操作は元に戻せません。
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialogOpen(false)}>
						キャンセル
					</Button>
					<Button onClick={executeDelete} color="error">
						削除する
					</Button>
				</DialogActions>
			</Dialog>

			{/* Result Dialog */}
			<Dialog
				open={resultDialogOpen}
				onClose={handleResultDialogClose}
				aria-labelledby="result-dialog-title"
			>
				<DialogTitle id="result-dialog-title">処理結果</DialogTitle>
				<DialogContent>
					<DialogContentText>{resultDialogMessage}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleResultDialogClose} autoFocus>
						閉じる
					</Button>
				</DialogActions>
			</Dialog>
		</main>
	);
}
