// 共有機能のユーティリティ関数

import type { Cocktail } from "../types/cocktail";

// ブラウザ環境かどうかをチェックする関数
const isBrowser = typeof window !== "undefined";

/**
 * 共有用のテキストを生成する関数
 * @param cocktail カクテルオブジェクト
 * @returns 共有用のテキスト
 */
const createShareText = (cocktail: Cocktail): string => {
	const ingredientsText = cocktail.ingredients
		.map((i) => `${i.name} ${i.amount}`)
		.join("\n");
	const instructionsText = cocktail.instructions
		.map((instruction, index) => `${index + 1}. ${instruction}`)
		.join("\n");
	const url = isBrowser ? window.location.href : "";

	return `${cocktail.name} - カクテルレシピ\n\n${cocktail.description}\n\n材料:\n${ingredientsText}\n\n作り方:\n${instructionsText}\n\n${url}`;
};

// クリップボードにコピー
export const copyToClipboard = async (cocktail: Cocktail): Promise<boolean> => {
	if (!isBrowser) {
		console.warn("ブラウザ環境ではありません");
		return false;
	}

	const shareText = createShareText(cocktail);

	try {
		await navigator.clipboard.writeText(shareText);
		return true;
	} catch (error) {
		console.error("クリップボードコピーエラー:", error);

		// フォールバック: 古いブラウザ対応
		try {
			const textArea = document.createElement("textarea");
			textArea.value = shareText;
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

/**
 * カクテル情報を共有する関数。
 * Web Share APIが利用可能ならそれを使用し、そうでなければクリップボードにコピーする。
 * @param cocktail 共有するカクテルオブジェクト
 * @returns クリップボードにコピーされた場合はtrue、されなかった場合はfalseを返す
 */
export const shareCocktail = async (cocktail: Cocktail): Promise<boolean> => {
	if (!isBrowser) {
		console.warn("ブラウザ環境ではありません");
		return false;
	}

	if (navigator.share) {
		try {
			await navigator.share({
				title: `${cocktail.name} - カクテルレシピ`,
				text: createShareText(cocktail),
				url: window.location.href,
			});
			return true; // Web Share APIは成功/失敗を返さないため、呼び出し成功とみなす
		} catch (error) {
			// ユーザーが共有をキャンセルした場合(AbortError)はエラーとしない
			if (error instanceof DOMException && error.name === "AbortError") {
				console.log("共有がキャンセルされました。");
				return false;
			}
			console.error("Web Share API エラー:", error);
			// Web Share APIが何らかの理由で失敗した場合は、フォールバックせずにエラーとする
			return false;
		}
	}
	// Web Share APIがサポートされていない場合はクリップボードにコピー
	return copyToClipboard(cocktail);
};
