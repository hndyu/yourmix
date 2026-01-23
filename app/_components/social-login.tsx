"use client";

import authClient from "@/app/lib/authClient";
import { isValidCallbackUrl } from "@/app/lib/url";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function SocialLogin({
	googleClientId: propGoogleClientId,
}: { googleClientId?: string }) {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const [lastMethod, setLastMethod] = useState<string | null>(null);
	const [mounted, setMounted] = useState(false);
	const searchParams = useSearchParams();

	const googleClientId =
		propGoogleClientId ||
		process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
		process.env.GOOGLE_CLIENT_ID;

	useEffect(() => {
		setMounted(true);
		const method = authClient.getLastUsedLoginMethod();
		if (method) {
			setLastMethod(method);
		}
	}, []);

	if (!mounted || !googleClientId) {
		return null;
	}

	const handleSocialLogin = async (provider: "google") => {
		setIsLoading(provider);

		// Get callbackUrl from search params, default to home
		const rawCallbackUrl = searchParams.get("callbackUrl") || "/";
		// Open Redirect protection: only allow safe relative paths
		const callbackURL = isValidCallbackUrl(rawCallbackUrl)
			? rawCallbackUrl
			: "/";

		try {
			await authClient.signIn.social({
				provider: provider,
				callbackURL: callbackURL,
			});
		} catch (error) {
			console.error("Social login failed", error);
			setIsLoading(null);
		}
	};

	return (
		<div className="space-y-3">
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-stone-300 dark:border-stone-800" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-white dark:bg-stone-900 px-3 text-stone-600 dark:text-stone-400">
						または
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3">
				<div className="relative">
					{lastMethod === "google" && (
						<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] px-2 py-0.5 rounded-full z-10 whitespace-nowrap border border-stone-200 dark:border-stone-700 shadow-sm">
							前回のログイン
						</div>
					)}
					<Button
						type="button"
						variant="outline"
						className="w-full flex items-center justify-center gap-2"
						onClick={() => handleSocialLogin("google")}
						disabled={!!isLoading}
						isLoading={isLoading === "google"}
					>
						<svg
							className="w-4 h-4"
							viewBox="0 0 24 24"
							role="img"
							aria-labelledby="google-icon-title"
						>
							<title id="google-icon-title">Google</title>
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04 3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Googleでログイン
					</Button>
				</div>
			</div>
		</div>
	);
}
