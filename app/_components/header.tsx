"use client";

import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

// ヘッダーコンポーネント
export default function Header() {
	return (
		<AppBar position="static" color="transparent" elevation={0}>
			<Toolbar>
				{/* 左側：メニューアイコン（必要に応じて） */}
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
				>
					<MenuIcon />
				</IconButton>

				{/* 中央：アプリ名やロゴ */}
				<Typography
					variant="h6"
					component="div"
					sx={{ flexGrow: 1, fontWeight: "bold", color: "#333" }}
				>
					YourMix
				</Typography>

				{/* 右側：将来的にナビゲーションやユーザーアイコンなど */}
				<Box>{/* ここにボタンやアイコンを追加可能 */}</Box>
			</Toolbar>
		</AppBar>
	);
}
