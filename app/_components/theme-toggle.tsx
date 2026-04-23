"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return (
			<div className="w-9 h-9 rounded-full bg-stone-800/20 animate-pulse" />
		);
	}

	const themeLabel =
		resolvedTheme === "dark"
			? "ライトモードに切り替え"
			: "ダークモードに切り替え";

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-stone-500/10 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
			aria-label={themeLabel}
			title={themeLabel}
		>
			{resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
		</button>
	);
}
