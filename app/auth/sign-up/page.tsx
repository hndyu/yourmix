"use client";

import { signUp } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		await signUp.email(
			{
				email,
				password,
				name,
			},
			{
				onSuccess: () => {
					router.push("/auth/sign-in");
				},
				onError: (ctx) => {
					setError(ctx.error.message);
				},
			},
		);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-2xl font-bold mb-4">アカウント登録</h1>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full max-w-sm"
			>
				<input
					type="text"
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="border p-2 rounded text-black"
					required
				/>
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
					className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
				>
					アカウント登録
				</button>
			</form>
		</div>
	);
}
