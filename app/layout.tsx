// import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import Footer from "./_components/footer";
import Header from "./_components/header";

export const metadata: Metadata = {
	title: {
		default: "YourMix",
		template: "%s | YourMix",
	},
	description: "あなただけのカクテルを作ってみよう。",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<AppRouterCacheProvider>
					<Header />
					<main>{children}</main>
					<Footer />
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
