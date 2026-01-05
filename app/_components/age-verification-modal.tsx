"use client";

import { AlertTriangle, Wine } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function AgeVerificationModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDenied, setIsDenied] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
		const verified = localStorage.getItem("age-verified");
		if (!verified) {
			setIsOpen(true);
		}
	}, []);

	const handleAgree = () => {
		localStorage.setItem("age-verified", "true");
		setIsOpen(false);
	};

	const handleDeny = () => {
		setIsDenied(true);
	};

	if (!isLoaded || !isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
			data-testid="age-verification-modal"
		>
			<div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-8 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-300">
				{isDenied ? (
					<div className="space-y-6" data-testid="age-denied-content">
						<div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
							<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
							アクセスできません
						</h2>
						<p className="text-stone-600 dark:text-stone-400">
							申し訳ございませんが、20歳未満の方は本サイトをご利用いただけません。
							<br />
							お酒は20歳になってから楽しみましょう。
						</p>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => {
								window.location.href = "https://www.google.com";
							}}
							data-testid="leave-site-button"
						>
							サイトを離れる
						</Button>
					</div>
				) : (
					<div className="space-y-6" data-testid="age-verification-content">
						<div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
							<Wine className="w-8 h-8 text-amber-600 dark:text-amber-400" />
						</div>
						<h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif">
							年齢確認
						</h2>
						<p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
							本サイトはお酒やカクテルに関する情報を含んでいます。
							<br />
							法律により20歳未満の飲酒は禁止されています。
							<br />
							<span className="font-bold block mt-2">
								あなたは20歳以上ですか？
							</span>
						</p>
						<div className="flex flex-col gap-3 pt-2">
							<Button
								onClick={handleAgree}
								className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
								size="lg"
								data-testid="age-agree-button"
							>
								はい、20歳以上です
							</Button>
							<Button
								variant="ghost"
								onClick={handleDeny}
								className="w-full"
								data-testid="age-deny-button"
							>
								いいえ
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
