"use client";

import { Button } from "@/app/_components/ui/button";
import { Toast, type ToastSeverity } from "@/app/_components/ui/toast";
import authClient from "@/app/lib/authClient";
import { redirect, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface ErrorResponse {
	error?: string;
}

interface Account {
	providerId: string;
}

type ResultDialogAction = "none" | "signOut" | "refresh";

export default function MyPage() {
	const { data: session, isPending, refetch } = authClient.useSession();
	const router = useRouter();

	const [accounts, setAccounts] = useState<Account[]>([]);
	const [isAccountsLoading, setIsAccountsLoading] = useState(true);

	useEffect(() => {
		async function fetchAccounts() {
			try {
				// Call the API method directly
				const res = await authClient.listAccounts();
				if (res && "data" in res && res.data) {
					setAccounts(res.data as Account[]);
				}
			} catch (e) {
				console.error("Failed to fetch accounts:", e);
			} finally {
				setIsAccountsLoading(false);
			}
		}
		if (session?.user) {
			fetchAccounts();
		}
	}, [session?.user]);

	// Check if the user has a credential (password) account linked
	const showSecurity =
		!isAccountsLoading &&
		accounts.some((acc) => acc.providerId === "credential");

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [resultDialogOpen, setResultDialogOpen] = useState(false);
	const [resultDialogMessage, setResultDialogMessage] = useState("");
	const [resultDialogAction, setResultDialogAction] =
		useState<ResultDialogAction>("none");

	const showResult = (message: string, action: ResultDialogAction = "none") => {
		setResultDialogMessage(message);
		setResultDialogAction(action);
		setResultDialogOpen(true);
	};

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// 2FA states
	const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false);
	const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
	const [passwordAction, setPasswordAction] = useState<
		"enable" | "disable" | null
	>(null);
	const [password, setPassword] = useState("");
	const [totpUri, setTotpUri] = useState("");
	const [backupCodes, setBackupCodes] = useState<string[]>([]);
	const [twoFactorCode, setTwoFactorCode] = useState("");
	const [isEnablingTwoFactor, setIsEnablingTwoFactor] = useState(false);
	const [twoFactorError, setTwoFactorError] = useState("");
	const [showBackupCodes, setShowBackupCodes] = useState(false);

	// Passkey states
	const [passkeys, setPasskeys] = useState<
		{
			id: string;
			name?: string | null;
			createdAt?: Date | null;
		}[]
	>([]);
	const [isPasskeysLoading, setIsPasskeysLoading] = useState(true);
	const [isAddingPasskey, setIsAddingPasskey] = useState(false);
	const [passkeyName, setPasskeyName] = useState("");
	const [isPasskeyDialogOpen, setIsPasskeyDialogOpen] = useState(false);

	const [toastState, setToastState] = useState<{
		open: boolean;
		message: string;
		severity: ToastSeverity;
	}>({
		open: false,
		message: "",
		severity: "info",
	});

	// Password update states
	const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
		useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
	const [passwordUpdateError, setPasswordUpdateError] = useState("");

	useEffect(() => {
		async function fetchPasskeys() {
			try {
				const res = await authClient.passkey.listUserPasskeys();
				if (res.data) {
					setPasskeys(res.data);
				}
			} catch (e) {
				console.error("Failed to fetch passkeys:", e);
			} finally {
				setIsPasskeysLoading(false);
			}
		}
		if (session?.user) {
			fetchPasskeys();
		}
	}, [session?.user]);

	const handleAddPasskey = async () => {
		if (!passkeyName) return;
		setIsAddingPasskey(true);
		try {
			const res = await authClient.passkey.addPasskey({
				name: passkeyName,
			});
			if (res?.error) {
				showResult(
					`エラー: ${res.error.message || "パスキーの追加に失敗しました。"}`,
				);
			} else {
				setPasskeyName("");
				setIsPasskeyDialogOpen(false);
				showResult("パスキーが正常に追加されました。", "refresh");
				const listRes = await authClient.passkey.listUserPasskeys();
				if (listRes.data) {
					setPasskeys(listRes.data);
				}
			}
		} catch (e) {
			console.error("Failed to add passkey:", e);
			showResult("パスキーの追加中にエラーが発生しました。");
		} finally {
			setIsAddingPasskey(false);
		}
	};

	const handleDeletePasskey = async (id: string) => {
		if (!confirm("本当にこのパスキーを削除しますか？")) return;
		try {
			const res = await authClient.passkey.deletePasskey({
				id,
			});
			if (res?.error) {
				showResult(
					`エラー: ${res.error.message || "パスキーの削除に失敗しました。"}`,
				);
			} else {
				showResult("パスキーが削除されました。");
				setPasskeys((prev) => prev.filter((pk) => pk.id !== id));
			}
		} catch (e) {
			console.error("Failed to delete passkey:", e);
			showResult("パスキーの削除中にエラーが発生しました。");
		}
	};

	const handleDeleteAccount = () => {
		setConfirmDialogOpen(true);
	};

	const handleUpdatePassword = async () => {
		if (newPassword !== confirmNewPassword) {
			setPasswordUpdateError("新しいパスワードが一致しません。");
			return;
		}
		if (newPassword.length < 8) {
			setPasswordUpdateError(
				"新しいパスワードは8文字以上である必要があります。",
			);
			return;
		}

		setIsUpdatingPassword(true);
		setPasswordUpdateError("");

		const { error } = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true,
		});

		if (error) {
			setPasswordUpdateError(
				error.message || "パスワードの更新に失敗しました。",
			);
			setIsUpdatingPassword(false);
			return;
		}

		setIsChangePasswordDialogOpen(false);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmNewPassword("");
		setIsUpdatingPassword(false);
		showResult("パスワードが正常に更新されました。");
	};

	const executeDelete = async () => {
		setConfirmDialogOpen(false);
		try {
			const res = await fetch("/api/user", {
				method: "DELETE",
			});
			if (res.ok) {
				// Also sign out on the client
				showResult("アカウントが削除されました。", "signOut");
			} else {
				const data: ErrorResponse = await res.json();
				showResult(
					`エラー: ${data.error || "アカウントの削除に失敗しました。"}`,
				);
			}
		} catch (error) {
			console.error("Account deletion failed:", error);
			showResult("アカウントの削除中にエラーが発生しました。");
		}
	};

	const handleResultDialogClose = async () => {
		setResultDialogOpen(false);
		setShowBackupCodes(false);
		if (resultDialogAction === "signOut") {
			await authClient.signOut();
			router.push("/");
			router.refresh(); // To ensure session is cleared
		} else if (resultDialogAction === "refresh") {
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
				showResult("プロフィールが更新されました。", "refresh");
			} else {
				const data: ErrorResponse = await res.json();
				showResult(
					`エラー: ${data.error || "プロフィールの更新に失敗しました。"}`,
				);
			}
		} catch (error) {
			console.error("Profile update failed:", error);
			showResult("プロフィールの更新中にエラーが発生しました。");
		} finally {
			setIsSaving(false);
		}
	};

	const handlePasswordSubmit = async () => {
		if (!password) return;
		setTwoFactorError("");
		setIsEnablingTwoFactor(true);

		if (passwordAction === "enable") {
			const { data, error } = await authClient.twoFactor.enable({
				password: password,
			});
			if (error) {
				setTwoFactorError(error.message || "2要素認証の有効化に失敗しました。");
				setIsEnablingTwoFactor(false);
				return;
			}
			if (data?.totpURI) {
				setTotpUri(data.totpURI);
				setBackupCodes(data.backupCodes);
				setIsPasswordDialogOpen(false);
				setIsTwoFactorDialogOpen(true);
			}
		} else if (passwordAction === "disable") {
			const { error } = await authClient.twoFactor.disable({
				password: password,
			});
			if (error) {
				setTwoFactorError(error.message || "2要素認証の無効化に失敗しました。");
				setIsEnablingTwoFactor(false);
				return;
			}
			await refetch();
			setIsPasswordDialogOpen(false);
			setPassword("");
			showResult("2要素認証を無効にしました。");
		}
		setIsEnablingTwoFactor(false);
	};

	const handleEnableTwoFactor = () => {
		setPasswordAction("enable");
		setIsPasswordDialogOpen(true);
		setPassword("");
		setTwoFactorError("");
	};

	const verifyAndEnableTwoFactor = async () => {
		if (!twoFactorCode) return;
		setIsEnablingTwoFactor(true);
		setTwoFactorError("");

		const { error } = await authClient.twoFactor.verifyTotp({
			code: twoFactorCode,
		});

		if (error) {
			setTwoFactorError(error.message || "コードの検証に失敗しました。");
			setIsEnablingTwoFactor(false);
			return;
		}

		await refetch();
		setIsTwoFactorDialogOpen(false);
		setTotpUri("");
		setTwoFactorCode("");
		setIsEnablingTwoFactor(false);
		setShowBackupCodes(true);
		showResult("2要素認証が有効になりました。");
	};

	const handleDisableTwoFactor = () => {
		setPasswordAction("disable");
		setIsPasswordDialogOpen(true);
		setPassword("");
		setTwoFactorError("");
	};

	const handleCopyBackupCodes = async () => {
		try {
			await navigator.clipboard.writeText(backupCodes.join("\n"));
			setToastState({
				open: true,
				message: "クリップボードにコピーしました",
				severity: "success",
			});
		} catch (err) {
			console.error("Failed to copy:", err);
			setToastState({
				open: true,
				message: "コピーに失敗しました",
				severity: "error",
			});
		}
	};

	const handleDownloadBackupCodes = () => {
		const element = document.createElement("a");
		const file = new Blob([backupCodes.join("\n")], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = "backup-codes.txt";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	useEffect(() => {
		if (!isPending && !session?.user) {
			router.push("/auth/sign-in?callbackUrl=/my-page");
		}
	}, [session, isPending, router]);

	if (isPending || !session?.user) {
		return (
			<main className="container mx-auto my-8 max-w-lg px-4">
				<p>読み込み中...</p>
			</main>
		);
	}

	return (
		<main className="container mx-auto my-8 max-w-lg px-4 pb-12">
			<div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden mb-8">
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

			{showSecurity && (
				<div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
					<div className="p-6 border-b border-stone-200 dark:border-stone-800">
						<h2 className="text-xl font-bold mb-1 text-stone-900 dark:text-white">
							セキュリティ
						</h2>
						<p className="text-sm text-stone-600 dark:text-stone-400">
							アカウントのセキュリティ設定を管理します。
						</p>
					</div>
					<div className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-bold text-stone-900 dark:text-white">
									2要素認証 (TOTP)
								</h3>
								<p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
									{session.user.twoFactorEnabled
										? "2要素認証は有効です。"
										: "認証アプリを使用して、セキュリティを強化します。"}
								</p>
							</div>
							{session.user.twoFactorEnabled ? (
								<Button
									variant="outline"
									className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
									onClick={handleDisableTwoFactor}
								>
									無効にする
								</Button>
							) : (
								<Button
									className="bg-amber-600 hover:bg-amber-700 text-white"
									onClick={handleEnableTwoFactor}
								>
									有効にする
								</Button>
							)}
						</div>

						<div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
							<div className="flex items-center justify-between mb-4">
								<div>
									<h3 className="font-bold text-stone-900 dark:text-white">
										パスキー (Passkeys)
									</h3>
									<p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
										指紋認証や顔認証などを使用して、パスワードなしで安全にログインできます。
									</p>
								</div>
								<Button
									variant="outline"
									onClick={() => setIsPasskeyDialogOpen(true)}
								>
									パスキーを追加
								</Button>
							</div>

							{isPasskeysLoading ? (
								<p className="text-sm text-stone-500">読み込み中...</p>
							) : passkeys.length > 0 ? (
								<div className="space-y-3">
									{passkeys.map((pk) => (
										<div
											key={pk.id}
											className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800"
										>
											<div className="flex items-center gap-3">
												<div className="bg-stone-200 dark:bg-stone-700 p-2 rounded-full">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-stone-600 dark:text-stone-300"
														role="img"
													>
														<title>パスキー</title>
														<circle cx="12" cy="12" r="10" />
														<path d="m9 12 2 2 4-4" />
													</svg>
												</div>
												<div>
													<p className="font-medium text-sm text-stone-900 dark:text-white">
														{pk.name || "名称未設定のパスキー"}
													</p>
													<p className="text-xs text-stone-500 dark:text-stone-400">
														作成日:{" "}
														{pk.createdAt
															? new Date(pk.createdAt).toLocaleDateString()
															: "不明"}
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
												onClick={() => handleDeletePasskey(pk.id)}
											>
												削除
											</Button>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-stone-500 dark:text-stone-400 italic">
									登録されているパスキーはありません。
								</p>
							)}
						</div>

						<div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-bold text-stone-900 dark:text-white">
										パスワード
									</h3>
									<p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
										アカウントのパスワードを更新します。
									</p>
								</div>
								<Button
									variant="outline"
									onClick={() => {
										setIsChangePasswordDialogOpen(true);
										setPasswordUpdateError("");
										setCurrentPassword("");
										setNewPassword("");
										setConfirmNewPassword("");
									}}
								>
									パスワードを変更
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Passkey Add Dialog */}
			{isPasskeyDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
							パスキーの追加
						</h3>
						<p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
							このパスキーを識別するための名前を入力してください（例: MacBook
							Pro, iPhoneなど）。
						</p>

						<div className="space-y-4 mb-6">
							<div>
								<label
									htmlFor="passkey-name"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									パスキー名
								</label>
								<input
									type="text"
									id="passkey-name"
									value={passkeyName}
									onChange={(e) => setPasskeyName(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="デバイス名など"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3">
							<Button
								variant="ghost"
								onClick={() => {
									setIsPasskeyDialogOpen(false);
									setPasskeyName("");
								}}
								disabled={isAddingPasskey}
							>
								キャンセル
							</Button>
							<Button
								className="bg-amber-600 hover:bg-amber-700 text-white"
								onClick={handleAddPasskey}
								disabled={isAddingPasskey || !passkeyName.trim()}
							>
								{isAddingPasskey ? "追加中..." : "追加する"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Change Password Dialog */}
			{isChangePasswordDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
							パスワードの変更
						</h3>
						<p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
							現在のパスワードと新しいパスワードを入力してください。
						</p>

						{passwordUpdateError && (
							<p className="text-red-600 text-xs mb-4">{passwordUpdateError}</p>
						)}

						<div className="space-y-4 mb-6">
							<div>
								<label
									htmlFor="current-password"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									現在のパスワード
								</label>
								<input
									type="password"
									id="current-password"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="現在のパスワード"
								/>
							</div>
							<div>
								<label
									htmlFor="new-password"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									新しいパスワード
								</label>
								<input
									type="password"
									id="new-password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="新しいパスワード（8文字以上）"
								/>
							</div>
							<div>
								<label
									htmlFor="confirm-new-password"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									新しいパスワード（確認）
								</label>
								<input
									type="password"
									id="confirm-new-password"
									value={confirmNewPassword}
									onChange={(e) => setConfirmNewPassword(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="新しいパスワード（確認）"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3">
							<Button
								variant="ghost"
								onClick={() => {
									setIsChangePasswordDialogOpen(false);
									setCurrentPassword("");
									setNewPassword("");
									setConfirmNewPassword("");
								}}
								disabled={isUpdatingPassword}
							>
								キャンセル
							</Button>
							<Button
								className="bg-amber-600 hover:bg-amber-700 text-white"
								onClick={handleUpdatePassword}
								disabled={
									isUpdatingPassword ||
									!currentPassword ||
									!newPassword ||
									!confirmNewPassword
								}
							>
								{isUpdatingPassword ? "更新中..." : "更新する"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Password Dialog for 2FA */}
			{isPasswordDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
							パスワードの確認
						</h3>
						<p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
							セキュリティのため、パスワードを入力してください。
						</p>

						{twoFactorError && (
							<p className="text-red-600 text-xs mb-4">{twoFactorError}</p>
						)}

						<div className="space-y-4 mb-6">
							<div>
								<label
									htmlFor="confirm-password"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									パスワード
								</label>
								<input
									type="password"
									id="confirm-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="パスワード"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3">
							<Button
								variant="ghost"
								onClick={() => {
									setIsPasswordDialogOpen(false);
									setPassword("");
									setTwoFactorError("");
								}}
								disabled={isEnablingTwoFactor}
							>
								キャンセル
							</Button>
							<Button
								className="bg-amber-600 hover:bg-amber-700 text-white"
								onClick={handlePasswordSubmit}
								disabled={isEnablingTwoFactor || !password}
							>
								{isEnablingTwoFactor ? "処理中..." : "確認"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* 2FA Setup Dialog */}
			{isTwoFactorDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
							2要素認証の設定
						</h3>
						<p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
							認証アプリ（Google Authenticator,
							Authy等）でQRコードをスキャンし、表示されたコードを入力してください。
						</p>

						<div className="flex justify-center mb-6 p-4 bg-white rounded-lg">
							<QRCodeSVG value={totpUri} size={180} />
						</div>

						{twoFactorError && (
							<p className="text-red-600 text-xs mb-4">{twoFactorError}</p>
						)}

						<div className="space-y-4 mb-6">
							<div>
								<label
									htmlFor="2fa-code"
									className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
								>
									認証コード
								</label>
								<input
									type="text"
									id="2fa-code"
									value={twoFactorCode}
									onChange={(e) => setTwoFactorCode(e.target.value)}
									className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-[0.5em] text-xl font-mono"
									placeholder="000000"
									maxLength={6}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3">
							<Button
								variant="ghost"
								onClick={() => {
									setIsTwoFactorDialogOpen(false);
									setTotpUri("");
									setTwoFactorCode("");
								}}
								disabled={isEnablingTwoFactor}
							>
								キャンセル
							</Button>
							<Button
								className="bg-amber-600 hover:bg-amber-700 text-white"
								onClick={verifyAndEnableTwoFactor}
								disabled={isEnablingTwoFactor || twoFactorCode.length !== 6}
							>
								{isEnablingTwoFactor ? "検証中..." : "有効にする"}
							</Button>
						</div>
					</div>
				</div>
			)}

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
							{showBackupCodes ? "バックアップコードの保存" : "処理結果"}
						</h3>
						{showBackupCodes ? (
							<>
								<p className="text-stone-600 dark:text-stone-400 mb-4 text-sm">
									2要素認証が有効になりました。
									<br />
									<br />
									バックアップコードを保存してください。これらはアカウントにアクセスできなくなった際の唯一の復旧手段です：
								</p>
								<div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg mb-4 font-mono text-sm text-center">
									{backupCodes.map((code) => (
										<div key={code} className="py-1">
											{code}
										</div>
									))}
								</div>
								<div className="flex gap-2 mb-6">
									<Button
										variant="outline"
										className="flex-1"
										onClick={handleCopyBackupCodes}
									>
										クリップボードにコピー
									</Button>
									<Button
										variant="outline"
										className="flex-1"
										onClick={handleDownloadBackupCodes}
									>
										テキストとして保存
									</Button>
								</div>
							</>
						) : (
							<p className="text-stone-600 dark:text-stone-400 mb-6 text-sm whitespace-pre-wrap">
								{resultDialogMessage}
							</p>
						)}

						<div className="flex justify-end gap-3">
							<Button onClick={handleResultDialogClose}>閉じる</Button>
						</div>
					</div>
				</div>
			)}

			<Toast
				open={toastState.open}
				message={toastState.message}
				severity={toastState.severity}
				onClose={() => setToastState((prev) => ({ ...prev, open: false }))}
			/>
		</main>
	);
}
