import type { Metadata } from "next";
// import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata: Metadata = {
  title: "YourMix",
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
					<AppRouterCacheProvider>{children}</AppRouterCacheProvider>
				</body>
			</html>
		);
}
