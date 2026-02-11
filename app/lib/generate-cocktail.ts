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
import type { Cocktail } from "@/app/types/cocktail";
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

// Gemmaの出力に混ざるコードフェンスや説明文を取り除いてJSON部分だけ抽出する
const sanitizeGemmaResponse = (text: string) => {
	let cleaned = text.trim();
	cleaned = cleaned
		.replace(/```(?:json)?\s*/gi, "")
		.replace(/```/g, "")
		.trim();

	const firstBracket = cleaned.indexOf("[");
	const lastBracket = cleaned.lastIndexOf("]");
	if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
		return cleaned.slice(firstBracket, lastBracket + 1).trim();
	}

	const firstBrace = cleaned.indexOf("{");
	const lastBrace = cleaned.lastIndexOf("}");
	if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
		return cleaned.slice(firstBrace, lastBrace + 1).trim();
	}

	return cleaned;
};

const getAiClient = () => {
	const apiKey = process.env.GEMMA_API_KEY;
	if (!apiKey) {
		throw new Error("APIキーが設定されていません。");
	}
	return new GoogleGenAI({ apiKey });
};

/**
 * 生成AIによるオリジナルカクテルを生成する
 */
export async function generateCocktailFromIngredients(
	selectedIngredients: string[],
): Promise<Cocktail> {
	if (!Array.isArray(selectedIngredients) || selectedIngredients.length === 0) {
		throw new Error("材料が指定されていません。");
	}

	const db = await getDb();

	// ⚡ Bolt: Parallelize independent DB calls to reduce total latency
	// Expected impact: Saves one sequential DB round-trip.
	const [validGroups, validIngredients] = await Promise.all([
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
	const response = await ai.models.generateContent({
		model: "gemma-3-27b-it",
		contents: `あなたは世界的に評価の高いプロのミクソロジストです。
以下の材料をベースに、創造性に溢れ、かつ味のバランスが完璧に整ったオリジナルのカクテルレシピを1つ考案してください。

材料: ${processedIngredients.join("、")}

## 出力形式:
- 必ず**JSONのみ**を返してください（前後に説明文・コードフェンス・余計な文字列を付けない）
- トップレベルは配列で、要素は1つだけ
- JSONスキーマは以下に準拠
[
  {
    "name": "string",
    "description": "string",
    "ingredients": [
      { "name": "string", "amount": "string" }
    ],
    "instructions": ["string"],
    "garnish": "string"
  }
]

## ガイドライン:
1. **味の構成**: ベース、酸味、甘味、苦味、そして香りのレイヤーを深く考慮してください。
2. **ネーミング**: カクテルのコンセプトを象徴する、洗練された印象的な名前を付けてください。
3. **説明文**: バーのメニューに相応しい、飲む人の期待を高める情緒的で魅力的な説明文を作成してください。
4. **手順**: プロの技術に基づいた、明確で再現性の高いステップを記述してください。
5. **用語**: カジュアル層がターゲットのため、専門用語は避けてください。
6. **言語**: 日本人向けに書いてください。基本的にはアルファベットではなくカタカナ表記が推奨されます。`,
	});

	const responseText = sanitizeGemmaResponse(response.text ?? "");
	if (!responseText) {
		throw new Error("AIからの応答が空です。");
	}

	try {
		const parsed = JSON.parse(responseText);
		// 配列か単一オブジェクトかを判定し、どちらでも安全に取り扱う
		const cocktailData = Array.isArray(parsed)
			? (parsed[0] as Cocktail | undefined)
			: (parsed as Cocktail | null);
		if (!cocktailData) {
			throw new Error("AIからの応答が配列でもオブジェクトでもありません。");
		}
		return cocktailData;
	} catch (error) {
		console.error("Failed to parse Gemma response:", response.text);
		throw new Error("AIからの応答を解析できませんでした。");
	}
}
