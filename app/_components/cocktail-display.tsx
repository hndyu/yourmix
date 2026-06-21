"use client";

import {
	Check,
	Copy,
	HelpCircle,
	Martini,
	RotateCcw,
	Share2,
	ShoppingCart,
	Sparkles,
	Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
	titleId?: string;
	descriptionId?: string;
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
	titleId,
	descriptionId,
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
	const [isDescriptionCopied, setIsDescriptionCopied] = React.useState(false);
	const [isIngredientsCopied, setIsIngredientsCopied] = React.useState(false);
	const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
		new Set(),
	);
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
	const copyDescriptionTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
	const copyIngredientsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
			}
			if (copyDescriptionTimeoutRef.current) {
				clearTimeout(copyDescriptionTimeoutRef.current);
			}
			if (copyIngredientsTimeoutRef.current) {
				clearTimeout(copyIngredientsTimeoutRef.current);
			}
		};
	}, []);

	const toggleStep = (index: number) => {
		setCompletedSteps((prev) => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	};

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

	const handleCopyIngredients = async () => {
		const text = displayIngredients
			.map((item) => `${item.name}: ${item.amount}`)
			.join("\n");
		try {
			await navigator.clipboard.writeText(text);
			setIsIngredientsCopied(true);
			if (copyIngredientsTimeoutRef.current) {
				clearTimeout(copyIngredientsTimeoutRef.current);
			}
			copyIngredientsTimeoutRef.current = setTimeout(
				() => setIsIngredientsCopied(false),
				2000,
			);
			setToastState({
				open: true,
				message: "材料リストをコピーしました!",
				severity: "success",
			});
		} catch (err) {
			console.error("Failed to copy ingredients: ", err);
			setToastState({
				open: true,
				message: "コピーに失敗しました",
				severity: "error",
			});
		}
	};

	const handleCopyDescription = async () => {
		if (!cocktail.description) return;
		try {
			await navigator.clipboard.writeText(cocktail.description);
			setIsDescriptionCopied(true);
			if (copyDescriptionTimeoutRef.current) {
				clearTimeout(copyDescriptionTimeoutRef.current);
			}
			copyDescriptionTimeoutRef.current = setTimeout(
				() => setIsDescriptionCopied(false),
				2000,
			);
			setToastState({
				open: true,
				message: "説明文をコピーしました!",
				severity: "success",
			});
		} catch (err) {
			console.error("Failed to copy description: ", err);
			setToastState({
				open: true,
				message: "コピーに失敗しました",
				severity: "error",
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
								<h1
									id={titleId}
									className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight"
								>
									{cocktail.name}
								</h1>
							) : (
								<h2
									id={titleId}
									className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight"
								>
									{cocktail.name}
								</h2>
							)}
							{cocktail.description && (
								<div className="flex items-start gap-2 group/desc">
									<p
										id={descriptionId}
										className="text-muted-foreground text-lg leading-relaxed italic flex-1"
									>
										{cocktail.description}
									</p>
									<button
										type="button"
										onClick={handleCopyDescription}
										className={`group shrink-0 p-1.5 rounded-lg transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 ${
											isDescriptionCopied
												? "text-green-500 bg-green-500/10"
												: "text-muted-foreground hover:text-foreground hover:bg-secondary [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/desc:opacity-100 focus-visible:opacity-100"
										}`}
										aria-label={
											isDescriptionCopied ? "コピーしました" : "説明文をコピー"
										}
										title={
											isDescriptionCopied ? "コピーしました" : "説明文をコピー"
										}
									>
										{isDescriptionCopied ? (
											<Check size={16} aria-hidden="true" />
										) : (
											<Copy
												size={16}
												aria-hidden="true"
												className="transition-transform group-hover:rotate-12"
											/>
										)}
									</button>
								</div>
							)}

							{/* Tags */}
							<div className="flex flex-wrap gap-2">
								{cocktail.tags?.map((tag) => (
									// <a> 内に <button> は HTML 仕様違反（interactive content の入れ子禁止）のため、
									// タグ名 Link とはてな button を兄弟要素として div でラップする
									<div
										key={tag.name}
										className="flex items-center bg-secondary border border-border rounded-full text-xs text-muted-foreground"
									>
										<Link
											href={`/tags/${encodeURIComponent(tag.name)}`}
											className="inline-flex items-center gap-1.5 px-3 py-1 hover:bg-secondary/80 hover:text-foreground transition-all active:scale-95 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
										>
											<Tag size={16} className="shrink-0" aria-hidden="true" />
											{tag.name}
										</Link>
										{tag.description && (
											<button
												type="button"
												aria-label={`${tag.name}の説明を表示`}
												title={`${tag.name}の説明を表示`}
												className="group pr-2 shrink-0 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
												onClick={() => {
													setToastState({
														open: true,
														message: tag.description ?? "",
														severity: "info",
													});
												}}
											>
												<HelpCircle
													size={16}
													className="shrink-0 transition-transform group-hover:rotate-12"
													aria-hidden="true"
												/>
											</button>
										)}
									</div>
								))}
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
									className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 min-w-[100px] justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 ${
										isCopied
											? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
											: "bg-secondary text-foreground hover:bg-secondary/80"
									}`}
									aria-label={
										isWebShareSupported
											? "共有"
											: isCopied
												? "コピーしました"
												: "レシピをコピー"
									}
									title={
										isWebShareSupported
											? "共有"
											: isCopied
												? "コピーしました"
												: "レシピをコピー"
									}
								>
									{isWebShareSupported ? (
										<Share2
											size={18}
											aria-hidden="true"
											className="transition-transform group-hover:rotate-12"
										/>
									) : isCopied ? (
										<Check size={18} aria-hidden="true" />
									) : (
										<Copy
											size={18}
											aria-hidden="true"
											className="transition-transform group-hover:rotate-12"
										/>
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
							<div className="flex items-center justify-between mb-6 group/ing">
								<h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
									<span
										className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm"
										aria-hidden="true"
									>
										A
									</span>
									材料
								</h3>
								<button
									type="button"
									onClick={handleCopyIngredients}
									className={`group flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 rounded-full ${
										isIngredientsCopied
											? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
											: "text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/ing:opacity-100 focus-visible:opacity-100"
									}`}
									aria-label={
										isIngredientsCopied
											? "コピーしました"
											: "材料リストをコピー"
									}
									title={
										isIngredientsCopied
											? "コピーしました"
											: "材料リストをコピー"
									}
								>
									{isIngredientsCopied ? (
										<Check size={14} aria-hidden="true" />
									) : (
										<Copy
											size={14}
											aria-hidden="true"
											className="transition-transform group-hover:rotate-12"
										/>
									)}
									{isIngredientsCopied ? "コピー完了" : "リストをコピー"}
								</button>
							</div>

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
																className="group inline-flex items-center gap-1 px-2 py-1 bg-secondary hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 rounded-lg text-sm font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
																aria-label={`${ing.name}を探す（新しいウィンドウで開きます）`}
																title={`${ing.name}を探す（新しいウィンドウで開きます）`}
															>
																<ShoppingCart
																	size={12}
																	aria-hidden="true"
																	className="transition-transform group-hover:rotate-12"
																/>
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
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
									<span
										className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm"
										aria-hidden="true"
									>
										B
									</span>
									作り方
								</h3>
								{completedSteps.size > 0 && (
									<button
										type="button"
										onClick={() => setCompletedSteps(new Set())}
										className="group flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 animate-in fade-in zoom-in-95 duration-200"
										aria-label="進捗をリセット"
										title="進捗をリセット"
									>
										<RotateCcw
											size={14}
											aria-hidden="true"
											className="transition-transform group-hover:-rotate-45"
										/>
										リセット
									</button>
								)}
							</div>

							{/* Success Celebration Message */}
							{completedSteps.size === cocktailInstructions.length &&
								cocktailInstructions.length > 0 && (
									<div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-500">
										<div className="flex items-center gap-3">
											<div
												className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20"
												aria-hidden="true"
											>
												<Martini size={20} className="animate-pulse" />
											</div>
											<div>
												<p className="font-bold text-primary">
													Cheers! カクテルの完成です
												</p>
												<p className="text-xs text-primary/70">
													美味しい一杯をお楽しみください。
												</p>
											</div>
										</div>
										<Sparkles
											className="text-primary animate-pulse hidden sm:block"
											size={24}
											aria-hidden="true"
										/>
									</div>
								)}

							{/* コネクターラインは ol の外でラップ div を基準に絶対配置する */}
							<div className="relative">
								{/* Continuous connector line */}
								{cocktailInstructions.length > 1 && (
									<div
										className="absolute left-4 top-4 bottom-4 w-px bg-border -translate-x-1/2 z-0"
										aria-hidden="true"
									/>
								)}
								<ol className="space-y-6">
									{cocktailInstructions.map((step, index) => {
										const isStepCompleted = completedSteps.has(index);
										return (
											// biome-ignore lint/suspicious/noArrayIndexKey: Order is static
											<li key={`step-${index}`} className="group relative z-10">
												<button
													type="button"
													onClick={() => toggleStep(index)}
													aria-pressed={isStepCompleted}
													className="flex gap-4 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-8 rounded-lg transition-all active:scale-[0.98]"
												>
													<span className="sr-only">
														ステップ {index + 1}
														{isStepCompleted ? "（完了）" : "（未完了）"}
													</span>
													<div className="flex flex-col items-center shrink-0">
														<div
															className={`
                              w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300
                              ${
																isStepCompleted
																	? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
																	: "bg-background border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
															}
                            `}
															aria-hidden="true"
														>
															{isStepCompleted ? (
																<Check size={16} strokeWidth={3} />
															) : (
																index + 1
															)}
														</div>
													</div>
													<p
														className={`pt-1 leading-relaxed transition-all duration-300 ${
															isStepCompleted
																? "text-muted-foreground line-through opacity-60"
																: "text-foreground"
														}`}
													>
														{step}
													</p>
												</button>
											</li>
										);
									})}
								</ol>
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
