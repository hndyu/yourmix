"use client";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

	const handleClick = async () => {
		if (!session) {
			setShowLoginModal(true);
			return;
		}

		const newIsLiked = !isLiked;
		setIsLiked(newIsLiked);
		setCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

		try {
			const res = await fetch(`/api/likes/${cocktailId}`, { method: "POST" });

			if (res.status === 401) {
				setIsLiked(!newIsLiked);
				setCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
				setShowLoginModal(true);
				return;
			}

			if (!res.ok) throw new Error("Failed to update delicious status");
		} catch (error) {
			console.error(error);
			setIsLiked(!newIsLiked);
			setCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
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
				className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all
          ${
						isLiked
							? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600"
							: "bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500/10"
					}
        `}
			>
				<ThumbUpIcon fontSize="small" />
				<span>おいしい！</span>
				{count > 0 && <span>{count}</span>}
			</button>

			{/* Custom Login Modal */}
			{showLoginModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
					<div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
						<h3 className="text-lg font-bold text-white mb-2">
							ログインが必要です
						</h3>
						<p className="text-stone-400 mb-6 text-sm">
							「おいしい！」を送るにはログインが必要です。ログインページに移動しますか？
						</p>
						<div className="flex justify-end gap-3">
							<Button variant="ghost" onClick={() => setShowLoginModal(false)}>
								キャンセル
							</Button>
							<Button onClick={handleLoginRedirect}>ログインする</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
