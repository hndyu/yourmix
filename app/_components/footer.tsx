"use client";

import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full py-6 mt-auto border-t border-stone-300 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/50">
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-600 dark:text-stone-500">
				<p>&copy; 2025 YourMix. All rights reserved.</p>
				<div className="flex items-center gap-6">
					<Link
						href="/terms-of-service"
						className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 dark:focus-visible:ring-offset-stone-950"
					>
						利用規約
					</Link>
					<Link
						href="/privacy-policy"
						className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 dark:focus-visible:ring-offset-stone-950"
					>
						プライバシーポリシー
					</Link>
				</div>
			</div>
		</footer>
	);
}
