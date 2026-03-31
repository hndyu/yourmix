"use client";

import {
	Check,
	Copy,
	HelpCircle,
	Share2,
	ShoppingCart,
	Tag,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { Cocktail, GeneratedCocktail } from "../types/cocktail";
import {
	extractIngredientKeyword,
	getAffiliateLink,
} from "../utils/affiliate-links";
import { canUseWebShare, shareCocktail } from "../utils/share-utils";
import DeliciousButton from "./delicious-button";
import { Toast, type ToastSeverity } from "./ui/toast";

interface CocktailDisplayProps {
	cocktail: Cocktail | GeneratedCocktail;
	show?: boolean;
	isDetailPage?: boolean;
}

type DisplayIngredient = {
	name: string;
	amount?: string;
	description?: string | null;
	option_group?: number;
};

const isPersistedCocktail = (
	cocktail: Cocktail | GeneratedCocktail,
): cocktail is Cocktail => {
	return "id" in cocktail;
};

export default function CocktailDisplay({
	cocktail,
	show = true,
	isDetailPage = false,
}: CocktailDisplayProps) {
	const persistedCocktail =
		isDetailPage && isPersistedCocktail(cocktail) ? cocktail : null;
	// 予期しないデータ破損時でも表示処理が落ちないように配列を保証する
	const cocktailIngredients = Array.isArray(cocktail.ingredients)
		? (cocktail.ingredients as DisplayIngredient[])
		: [];
	const cocktailInstructions = Array.isArray(cocktail.instructions)
		? cocktail.instructions
		: [];
	const [isWebShareSupported, setIsWebShareSupported] = React.useState(false);
	const [isCopied, setIsCopied] = React.useState(false);
	const [imageError, setImageError] = React.useState(false);
	const [toastState, setToastState] = React.useState<{
		open: boolean;
		message: string;
		severity: ToastSeverity;
	}>({
		open: false,
		message: "",
		severity: "info",
	});

	React.useEffect(() => {
		setIsWebShareSupported(canUseWebShare());
	}, []);

	const copyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
			}
		};
	}, []);

	const handleShare = async () => {
		if (!persistedCocktail) return;
		const success = await shareCocktail(persistedCocktail);
		if (success && !isWebShareSupported) {
			setIsCopied(true);
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
			}
			copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
			setToastState({
				open: true,
				message: "コピーしました!",
				severity: "success",
			});
		}
	};

	// Grouping Logic
	const displayIngredients = React.useMemo(() => {
		const result: {
			name: string;
			amount: string;
			description?: string;
			originalIngredients: DisplayIngredient[];
		}[] = [];
		const processedOptionGroups = new Set<number>();

		// ⚡ Bolt: Pre-group ingredients by option_group to avoid O(N^2) complexity
		// This reduces the complexity of grouping from O(N^2) to O(N)
		const groupMap = new Map<number, DisplayIngredient[]>();
		for (const ingredient of cocktailIngredients) {
			if (ingredient.option_group) {
				const group = groupMap.get(ingredient.option_group) || [];
				group.push(ingredient);
				groupMap.set(ingredient.option_group, group);
			}
		}

		for (const ingredient of cocktailIngredients) {
			if (ingredient.option_group) {
				if (!processedOptionGroups.has(ingredient.option_group)) {
					const groupIngredients = groupMap.get(ingredient.option_group) || [];
					result.push({
						name: groupIngredients.map((i) => i.name).join(" or "),
						amount: ingredient.amount || "",
						description: groupIngredients
							.map((i) => i.description)
							.filter(Boolean)
							.join("\n"),
						originalIngredients: groupIngredients,
					});
					processedOptionGroups.add(ingredient.option_group);
				}
			} else {
				result.push({
					name: ingredient.name,
					amount: ingredient.amount || "",
					description: ingredient.description || undefined,
					originalIngredients: [ingredient],
				});
			}
		}
		return result;
	}, [cocktailIngredients]);

	if (!show) return null;

	return (
		<div className="w-full max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
			{/* Main Card */}
			<div className="bg-card border border-border backdrop-blur-sm rounded-[32px] overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-300">
				{/* Header / Hero Section */}
				{isDetailPage && cocktail.imageUrl && !imageError && (
					<div className="relative w-full aspect-[1/1] md:aspect-[2/1] bg-secondary/30 flex items-center justify-center p-8">
						<div className="relative w-full h-full mx-auto">
							<Image
								src={`/cocktails/${cocktail.imageUrl}`}
								alt={cocktail.name}
								fill
								className="object-contain drop-shadow-2xl"
								onError={() => setImageError(true)}
								priority
							/>
						</div>
					</div>
				)}

				<div className="p-6 md:p-10">
					{/* Title & Actions */}
					<div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-border pb-8">
						<div className="space-y-4 flex-1">
							{isDetailPage ? (
								<h1 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
									{cocktail.name}
								</h1>
							) : (
								<h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
									{cocktail.name}
								</h2>
							)}
							<p className="text-muted-foreground text-lg leading-relaxed italic">
								{cocktail.description}
							</p>

							{/* Tags */}
							<div className="flex flex-wrap gap-2">
								{cocktail.tags?.map((tag) => {
									const content = (
										<>
											<Tag size={16} className="shrink-0" />
											{tag.name}
											{tag.description && (
												<HelpCircle size={16} className="shrink-0" />
											)}
										</>
									);
									const className = `flex items-center gap-1.5 px-3 py-1 bg-secondary border border-border rounded-full text-xs text-muted-foreground ${
										tag.description
											? "cursor-pointer hover:bg-secondary/80 hover:text-foreground transition-colors"
											: ""
									}`;

									if (tag.description) {
										const description = tag.description;
										return (
											<button
												key={tag.name}
												type="button"
												className={className}
												onClick={() =>
													setToastState({
														open: true,
														message: description,
														severity: "info",
													})
												}
											>
												{content}
											</button>
										);
									}

									return (
										<div key={tag.name} className={className}>
											{content}
										</div>
									);
								})}
							</div>
						</div>

						{/* Action Buttons */}
						{persistedCocktail && (
							<div className="flex flex-wrap md:flex-col items-end gap-3 shrink-0">
								<DeliciousButton
									cocktailId={persistedCocktail.id}
									initialCount={persistedCocktail.deliciousCount ?? 0}
									initialIsLiked={persistedCocktail.isLiked ?? false}
								/>
								<button
									type="button"
									onClick={handleShare}
									className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 min-w-[100px] justify-center ${
										isCopied
											? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
											: "bg-secondary text-foreground hover:bg-secondary/80"
									}`}
								>
									{isWebShareSupported ? (
										<Share2 size={18} />
									) : isCopied ? (
										<Check size={18} />
									) : (
										<Copy size={18} />
									)}
									{isWebShareSupported ? "共有" : isCopied ? "完了" : "コピー"}
								</button>
							</div>
						)}
					</div>

					{/* Content Grid */}
					<div className="grid md:grid-cols-2 gap-12">
						{/* Ingredients */}
						<div>
							<h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
								<span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
									A
								</span>
								材料
							</h3>

							<ul className="space-y-4">
								{displayIngredients.map((item) => (
									<li
										key={item.name}
										className="bg-secondary/20 rounded-xl p-4 border border-border"
									>
										<div className="flex justify-between items-start gap-4">
											<div className="flex-1">
												<div className="flex flex-wrap items-center gap-1 text-foreground font-medium">
													{item.originalIngredients.map((ing, i) => (
														<span
															key={ing.name}
															className="flex items-center gap-1"
														>
															{ing.name}
															{i < item.originalIngredients.length - 1 && (
																<span className="text-muted-foreground text-sm mx-1">
																	or
																</span>
															)}
														</span>
													))}
												</div>
												<div className="text-primary mt-1 font-bold">
													{item.amount}
												</div>
											</div>

											{/* DetailPage以外では購入導線を出さない */}
											{isDetailPage && (
												<div className="flex flex-col gap-2 shrink-0">
													{item.originalIngredients.map((ing) => {
														const keyword = extractIngredientKeyword(ing.name);
														const link = getAffiliateLink(keyword);
														if (!link) return null;
														return (
															<a
																key={`link-${ing.name}`}
																href={link}
																target="_blank"
																rel="noopener noreferrer"
																className="inline-flex items-center gap-1 px-2 py-1 bg-secondary hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 rounded text-sm font-bold transition-colors"
															>
																<ShoppingCart size={12} />
																買う
															</a>
														);
													})}
												</div>
											)}
										</div>
									</li>
								))}
							</ul>
						</div>

						{/* Instructions */}
						<div>
							<h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
								<span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
									B
								</span>
								作り方
							</h3>

							<div className="space-y-6">
								{cocktailInstructions.map((step, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Order is static
									<div key={`step-${index}`} className="group flex gap-4">
										<div className="flex flex-col items-center">
											<div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground font-bold text-sm shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-colors">
												{index + 1}
											</div>
											{index < cocktailInstructions.length - 1 && (
												<div className="w-px h-full bg-border mt-2" />
											)}
										</div>
										<p className="pt-1 text-foreground leading-relaxed">
											{step}
										</p>
									</div>
								))}
							</div>

							{cocktail.garnish && (
								<div className="mt-8 p-4 bg-muted/30 rounded-xl border border-border border-dashed">
									<h4 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">
										飾り
									</h4>
									<p className="text-foreground">{cocktail.garnish}</p>
								</div>
							)}
						</div>
					</div>

					<div className="mt-12 pt-6 border-t border-border text-center">
						<p className="text-xs text-muted-foreground italic">
							※カクテルの画像と説明文はAIによって生成されたイメージです。
						</p>
					</div>
				</div>
			</div>

			<Toast
				open={toastState.open}
				message={toastState.message}
				severity={toastState.severity}
				onClose={() => setToastState((prev) => ({ ...prev, open: false }))}
			/>
		</div>
	);
}
