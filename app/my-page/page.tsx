"use client";

import { Button } from "@/app/_components/ui/button";
import authClient from "@/app/lib/authClient";
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
			<main className="container mx-auto my-8 max-w-lg px-4">
				<p>読み込み中...</p>
			</main>
		);
	}

	if (!session?.user) {
		redirect("/auth/sign-in?callbackUrl=/my-page");
	}

	return (
		<main className="container mx-auto my-8 max-w-lg px-4">
			<div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
				<div className="p-6 border-b border-stone-200 dark:border-stone-800">
					<h2 className="text-xl font-bold mb-1">マイページ</h2>
					<p className="text-sm text-stone-500">
						アカウント情報を確認・編集できます。
					</p>
				</div>
				<div className="p-6 space-y-6">
					<div>
						<h3 className="font-bold mb-1">お名前</h3>
						<p className="text-stone-700 dark:text-stone-300">
							{session.user.name}
						</p>
					</div>
					<div>
						<h3 className="font-bold mb-1">メールアドレス</h3>
						<p className="text-stone-700 dark:text-stone-300">
							{session.user.email}
						</p>
					</div>
					<div className="pt-4 border-t border-stone-200 dark:border-stone-800">
						<Button
							className="bg-red-600 hover:bg-red-700 text-white shadow-red-900/20"
							onClick={handleDeleteAccount}
						>
							アカウントを削除
						</Button>
						<p className="text-xs text-stone-500 mt-2">
							この操作は元に戻せません。すべてのお客様の情報が完全に削除されます。
						</p>
					</div>
				</div>
			</div>

			{/* Account Deletion Confirm Dialog */}
			{confirmDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-white mb-2">
							アカウントの削除
						</h3>
						<p className="text-stone-400 mb-6 text-sm">
							本当にアカウントを削除しますか？この操作は元に戻せません。
						</p>
						<div className="flex justify-end gap-3">
							<Button
								variant="ghost"
								onClick={() => setConfirmDialogOpen(false)}
							>
								キャンセル
							</Button>
							<Button
								className="bg-red-600 hover:bg-red-700 text-white"
								onClick={executeDelete}
							>
								削除する
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Result Dialog */}
			{resultDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-white mb-2">処理結果</h3>
						<p className="text-stone-400 mb-6 text-sm">{resultDialogMessage}</p>
						<div className="flex justify-end gap-3">
							<Button onClick={handleResultDialogClose}>閉じる</Button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
