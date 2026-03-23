"use client";

import { CheckCircle, Info, XCircle } from "lucide-react";
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
		success: <CheckCircle size={20} />,
		warning: <Info size={20} />, // Lucide doesn't have Warning icon, use Info or AlertTriangle
		info: <Info size={20} />,
		error: <XCircle size={20} />,
	};

	return (
		<div
			className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300"
			role="status"
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
			</div>
		</div>
	);
}
