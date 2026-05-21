"use client";

import { ThumbsUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toggleLikeAction } from "../actions/likes";
import authClient from "../lib/authClient";
import { lockBodyScroll } from "../utils/body-scroll-lock";
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
	const loginButtonRef = useRef<HTMLButtonElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

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

	// Focus management
	useEffect(() => {
		if (showLoginModal) {
			// Set focus to the login button after the modal is rendered
			const timer = setTimeout(() => {
				loginButtonRef.current?.focus();
			}, 0);
			return () => clearTimeout(timer);
		}
		// Restore focus when modal closes
		previousActiveElement.current?.focus();
	}, [showLoginModal]);

	// Lock body scroll
	useEffect(() => {
		if (!showLoginModal) return;

		// 入れ子モーダルでも背後のスクロールロックを壊さないようにする
		const unlock = lockBodyScroll();
		return unlock;
	}, [showLoginModal]);

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		previousActiveElement.current = e.currentTarget;

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
				title={`おいしい！ ${count > 0 ? `現在の数: ${count}` : ""}`}
				aria-pressed={isLiked}
				className={`
          group flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950
          ${
						isLiked
							? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600"
							: "bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500/10"
					}
        `}
			>
				<ThumbsUp
					size={18}
					aria-hidden="true"
					className="transition-transform group-hover:rotate-12"
				/>
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
								className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all active:scale-90 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
								aria-label="閉じる"
								title="閉じる"
							>
								<X size={20} aria-hidden="true" />
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
								<Button ref={loginButtonRef} onClick={handleLoginRedirect}>
									ログインする
								</Button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
