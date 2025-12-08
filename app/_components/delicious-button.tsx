"use client";

import { useState, useTransition } from "react";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useRouter } from "next/navigation";
import { useSession } from "../../lib/auth-client";

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
	const [loginDialogOpen, setLoginDialogOpen] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();

	const handleClick = async () => {
		// If we know client-side that user is not logged in, prompt immediately
		if (!session) {
			setLoginDialogOpen(true);
			return;
		}

		// Optimistic Update
		const newIsLiked = !isLiked;
		setIsLiked(newIsLiked);
		setCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

		try {
			const res = await fetch(`/api/likes/${cocktailId}`, {
				method: "POST",
			});

			if (res.status === 401) {
				// Revert and show login dialog if unauthorized (double check)
				setIsLiked(!newIsLiked);
				setCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
				setLoginDialogOpen(true);
				return;
			}

			if (!res.ok) {
				throw new Error("Failed to update delicious status");
			}

			const data = await res.json();
			// Sync with server source of truth if needed, or just trust optimistic
			// setCount(data.count);
		} catch (error) {
			console.error(error);
			// Revert on error
			setIsLiked(!newIsLiked);
			setCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
		}
	};

	const handleLoginRedirect = () => {
		setLoginDialogOpen(false);
		router.push("/auth/sign-in");
	};

	return (
		<>
			<Button
				variant={isLiked ? "contained" : "outlined"}
				color="warning" // Orange/Gold for delicious/food theme
				onClick={handleClick}
				startIcon={<ThumbUpIcon />}
				sx={{
					borderRadius: "20px",
					textTransform: "none",
					fontWeight: "bold",
					color: isLiked ? "white" : "#ff9800",
					borderColor: "#ff9800",
					"&:hover": {
						backgroundColor: isLiked ? "#f57c00" : "rgba(255, 152, 0, 0.04)",
						borderColor: "#f57c00",
					},
				}}
			>
				おいしい！{" "}
				{count > 0 && <span style={{ marginLeft: "4px" }}>{count}</span>}
			</Button>

			<Dialog
				open={loginDialogOpen}
				onClose={() => setLoginDialogOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"ログインが必要です"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						「おいしい！」を送るにはログインが必要です。
						ログインページに移動しますか？
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setLoginDialogOpen(false)}>キャンセル</Button>
					<Button onClick={handleLoginRedirect} autoFocus>
						ログインする
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
