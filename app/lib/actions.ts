export type ActionResponse<T = void> =
	| { success: true; data: T }
	| { success: false; error: string };

/**
 * Server Action内のエラーを安全にキャッチしてレスポンス型に変換するユーティリティ
 */
export async function createActionResponse<T>(
	fn: () => Promise<T>,
): Promise<ActionResponse<T>> {
	try {
		const data = await fn();
		return { success: true, data };
	} catch (error) {
		console.error("Action Error:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "予期せぬエラーが発生しました。",
		};
	}
}
