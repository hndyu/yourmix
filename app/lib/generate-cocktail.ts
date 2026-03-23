import { getDb } from "@/app/db/db";
import {
	categories,
	cocktailIngredients,
	cocktailTags,
	cocktails,
	deliciousLikes,
	ingredientGroups,
	ingredients,
	instructions,
	tags,
} from "@/app/db/schema";
import type { GeneratedCocktail } from "@/app/types/cocktail";
import { GoogleGenAI } from "@google/genai";

const schema = {
	cocktails,
	cocktailIngredients,
	cocktailTags,
	deliciousLikes,
	ingredients,
	tags,
	instructions,
	categories,
	ingredientGroups,
};

const getAiClient = () => {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("APIキーが設定されていません。");
	}
	return new GoogleGenAI({ apiKey });
};

const MODEL_FALLBACK_ORDER = [
	"gemini-3-pro-preview",
	"gemini-2.5-pro",
	"gemini-3-flash-preview",
	"gemini-2.5-flash",
	"gemini-2.5-flash-lite",
] as const;

const DEFAULT_MODEL_TIMEOUT_MS = 10_000;
const DEFAULT_TOTAL_TIMEOUT_MS = 60_000;

const parseTimeoutMs = (value: string | undefined, fallbackMs: number) => {
	if (!value) {
		return fallbackMs;
	}
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
};

const MODEL_TIMEOUT_MS = parseTimeoutMs(
	process.env.GEMINI_MODEL_TIMEOUT_MS,
	DEFAULT_MODEL_TIMEOUT_MS,
);
const TOTAL_TIMEOUT_MS = parseTimeoutMs(
	process.env.GEMINI_TOTAL_TIMEOUT_MS,
	DEFAULT_TOTAL_TIMEOUT_MS,
);

// ログ肥大化を避けるため、応答テキストは先頭のみを記録する
const truncateForLog = (text: string, maxLength = 1200) =>
	text.length > maxLength ? `${text.slice(0, maxLength)}...(truncated)` : text;

const createTimeoutError = (message: string) => {
	const error = new Error(message) as Error & { code?: string };
	error.name = "TimeoutError";
	error.code = "ETIMEDOUT";
	return error;
};

// Gemini SDK 呼び出しをAbortControllerで中断可能にし、タイムアウト時の待ち残りを抑える
const withAbortTimeout = async <T>(
	task: (abortSignal: AbortSignal) => Promise<T>,
	timeoutMs: number,
	message: string,
): Promise<T> => {
	const abortController = new AbortController();
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	let didTimeout = false;
	try {
		timeoutId = setTimeout(() => {
			didTimeout = true;
			abortController.abort();
		}, timeoutMs);
		return await task(abortController.signal);
	} catch (error) {
		if (didTimeout || abortController.signal.aborted) {
			throw createTimeoutError(message);
		}
		throw error;
	} finally {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	}
};

const extractStatusCode = (error: unknown): number | undefined => {
	if (!error || typeof error !== "object") {
		return undefined;
	}
	const status =
		"status" in error && typeof error.status === "number"
			? error.status
			: "code" in error && typeof error.code === "number"
				? error.code
				: undefined;
	if (status) {
		return status;
	}
	if ("message" in error && typeof error.message === "string") {
		const match = error.message.match(/\b(429|503)\b/);
		return match ? Number.parseInt(match[1], 10) : undefined;
	}
	return undefined;
};

const isTimeoutError = (error: unknown) => {
	if (!error || typeof error !== "object") {
		return false;
	}
	const name =
		"name" in error && typeof error.name === "string" ? error.name : "";
	const code =
		"code" in error && typeof error.code === "string" ? error.code : "";
	return (
		name === "TimeoutError" ||
		name === "AbortError" ||
		code === "ETIMEDOUT" ||
		code === "ABORT_ERR"
	);
};

const isRetryableGeminiError = (error: unknown) => {
	if (isTimeoutError(error)) {
		return true;
	}
	const status = extractStatusCode(error);
	return status === 429 || status === 503;
};

/**
 * 生成AIによるオリジナルカクテルを生成する
 */
