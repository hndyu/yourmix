"use client";

import authClient from "@/app/lib/authClient";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SocialLogin from "../../../_components/social-login";
import { Button } from "../../../_components/ui/button";

export default function SignInForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const [lastMethod, setLastMethod] = useState<string | null>(null);

	// 2FA states
	const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
	const [twoFactorCode, setTwoFactorCode] = useState("");
	const [isTrustedDevice, setIsTrustedDevice] = useState(false);
	const [isBackupCodeMode, setIsBackupCodeMode] = useState(false);
	const [backupCode, setBackupCode] = useState("");

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const method = authClient.getLastUsedLoginMethod();
		if (method) {
			setLastMethod(method);
		}
	}, []);

	let callbackUrl = searchParams.get("callbackUrl") || "/";
	if (callbackUrl === "%2Fauth%2Fsign-up") {
		callbackUrl = "/";
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!captchaToken) {
			setError("CAPTCHAの認証が必要です");
			return;
		}

		setIsLoading(true);

		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				headers: {
					"x-captcha-response": captchaToken,
				},
				onSuccess: (ctx) => {
					if (ctx.data.twoFactorRedirect) {
						setIsTwoFactorRequired(true);
						setError(null);
						setIsLoading(false);
					} else {
						router.push(callbackUrl);
					}
				},
				onError: (ctx) => {
					if (
						ctx.error.status === 403 &&
						ctx.error.code === "TWO_FACTOR_REQUIRED"
					) {
						setIsTwoFactorRequired(true);
						setError(null);
					} else {
						setError(ctx.error.message);
					}
					setIsLoading(false);
				},
			},
		);
	};

	const handleTwoFactorSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		if (isBackupCodeMode) {
			await authClient.twoFactor.verifyBackupCode(
				{
					code: backupCode,
				},
				{
					onSuccess: () => {
						router.push(callbackUrl);
					},
					onError: (ctx) => {
						setError(ctx.error.message);
						setIsLoading(false);
					},
				},
			);
		} else {
			await authClient.twoFactor.verifyTotp(
				{
					code: twoFactorCode,
					trustDevice: isTrustedDevice,
				},
				{
					onSuccess: () => {
						router.push(callbackUrl);
					},
					onError: (ctx) => {
						setError(ctx.error.message);
						setIsLoading(false);
					},
				},
			);
		}
	};

	if (isTwoFactorRequired) {
		return (
			<div className="max-w-md mx-auto w-full px-4 py-12">
				<div className="bg-white/40 dark:bg-stone-900/40 border border-stone-300 dark:border-stone-800 rounded-2xl p-8 backdrop-blur shadow-2xl">
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
							2要素認証
						</h1>
						<p className="text-sm text-stone-600 dark:text-stone-500 mt-2">
							{isBackupCodeMode
								? "保存したバックアップコードを入力してください。"
								: "認証アプリに表示されている6桁のコードを入力してください。"}
						</p>
					</div>

					{error && (
						<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-200 text-sm p-3 rounded-lg mb-6">
							{error}
						</div>
					)}

					<form onSubmit={handleTwoFactorSubmit} className="space-y-6">
						{isBackupCodeMode ? (
							<div>
								<label
									htmlFor="backup-code"
									className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1"
								>
									バックアップコード
								</label>
								<input
									id="backup-code"
									type="text"
									required
									className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-lg px-4 py-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest text-xl font-mono uppercase"
									placeholder="XXXXXXXX"
									value={backupCode}
									onChange={(e) => setBackupCode(e.target.value)}
								/>
							</div>
						) : (
							<>
								<div>
									<label
										htmlFor="2fa-code"
										className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1"
									>
										認証コード
									</label>
									<input
										id="2fa-code"
										type="text"
										required
										className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-lg px-4 py-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-[0.5em] text-2xl font-mono"
										placeholder="000000"
										maxLength={6}
										value={twoFactorCode}
										onChange={(e) => setTwoFactorCode(e.target.value)}
									/>
								</div>

								<div className="flex items-center gap-2">
									<input
										id="trust-device"
										type="checkbox"
										className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
										checked={isTrustedDevice}
										onChange={(e) => setIsTrustedDevice(e.target.checked)}
									/>
									<label
										htmlFor="trust-device"
										className="text-sm text-stone-600 dark:text-stone-400"
									>
										このデバイスを信頼する
									</label>
								</div>
							</>
						)}

						<Button
							type="submit"
							className="w-full"
							isLoading={isLoading}
							disabled={
								isBackupCodeMode ? !backupCode : twoFactorCode.length !== 6
							}
						>
							認証してログイン
						</Button>

						<div className="flex flex-col gap-3">
							<button
								type="button"
								onClick={() => {
									setIsBackupCodeMode(!isBackupCodeMode);
									setError(null);
								}}
								className="w-full text-sm text-blue-600 dark:text-primary hover:underline transition-colors"
							>
								{isBackupCodeMode
									? "認証コード（TOTP）を使用する"
									: "バックアップコードを使用する"}
							</button>
							<button
								type="button"
								onClick={() => {
									setIsTwoFactorRequired(false);
									setIsBackupCodeMode(false);
								}}
								className="w-full text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
							>
								ログイン画面に戻る
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto w-full px-4 py-12">
			<div className="bg-white/40 dark:bg-stone-900/40 border border-stone-300 dark:border-stone-800 rounded-2xl p-8 backdrop-blur shadow-2xl">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
						ログイン
					</h1>
					<p className="text-sm text-stone-600 dark:text-stone-500 mt-2">
						YourMixのアカウントにログイン
					</p>
					{lastMethod === "email" && (
						<div className="mt-2 inline-block bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
							前回のログイン: メールアドレス
						</div>
					)}
				</div>

				{error && (
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-200 text-sm p-3 rounded-lg mb-6">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1"
						>
							メールアドレス
						</label>
						<input
							id="email"
							type="email"
							required
							className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-lg px-4 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							placeholder="example@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							data-testid="email-input"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1"
						>
							パスワード
						</label>
						<input
							id="password"
							type="password"
							required
							className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-lg px-4 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							data-testid="password-input"
						/>
					</div>

					<div className="flex justify-center py-2">
						<Turnstile
							siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
							onSuccess={(token) => setCaptchaToken(token)}
							onError={() => setCaptchaToken(null)}
							onExpire={() => setCaptchaToken(null)}
						/>
					</div>

					<Button
						type="submit"
						className="w-full"
						isLoading={isLoading}
						data-testid="sign-in-button"
					>
						ログイン
					</Button>
				</form>

				<div className="mt-6">
					<SocialLogin />
				</div>

				<div className="mt-6 text-center text-sm">
					<Link
						href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
						className="text-blue-600 dark:text-primary hover:text-blue-800 dark:hover:text-amber-400 transition-colors hover:underline"
					>
						アカウントをお持ちでない方: 登録
					</Link>
				</div>
			</div>
		</div>
	);
}
