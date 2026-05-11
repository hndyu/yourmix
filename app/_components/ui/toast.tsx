"use client";

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

export type ToastSeverity = "success" | "warning" | "info" | "error";

interface ToastProps {
	open: boolean;
	message: string;
	severity: ToastSeverity;
	onClose: () => void;
	autoHideDuration?: number;
}

export function Toast({
	open,
	message,
	severity,
	onClose,
	autoHideDuration = 3000,
}: ToastProps) {
	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				onClose();
			}, autoHideDuration);
			return () => clearTimeout(timer);
		}
	}, [open, autoHideDuration, onClose]);

	if (!open) return null;

	const severityStyles = {
		success: "bg-green-600 text-white",
		warning: "bg-amber-500 text-white",
		info: "bg-blue-600 text-white",
		error: "bg-red-600 text-white",
	};

	const icons = {
		success: <CheckCircle size={20} aria-hidden="true" />,
		warning: <AlertTriangle size={20} aria-hidden="true" />,
		info: <Info size={20} aria-hidden="true" />,
		error: <XCircle size={20} aria-hidden="true" />,
	};

	return (
		<output
			className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300"
			aria-live="polite"
		>
			<div
				className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg shadow-black/20
        ${severityStyles[severity]}
      `}
			>
				{icons[severity]}
				<span className="font-medium">{message}</span>
				<button
					type="button"
					onClick={onClose}
					className="ml-2 -mr-1 p-1 rounded-full hover:bg-white/20 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
					aria-label="閉じる"
				>
					<X size={18} aria-hidden="true" />
				</button>
			</div>
		</output>
	);
}
