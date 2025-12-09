"use client";

import { useSession, signOut } from "@/lib/auth-client";
import {
	Box,
	Typography,
	Button,
	Avatar,
	Menu,
	MenuItem,
	Tooltip,
	IconButton,
	CircularProgress,
	Divider,
} from "@mui/material";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function AuthControls() {
	const { data: session, isPending } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	const callbackUrl =
		pathname === "/auth/sign-in" || pathname === "/auth/sign-up" ? "/" : pathname;

	// User Menu State
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSignOut = async () => {
		handleClose();
		await signOut();
		router.refresh();
	};

	if (isPending) {
		return <CircularProgress size={24} color="inherit" />;
	}

	if (session) {
		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<Tooltip title="Account settings">
					<IconButton
						onClick={handleClick}
						size="small"
						sx={{ ml: 2 }}
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
					>
						<Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
							{session.user.name
								? session.user.name.charAt(0).toUpperCase()
								: "U"}
						</Avatar>
					</IconButton>
				</Tooltip>
				<Menu
					anchorEl={anchorEl}
					id="account-menu"
					open={open}
					onClose={handleClose}
					onClick={handleClose}
					slotProps={{
						paper: {
							elevation: 0,
							sx: {
								overflow: "visible",
								filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
								mt: 1.5,
								"& .MuiAvatar-root": {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1,
								},
								"&::before": {
									content: '""',
									display: "block",
									position: "absolute",
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: "background.paper",
									transform: "translateY(-50%) rotate(45deg)",
									zIndex: 0,
								},
							},
						},
					}}
					transformOrigin={{ horizontal: "right", vertical: "top" }}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				>
					<MenuItem onClick={handleClose}>
						<Typography variant="body2" noWrap>
							{session.user.name}
						</Typography>
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleSignOut}>
						<Typography variant="body2" color="error">
							ログアウト
						</Typography>
					</MenuItem>
				</Menu>
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", gap: 1 }}>
			<Button
				component={Link}
				href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
				color="inherit"
				variant="text"
				sx={{ fontWeight: "bold" }}
			>
				ログイン
			</Button>
			<Button
				component={Link}
				href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
				color="primary"
				variant="contained"
				sx={{ fontWeight: "bold" }}
			>
				アカウント登録
			</Button>
		</Box>
	);
}
