"use client";
import { Martini } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import AuthControls from "./auth-controls";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	return (
		<header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border supports-[backdrop-filter]:bg-background/50 transition-colors duration-300">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				{/* Logo / Brand */}
				<Link
					href="/"
					className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
				>
					<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/40">
						<Martini size={18} />
					</div>
					{isHomePage ? (
						<h1 className="font-display text-xl font-bold tracking-tight">
							YourMix
						</h1>
					) : (
						<span className="font-display text-xl font-bold tracking-tight">
							YourMix
						</span>
					)}
				</Link>

				{/* Navigation / Actions */}
				<div className="flex items-center gap-2 sm:gap-4">
					<ThemeToggle />
					<AuthControls />
				</div>
			</div>
		</header>
	);
}