export async function generateCocktailFromIngredients(
	selectedIngredients: string[],
): Promise<GeneratedCocktail> {
	if (!Array.isArray(selectedIngredients) || selectedIngredients.length === 0) {
		throw new Error("材料が指定されていません。");
	}

	const db = await getDb();

	// ⚡ Bolt: Use db.batch to consolidate independent validation queries into a single round-trip to D1.
	// Expected impact: Reduces total database-related latency by ~50%.
	const [validGroups, validIngredients] = await db.batch([
		// DBから有効な材料グループ名を取得 (descriptionも併せて取得して後のクエリを削減)
		db
			.select({
				displayName: schema.ingredientGroups.displayName,
				description: schema.ingredientGroups.description,
			})
			.from(schema.ingredientGroups),
		// DBから有効な材料名を取得
		db
			.select({ name: schema.ingredients.name })
			.from(schema.ingredients),
	]);

	// ⚡ Bolt: Use a Map for O(1) lookup of group descriptions
	// Expected impact: Eliminates sequential DB queries within the mapping loop.
	const groupDescriptionMap = new Map(
		validGroups.map((g) => [g.displayName, g.description]),
	);

	// ⚡ Bolt: Use a Set for O(1) ingredient validation
	// Prevents O(N * M) complexity where N is total ingredients and M is selected ingredients.
	const validIngredientNamesSet = new Set([
		...validGroups.map((g) => g.displayName),
		...validIngredients.map((i) => i.name),
	]);

	// 送信された材料名がすべて有効か検証
	for (const ingredient of selectedIngredients) {
		if (!validIngredientNamesSet.has(ingredient)) {
			throw new Error(`不正な材料名です: ${ingredient}`);
		}
	}

	// 材料リストを処理して、特定の材料名をより具体的な指示に置き換える
	// ⚡ Bolt: Optimized lookup using pre-calculated Map instead of sequential DB queries
	// Expected impact: Reduces O(M) sequential queries to O(M) synchronous lookups.
	const processedIngredients = selectedIngredients.map((ingredient) => {
		if (ingredient === "スピリッツ（その他）") {
			const description = groupDescriptionMap.get(ingredient);
			if (description) {
				return description;
			}
		}
		return ingredient;
	});

	const ai = getAiClient();
	const contents = `以下の材料をベースに、創造性に溢れ、かつ味のバランスが完璧に整ったオリジナルのカクテルレシピを1つ考案してください。

材料: ${processedIngredients.join("、")}

## ガイドライン:
1. **味の構成**: ベース、酸味、甘味、苦味、そして香りのレイヤーを深く考慮してください。
2. **ネーミング**: カクテルのコンセプトを象徴する、洗練された印象的な名前を付けてください。
3. **説明文**: バーのメニューに相応しい、飲む人の期待を高める情緒的で魅力的な説明文を作成してください。
4. **手順**: プロの技術に基づいた、明確で再現性の高いステップを記述してください。
5. **用語**: カジュアル層がターゲットのため、専門用語は避けてください。
6. **言語**: 日本人向けに書いてください。基本的にはアルファベットではなくカタカナ表記が推奨されます。`;

	const config = {
		responseMimeType: "application/json",
		responseJsonSchema: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "カクテルの名前",
				},
				description: {
					type: "string",
					description: "カクテルの説明文",
				},
				ingredients: {
					type: "array",
					items: {
						type: "object",
						properties: {
							name: {
								type: "string",
								description: "材料の名前",
							},
							amount: {
								type: "string",
								description: "材料の分量",
							},
						},
						required: ["name", "amount"],
					},
				},
				instructions: {
					type: "array",
					items: {
						type: "string",
						description: "カクテルの作り方の手順",
					},
				},
				garnish: {
					type: "string",
					description: "カクテルの飾り",
				},
			},
			required: ["name", "description", "ingredients", "instructions"],
		},
	} as const;

	let response:
		| Awaited<ReturnType<typeof ai.models.generateContent>>
		| undefined;
	let lastRetryableError: unknown;
	const startedAt = Date.now();

	for (const model of MODEL_FALLBACK_ORDER) {
		const elapsedMs = Date.now() - startedAt;
		const remainingTotalMs = TOTAL_TIMEOUT_MS - elapsedMs;
		if (remainingTotalMs <= 0) {
			lastRetryableError = createTimeoutError(
				`Gemini request exceeded total timeout (${TOTAL_TIMEOUT_MS}ms).`,
			);
			break;
		}
		const attemptTimeoutMs = Math.min(MODEL_TIMEOUT_MS, remainingTotalMs);

		try {
			response = await withAbortTimeout(
				(abortSignal) =>
					ai.models.generateContent({
						model,
						contents,
						config: {
							...config,
							abortSignal,
						},
					}),
				attemptTimeoutMs,
				`Gemini model "${model}" timed out after ${attemptTimeoutMs}ms.`,
			);
			break;
		} catch (error) {
			if (!isRetryableGeminiError(error)) {
				throw error;
			}
			lastRetryableError = error;
			console.warn(
				"Gemini request failed with retryable reason. Trying next model.",
				{
					model,
					status: extractStatusCode(error),
					isTimeout: isTimeoutError(error),
					attemptTimeoutMs,
					elapsedMs: Date.now() - startedAt,
				},
			);
		}
	}

	if (!response) {
		console.error("All fallback Gemini models failed with retryable reason.", {
			models: MODEL_FALLBACK_ORDER,
			lastStatus: extractStatusCode(lastRetryableError),
			lastErrorName:
				lastRetryableError &&
				typeof lastRetryableError === "object" &&
				"name" in lastRetryableError &&
				typeof lastRetryableError.name === "string"
					? lastRetryableError.name
					: undefined,
			totalTimeoutMs: TOTAL_TIMEOUT_MS,
		});
		throw new Error(
			"AIモデルが混雑、または応答遅延しています。時間をおいて再度お試しください。",
		);
	}

	const responseText = response.text;
	if (!responseText) {
		console.error("Gemini response text is empty", {
			candidateCount: response.candidates?.length ?? 0,
			finishReasons: response.candidates?.map(
				(candidate) => candidate.finishReason,
			),
			promptFeedback: response.promptFeedback,
		});
		throw new Error("AIからの応答が空です。");
	}

	try {
		const parsed = JSON.parse(responseText) as GeneratedCocktail;
		return parsed;
	} catch (error) {
		console.error("Failed to process Gemini response:", {
			error,
			responseText: truncateForLog(responseText),
			candidateCount: response.candidates?.length ?? 0,
			finishReasons: response.candidates?.map(
				(candidate) => candidate.finishReason,
			),
			promptFeedback: response.promptFeedback,
		});
		throw new Error("AIからの応答を処理できませんでした。");
	}
}
