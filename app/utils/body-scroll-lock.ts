let bodyScrollLockCount = 0;
let previousBodyOverflow: string | null = null;

/**
 * body のスクロールをロックする。
 *
 * - 入れ子モーダルでも正しく動くように参照カウントで管理する
 * - 解除時は「最初にロックする前の overflow 値」を復元する
 */
export function lockBodyScroll() {
	// RSC/SSR など document が無い環境では何もしない
	if (typeof document === "undefined") {
		return () => {};
	}

	const body = document.body;

	// 最初のロック時にのみ元の値を保存する
	if (bodyScrollLockCount === 0) {
		previousBodyOverflow = body.style.overflow;
	}

	bodyScrollLockCount += 1;
	body.style.overflow = "hidden";

	return () => {
		if (typeof document === "undefined") return;
		if (bodyScrollLockCount === 0) return;

		bodyScrollLockCount -= 1;
		if (bodyScrollLockCount === 0) {
			document.body.style.overflow = previousBodyOverflow ?? "";
			previousBodyOverflow = null;
		}
	};
}
