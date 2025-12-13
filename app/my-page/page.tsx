"use client";

import authClient from "@/app/lib/authClient";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Typography,
} from "@mui/material";
import { redirect, useRouter } from "next/navigation";

interface ErrorResponse {
	error?: string;
}

export default function MyPage() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	const handleDeleteAccount = async () => {
		const confirmation = window.confirm(
			"本当にアカウントを削除しますか？この操作は元に戻せません。",
		);
		if (confirmation) {
			try {
				const res = await fetch("/api/user", {
					method: "DELETE",
				});
				if (res.ok) {
					// Also sign out on the client
					await authClient.signOut();
					alert("アカウントが削除されました。");
					router.push("/");
					router.refresh(); // To ensure session is cleared
				} else {
					const data: ErrorResponse = await res.json();
					alert(`エラー: ${data.error || "アカウントの削除に失敗しました。"}`);
				}
			} catch (error) {
				console.error("Account deletion failed:", error);
				alert("アカウントの削除中にエラーが発生しました。");
			}
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
		</main>
	);
}
