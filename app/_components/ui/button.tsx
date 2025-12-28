import Link from "next/link";
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "ghost" | "link";
	size?: "sm" | "md" | "lg";
	href?: string;
	isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className = "",
			variant = "default",
			size = "md",
			href,
			isLoading,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const baseStyles =
			"inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-stone-950 active:scale-95";

		const variants = {
			default:
				"bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-lg shadow-black/20 hover:shadow-black/30",
			outline:
				"border border-stone-200 dark:border-stone-700 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-50 text-stone-600 dark:text-stone-300",
			ghost:
				"hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-50 text-stone-500 dark:text-stone-400",
			link: "text-stone-900 dark:text-stone-100 underline-offset-4 hover:underline",
		};

		const sizes = {
			sm: "h-9 px-3 text-sm",
			md: "h-11 px-6 text-base",
			lg: "h-14 px-8 text-lg",
		};

		const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

		if (href) {
			return (
				<Link href={href} className={combinedClassName}>
					{isLoading && <span className="mr-2 animate-spin">⏳</span>}
					{children}
				</Link>
			);
		}

		return (
			<button
				ref={ref}
				className={combinedClassName}
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading && <span className="mr-2 animate-spin">⏳</span>}
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";
