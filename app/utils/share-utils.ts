// 共有機能のユーティリティ関数

import type { Cocktail } from "../types/cocktail";

// ブラウザ環境かどうかをチェックする関数
const isBrowser = typeof window !== "undefined";

// Web Share APIを使用した共有
export const shareViaWebShare = async (cocktail: Cocktail): Promise<void> => {
	if (!isBrowser) {
		console.warn("ブラウザ環境ではありません");
		return;
	}

	if (navigator.share) {
		try {
			await navigator.share({
				title: `${cocktail.name} - カクテルレシピ`,
				text: `${cocktail.name}: ${cocktail.description}`,
				url: window.location.href,
			});
		} catch (error) {
			console.error("Web Share API エラー:", error);
			// Web Share APIが失敗した場合はフォールバック
			await fallbackShare(cocktail);
		}
	} else {
		// Web Share APIがサポートされていない場合
		await fallbackShare(cocktail);
	}
};

// X（Twitter）での共有
export const shareViaTwitter = (cocktail: Cocktail): void => {
	if (!isBrowser) {
		console.warn("ブラウザ環境ではありません");
		return;
	}

	try {
		const text = `${cocktail.name} - カクテルレシピ\n${cocktail.description}\n\n#カクテル #レシピ #${cocktail.name.replace(/\s+/g, "")}`;
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
		window.open(url, "_blank", "width=600,height=400");
	} catch (error) {
		console.error("X共有エラー:", error);
		// エラーが発生した場合はクリップボードコピーにフォールバック
		copyToClipboard(cocktail);
	}
};

// クリップボードにコピー
export const copyToClipboard = async (cocktail: Cocktail): Promise<boolean> => {
	if (!isBrowser) {
		console.warn("ブラウザ環境ではありません");
		return false;
	}

	try {
		const shareText = `${cocktail.name} - カクテルレシピ\n\n${cocktail.description}\n\n材料:\n${cocktail.ingredients.map(i => `${i.name} ${i.amount}`).join("\n")}\n\n作り方:\n${cocktail.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join("\n")}\n\n${window.location.href}`;

		await navigator.clipboard.writeText(shareText);
		return true;
	} catch (error) {
		console.error("クリップボードコピーエラー:", error);

		// フォールバック: 古いブラウザ対応
		try {
			const textArea = document.createElement("textarea");
			textArea.value = `${cocktail.name} - カクテルレシピ\n\n${cocktail.description}\n\n材料:\n${cocktail.ingredients.map(i => `${i.name} ${i.amount}`).join("\n")}\n\n作り方:\n${cocktail.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join("\n")}\n\n${window.location.href}`;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			const successful = document.execCommand("copy");
			document.body.removeChild(textArea);
			return successful;
		} catch (fallbackError) {
			console.error("フォールバックコピーエラー:", fallbackError);
			return false;
		}
	}
};

// フォールバック共有（Web Share APIが失敗した場合）
const fallbackShare = async (cocktail: Cocktail): Promise<void> => {
	if (!isBrowser) {
		console.warn("ブラウザ環境ではありません");
		return;
	}

	try {
		// モバイルの場合はX共有、デスクトップの場合はクリップボードコピー
		if (window.innerWidth <= 768) {
			shareViaTwitter(cocktail);
		} else {
			await copyToClipboard(cocktail);
		}
	} catch (error) {
		console.error("フォールバック共有エラー:", error);
		// 最後の手段としてクリップボードコピーを試行
		await copyToClipboard(cocktail);
	}
};
