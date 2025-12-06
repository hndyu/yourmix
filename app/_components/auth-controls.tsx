"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthControls() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	if (isPending) {
		return <Typography variant="body2">Loading...</Typography>;
	}

	if (session) {
		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<Typography variant="body2" sx={{ color: "#333" }}>
					{session.user.name}
				</Typography>
				<button
					type="button"
					onClick={async () => {
						await signOut();
						router.refresh();
					}}
					className="text-[#333] hover:underline"
				>
					Sign Out
				</button>
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", gap: 2 }}>
			<Link href="/auth/sign-in" style={{ textDecoration: "none" }}>
				<Typography variant="body2" sx={{ color: "#333", fontWeight: "bold" }}>
					ログイン
				</Typography>
			</Link>
			<Link href="/auth/sign-up" style={{ textDecoration: "none" }}>
				<Typography variant="body2" sx={{ color: "#333", fontWeight: "bold" }}>
					アカウント登録
				</Typography>
			</Link>
		</Box> // Updated text to match Japanese
	);
}
