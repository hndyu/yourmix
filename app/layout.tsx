import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Playfair_Display } from "next/font/google";
import type { WebSite, WithContext } from "schema-dts";
import AgeVerificationModal from "./_components/age-verification-modal";
import Footer from "./_components/footer";
import Header from "./_components/header";
import { safeJsonStringify } from "./lib/security";
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
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
	),
	openGraph: {
		title: "YourMix",
		description: "あなただけのカクテルを作ってみよう。",
		url: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
		siteName: "YourMix",
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YourMix",
		description: "あなただけのカクテルを作ってみよう。",
	},
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
			<GoogleTagManager gtmId="GTM-PK2P5N4M" />
			<head>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }}
				/>
				<meta
					name="google-site-verification"
					content="F8BfwFA6A33Krh7xVXg4n9KP9X1oOOLQaj6vJ9PuK-A"
				/>
			</head>
			<body className="font-sans antialiased min-h-screen flex flex-col">
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:font-bold focus:outline-none"
				>
					メインコンテンツへスキップ
				</a>
				<Providers>
					<Header />
					<main
						id="main-content"
						tabIndex={-1}
						className="flex-grow container mx-auto px-4 py-8 outline-none"
					>
						{children}
					</main>
					<Footer />
					<AgeVerificationModal />
				</Providers>
			</body>
		</html>
	);
}
