// import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./utils/theme";
import type { Metadata } from "next";
import type { WebSite, WithContext } from "schema-dts";
import Footer from "./_components/footer";
import Header from "./_components/header";

export const metadata: Metadata = {
	title: {
		default: "YourMix",
		template: "%s | YourMix",
	},
	description: "あなただけのカクテルを作ってみよう。",
};

const jsonLd: WithContext<WebSite> = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "YourMix",
	url: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Header />
						<main>{children}</main>
						<Footer />
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
