import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Playfair_Display } from "next/font/google";
import type { WebSite, WithContext } from "schema-dts";
import Footer from "./_components/footer";
import Header from "./_components/header";
import { Providers } from "./providers";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
	display: "swap",
});

const playfairDisplay = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair-display",
	display: "swap",
});

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
		<html
			lang="ja"
			className={`${inter.variable} ${notoSansJP.variable} ${playfairDisplay.variable}`}
			suppressHydrationWarning
		>
			<head>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body className="font-sans antialiased min-h-screen flex flex-col">
				<Providers>
					<Header />
					<main className="flex-grow container mx-auto px-4 py-8">
						{children}
					</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
