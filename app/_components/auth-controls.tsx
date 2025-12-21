"use client";

import authClient from "@/app/lib/authClient";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export default function AuthControls() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const callbackUrl =
		pathname === "/auth/sign-in" || pathname === "/auth/sign-up"
			? "/"
			: pathname;

	// Close menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSignOut = async () => {
		setIsOpen(false);
		await authClient.signOut();
		router.refresh();
	};

	if (isPending) {
		return (
			<div className="w-8 h-8 rounded-full border-2 border-stone-800 border-t-primary animate-spin" />
		);
	}

	if (session) {
		return (
			<div className="relative" ref={menuRef}>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-2 focus:outline-none group"
					aria-label="User menu"
				>
					<div className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 group-hover:border-primary/50 group-hover:text-primary transition-colors overflow-hidden">
						{session.user.image ? (
							<img
								src={session.user.image}
								alt={session.user.name || "User"}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-sm font-bold">
								{session.user.name
									? session.user.name.charAt(0).toUpperCase()
									: "U"}
							</span>
						)}
					</div>
				</button>

				{isOpen && (
					<div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
						<div className="px-4 py-3 border-b border-stone-800">
							<p className="text-sm font-medium text-white max-w-full truncate">
								{session.user.name}
							</p>
							<p className="text-xs text-stone-500 truncate">
								{session.user.email}
							</p>
						</div>
						<div className="p-1">
							<Link
								href="/my-page"
								className="flex items-center gap-2 px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-white rounded-lg transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<PersonIcon fontSize="small" className="text-stone-500" />
								マイページ
							</Link>
							<button
								type="button"
								onClick={handleSignOut}
								className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-left"
							>
								<LogoutIcon fontSize="small" />
								ログアウト
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex gap-2">
			<Button
				variant="ghost"
				size="sm"
				href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
				className="hidden sm:inline-flex"
			>
				ログイン
			</Button>
			<Button
				size="sm"
				href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
			>
				アカウント登録
			</Button>
		</div>
	);
}
