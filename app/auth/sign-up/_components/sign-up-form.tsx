"use client";

import authClient from "@/app/lib/authClient";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../_components/ui/button";

export default function SignUpForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [termsAgreed, setTermsAgreed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showTermsError, setShowTermsError] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	let callbackUrl = searchParams.get("callbackUrl") || "/";
	if (callbackUrl === "%2Fauth%2Fsign-in") {
		callbackUrl = "/";
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!termsAgreed) {
			setShowTermsError(true);
			return;
		}

		setIsLoading(true);

		await authClient.signUp.email(
			{
				email,
				password,
				name,
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
	};

	return (
		<div className="max-w-md mx-auto w-full px-4 py-12">
			<div className="bg-white/40 dark:bg-stone-900/40 border border-stone-300 dark:border-stone-800 rounded-2xl p-8 backdrop-blur shadow-2xl">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
						アカウント登録
					</h1>
					<p className="text-sm text-stone-600 dark:text-stone-500 mt-2">
						新しいアカウントを作成します
					</p>
				</div>

				{error && (
					<div className="bg-red-900/20 border border-red-900/50 text-red-200 text-sm p-3 rounded-lg mb-6">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1"
						>
							名前
						</label>
						<input
							id="name"
							type="text"
							required
							className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-lg px-4 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							value={name}
							onChange={(e) => setName(e.target.value)}
							data-testid="name-input"
						/>
					</div>

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

					{/* Terms Agreement */}
					<div className="flex items-start gap-3 pt-2">
						<div className="flex h-5 items-center">
							<input
								id="terms"
								type="checkbox"
								className="h-4 w-4 rounded border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-primary focus:ring-primary checked:bg-primary"
								checked={termsAgreed}
								onChange={(e) => {
									setTermsAgreed(e.target.checked);
									if (e.target.checked) setShowTermsError(false);
								}}
								data-testid="terms-agreement-checkbox"
							/>
						</div>
						<div className="text-sm">
							<label
								htmlFor="terms"
								className="font-medium text-stone-600 dark:text-stone-400"
							>
								<Link
									href="/terms-of-service"
									className="text-primary hover:underline"
								>
									利用規約
								</Link>
								に同意する
							</label>
						</div>
					</div>
					{showTermsError && (
						<p className="text-xs text-red-400">
							登録には利用規約への同意が必要です
						</p>
					)}

					<Button
						type="submit"
						className="w-full"
						isLoading={isLoading}
						data-testid="sign-up-button"
					>
						アカウント登録
					</Button>
				</form>

				<div className="mt-6 text-center text-sm">
					<Link
						href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
						className="text-primary hover:text-amber-400 transition-colors hover:underline"
					>
						すでにアカウントをお持ちの方: ログイン
					</Link>
				</div>
			</div>
		</div>
	);
}
