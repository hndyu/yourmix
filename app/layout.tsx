import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Header from './_components/header';

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
        <Header />
				<body>
					<AppRouterCacheProvider>{children}</AppRouterCacheProvider>
				</body>
			</html>
		);
}
