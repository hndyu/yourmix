// 共有機能のユーティリティ関数

// Web Share APIを使用した共有
export const shareViaWebShare = async (cocktail: any) => {
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
			fallbackShare(cocktail);
		}
	} else {
		// Web Share APIがサポートされていない場合
		fallbackShare(cocktail);
	}
};

// X（Twitter）での共有
export const shareViaTwitter = (cocktail: any) => {
	const text = `${cocktail.name} - カクテルレシピ\n${cocktail.description}\n\n#カクテル #レシピ #${cocktail.name.replace(/\s+/g, "")}`;
	const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
	window.open(url, "_blank", "width=600,height=400");
};

// クリップボードにコピー
export const copyToClipboard = async (cocktail: any) => {
	const shareText = `${cocktail.name} - カクテルレシピ\n\n${cocktail.description}\n\n材料:\n${cocktail.ingredients.join("\n")}\n\n作り方:\n${cocktail.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join("\n")}\n\n${window.location.href}`;

	try {
		await navigator.clipboard.writeText(shareText);
		return true;
	} catch (error) {
		console.error("クリップボードコピーエラー:", error);
		return false;
	}
};

// フォールバック共有（Web Share APIが失敗した場合）
const fallbackShare = (cocktail: any) => {
	// モバイルの場合はX共有、デスクトップの場合はクリップボードコピー
	if (window.innerWidth <= 768) {
		shareViaTwitter(cocktail);
	} else {
		copyToClipboard(cocktail);
	}
};
