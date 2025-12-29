"use client";

import { Button } from "@/app/_components/ui/button";
import authClient from "@/app/lib/authClient";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorResponse {
	error?: string;
}

export default function MyPage() {
	const { data: session, isPending, refetch } = authClient.useSession();
	const router = useRouter();

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [resultDialogOpen, setResultDialogOpen] = useState(false);
	const [resultDialogMessage, setResultDialogMessage] = useState("");

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [isSaving, setIsSaving] = useState(false);

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
		} else if (
			resultDialogMessage === "プロフィールが更新されました。" ||
			resultDialogMessage.includes("確認メール")
		) {
			router.refresh(); // Refresh to show new name or state
		}
	};

	const handleEditProfile = () => {
		if (session?.user) {
			setNewName(session.user.name || "");
			setNewEmail(session.user.email || "");
			setEditDialogOpen(true);
		}
	};

	const executeUpdateProfile = async () => {
		if (!newName.trim() || !newEmail.trim()) return;
		setIsSaving(true);
		try {
			const res = await fetch("/api/user", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: newName, email: newEmail }),
			});

			if (res.ok) {
				await refetch();
				setEditDialogOpen(false);
				setResultDialogMessage("プロフィールが更新されました。");
				setResultDialogOpen(true);
			} else {
				const data: ErrorResponse = await res.json();
				setResultDialogMessage(
					`エラー: ${data.error || "プロフィールの更新に失敗しました。"}`,
				);
				setResultDialogOpen(true);
			}
		} catch (error) {
			console.error("Profile update failed:", error);
			setResultDialogMessage("プロフィールの更新中にエラーが発生しました。");
			setResultDialogOpen(true);
		} finally {
			setIsSaving(false);
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
				<div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
					<div>
						<h2 className="text-xl font-bold mb-1 text-stone-900 dark:text-white">
							マイページ
						</h2>
						<p className="text-sm text-stone-600 dark:text-stone-400">
							アカウント情報を確認・編集できます。
						</p>
					</div>
					<Button variant="outline" onClick={handleEditProfile}>
						編集
					</Button>
				</div>
				<div className="p-6 space-y-6">
					<div>
						<h3 className="font-bold mb-1 text-stone-900 dark:text-white">
							お名前
						</h3>
						<p className="text-stone-700 dark:text-stone-300">
							{session.user.name}
						</p>
					</div>
					<div>
						<h3 className="font-bold mb-1 text-stone-900 dark:text-white">
							メールアドレス
						</h3>
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
						<p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
							この操作は元に戻せません。すべてのお客様の情報が完全に削除されます。
						</p>
					</div>
				</div>
			</div>

			{/* Account Deletion Confirm Dialog */}
			{confirmDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
							アカウントの削除
						</h3>
						<p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
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

			{/* Edit Profile Dialog */}
			{editDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
							プロフィールの編集
						</h3>
						<div className="space-y-4 mb-6">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									お名前
								</label>
								<input
									type="text"
									id="name"
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="お名前"
								/>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									メールアドレス
								</label>
								<input
									type="email"
									id="email"
									value={newEmail}
									onChange={(e) => setNewEmail(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="メールアドレス"
								/>
							</div>
						</div>
						<div className="flex justify-end gap-3">
							<Button
								variant="ghost"
								onClick={() => setEditDialogOpen(false)}
								disabled={isSaving}
							>
								キャンセル
							</Button>
							<Button
								className="bg-amber-600 hover:bg-amber-700 text-white"
								onClick={executeUpdateProfile}
								disabled={isSaving || !newName.trim() || !newEmail.trim()}
							>
								{isSaving ? "保存中..." : "保存する"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Result Dialog */}
			{resultDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
							処理結果
						</h3>
						<p className="text-stone-600 dark:text-stone-400 mb-6 text-sm whitespace-pre-wrap">
							{resultDialogMessage}
						</p>
						<div className="flex justify-end gap-3">
							<Button onClick={handleResultDialogClose}>閉じる</Button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
