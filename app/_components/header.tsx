"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

// ヘッダーコンポーネント
export default function Header() {
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	return (
		<AppBar position="static" color="transparent" elevation={0}>
			<Toolbar>
				{/* 左側：メニューアイコン（必要に応じて） */}
				{/* <IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
				>
					<MenuIcon />
				</IconButton> */}

				{/* 中央：アプリ名やロゴ */}
				<Link
					href="/"
					style={{
						textDecoration: "none",
						color: "inherit",
						flexGrow: 1,
					}}
				>
					<Typography
						variant="h6"
						component={isHomePage ? "h1" : "div"}
						sx={{ fontWeight: "bold", color: "#333" }}
					>
						YourMix
					</Typography>
				</Link>

				{/* 右側：将来的にナビゲーションやユーザーアイコンなど */}
				<Box>{/* ここにボタンやアイコンを追加可能 */}</Box>
			</Toolbar>
		</AppBar>
	);
}
