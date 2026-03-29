"use client";

import { ThumbsUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toggleLikeAction } from "../actions/likes";
import authClient from "../lib/authClient";
import { Button } from "./ui/button";

interface DeliciousButtonProps {
	cocktailId: string;
	initialCount: number;
	initialIsLiked: boolean;
}

export default function DeliciousButton({
	cocktailId,
	initialCount,
	initialIsLiked,
}: DeliciousButtonProps) {
	const [count, setCount] = useState(initialCount);
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const router = useRouter();
	const { data: session } = authClient.useSession();

	// Handle Escape key to close modal
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setShowLoginModal(false);
			}
		};

		if (showLoginModal) {
			window.addEventListener("keydown", handleEscape);
		}
		return () => window.removeEventListener("keydown", handleEscape);
	}, [showLoginModal]);

	const handleClick = async () => {
		if (!session) {
			setShowLoginModal(true);
			return;
		}

		const newIsLiked = !isLiked;
		setIsLiked(newIsLiked);
		setCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

		try {
			const result = await toggleLikeAction(cocktailId);

			if (result.success) {
				setIsLiked(result.data.isLiked);
				setCount(result.data.count);
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error(error);
			// Revert on error
			setIsLiked(!newIsLiked);
			setCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));

			if (error instanceof Error && error.message.includes("ログイン")) {
				setShowLoginModal(true);
			}
		}
	};

	const handleLoginRedirect = () => {
		setShowLoginModal(false);
		router.push("/auth/sign-in");
	};

	return (
		<>
			<button
				type="button"
				onClick={handleClick}
				aria-label={`おいしい！ ${count > 0 ? `現在の数: ${count}` : ""}`}
				aria-pressed={isLiked}
				className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all
          ${
						isLiked
							? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600"
							: "bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500/10"
					}
        `}
			>
				<ThumbsUp size={18} />
				<span>おいしい！</span>
				{count > 0 && <span>{count}</span>}
			</button>

			{/* Custom Login Modal */}
			{showLoginModal &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
						onClick={() => setShowLoginModal(false)}
						onKeyDown={(e) => {
							// 子要素からの Enter 伝播では閉じない（ボタンの発火を妨げない）
							if (e.currentTarget !== e.target) return;
							if (e.key === "Enter" || e.key === " ") {
								setShowLoginModal(false);
							}
						}}
					>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation doesn't need key event */}
						<div
							className="relative w-full max-w-sm bg-background border border-border rounded-2xl p-6 shadow-2xl animate-in zoom-in-95"
							// biome-ignore lint/a11y/useSemanticElements: using div for custom modal styling with portal
							role="dialog"
							aria-modal="true"
							aria-labelledby="login-modal-title"
							aria-describedby="login-modal-description"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								onClick={() => setShowLoginModal(false)}
								className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
								aria-label="閉じる"
							>
								<X size={20} />
							</button>

							<h3
								id="login-modal-title"
								className="text-lg font-bold text-foreground mb-2"
							>
								ログインが必要です
							</h3>
							<p
								id="login-modal-description"
								className="text-muted-foreground mb-6 text-sm"
							>
								「おいしい！」を送るにはログインが必要です。ログインページに移動しますか？
							</p>
							<div className="flex justify-end gap-3">
								<Button
									variant="ghost"
									onClick={() => setShowLoginModal(false)}
								>
									キャンセル
								</Button>
								<Button onClick={handleLoginRedirect}>ログインする</Button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
