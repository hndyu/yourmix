"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		await signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: () => {
					router.push("/");
				},
				onError: (ctx) => {
					setError(ctx.error.message);
				},
			},
		);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-2xl font-bold mb-4">ログイン</h1>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full max-w-sm"
			>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border p-2 rounded text-black"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-2 rounded text-black"
					required
				/>
				<button
					type="submit"
					className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
				>
					ログイン
				</button>
			</form>
			<div className="mt-4">
				<p>
					アカウントがない場合：{" "}
					<a href="/auth/sign-up" className="text-blue-500 hover:underline">
						ログイン
					</a>
				</p>
			</div>
		</div>
	);
}
