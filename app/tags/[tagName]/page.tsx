import { ChevronRight, Martini, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as React from "react";
import { getCocktailsByTag } from "../../lib/cocktail-data";

interface TagPageProps {
	params: Promise<{ tagName: string }>;
}

export async function generateMetadata({
	params,
}: TagPageProps): Promise<Metadata> {
	const { tagName } = await params;
	// App Router が動的セグメント値を既にデコード済みで提供するため、追加のデコードは不要
	const result = await getCocktailsByTag(tagName);

	if (!result) {
		return { title: "タグが見つかりません" };
	}

	const title = `「${tagName}」のカクテル一覧`;
	const description =
		result.tag.description ??
		`「${tagName}」タグが付いたカクテルのレシピ一覧です。`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
	};
}

export default async function TagPage({ params }: TagPageProps) {
	const { tagName } = await params;
	// App Router が動的セグメント値を既にデコード済みで提供するため、追加のデコードは不要
	const result = await getCocktailsByTag(tagName);

	if (!result) {
		notFound();
	}

	const { tag, cocktails } = result;

	return (
		<div className="container mx-auto px-4 py-8">
			{/* パンくずリスト */}
			<nav
				aria-label="パンくずリスト"
				className="flex items-center text-sm text-stone-600 dark:text-stone-400 mb-6 animate-in fade-in duration-500"
			>
				<ol className="flex items-center">
					<li className="flex items-center">
						<Link
							href="/"
							className="inline-block hover:text-primary transition-all active:scale-95 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 dark:focus-visible:ring-offset-stone-950"
						>
							ホーム
						</Link>
						<ChevronRight size={16} className="mx-1" aria-hidden="true" />
					</li>
					<li className="flex items-center">
						<span
							className="text-stone-900 dark:text-stone-100 font-medium"
							aria-current="page"
						>
							{tag.name}
						</span>
					</li>
				</ol>
			</nav>

			{/* ヘッダー */}
			<div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
				<div className="text-center mb-12">
					<div className="group inline-flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-full text-sm text-muted-foreground mb-4">
						<Tag
							size={16}
							aria-hidden="true"
							className="transition-transform group-hover:rotate-12"
						/>
						タグ
					</div>
					<h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
						{tag.name}
					</h1>
					{tag.description && (
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
							{tag.description}
						</p>
					)}
					<p className="text-stone-500 dark:text-stone-500 text-sm">
						{cocktails.length}件のカクテル
					</p>
				</div>

				{cocktails.length === 0 ? (
					<div className="text-center py-20 text-muted-foreground">
						<Martini
							size={48}
							className="mx-auto mb-4 text-stone-300 dark:text-stone-700"
							aria-hidden="true"
						/>
						<p>このタグのカクテルは見つかりませんでした。</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{cocktails.map((cocktail) => (
							<Link
								key={cocktail.id}
								href={`/recipes/${cocktail.slug}`}
								className="group block relative bg-card border border-border rounded-3xl overflow-hidden hover:border-stone-400 dark:hover:border-stone-600 hover:bg-white dark:hover:bg-stone-900/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-stone-200/50 dark:shadow-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 dark:focus-visible:ring-offset-stone-950 active:scale-[0.98]"
								title={`${cocktail.name}のレシピを見る`}
							>
								{/* 画像エリア */}
								<div className="relative w-full aspect-[4/3] bg-stone-100/50 dark:bg-stone-950/50 flex items-center justify-center overflow-hidden">
									{cocktail.imageUrl ? (
										<Image
											src={`/cocktails/${cocktail.imageUrl}`}
											alt=""
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
										/>
									) : (
										<Martini
											size={64}
											className="text-stone-300 dark:text-stone-800"
											aria-hidden="true"
										/>
									)}
									{/* グラデーションオーバーレイ */}
									<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
								</div>

								{/* コンテンツ */}
								<div className="p-6 relative">
									<h2 className="text-xl font-bold text-foreground mb-2 font-display group-hover:text-primary transition-colors">
										{cocktail.name}
									</h2>
									<p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mb-4">
										{cocktail.description}
									</p>
									{/* 材料バッジ */}
									<div className="flex flex-wrap gap-1.5">
										{cocktail.ingredients.slice(0, 5).map((ing) => (
											<span
												key={ing.name}
												className="text-sm px-2 py-1 rounded-full border bg-background border-border text-stone-600 dark:text-stone-400"
											>
												{ing.name}
											</span>
										))}
										{cocktail.ingredients.length > 5 && (
											<span className="text-sm px-2 py-1 rounded-full bg-background border border-border text-stone-600 dark:text-stone-400">
												+{cocktail.ingredients.length - 5}
											</span>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
