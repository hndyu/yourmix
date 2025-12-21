"use client";

import authClient from "@/app/lib/authClient";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../_components/ui/button";

export default function SignInForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	let callbackUrl = searchParams.get("callbackUrl") || "/";
	if (callbackUrl === "%2Fauth%2Fsign-up") {
		callbackUrl = "/";
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: () => {
					router.push(callbackUrl);
					// No need to set loading false as we redirect
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
			<div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-8 backdrop-blur shadow-2xl">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-stone-100">ログイン</h1>
					<p className="text-sm text-stone-500 mt-2">
						YourMixのアカウントにログイン
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
							htmlFor="email"
							className="block text-sm font-medium text-stone-400 mb-1"
						>
							メールアドレス
						</label>
						<input
							id="email"
							type="email"
							required
							className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							placeholder="example@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							data-testid="email-input"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-stone-400 mb-1"
						>
							パスワード
						</label>
						<input
							id="password"
							type="password"
							required
							className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							data-testid="password-input"
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

				<div className="mt-6 text-center text-sm">
					<Link
						href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
						className="text-primary hover:text-amber-400 transition-colors hover:underline"
					>
						アカウントをお持ちでない方: 登録
					</Link>
				</div>
			</div>
		</div>
	);
}
