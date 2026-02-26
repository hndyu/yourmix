import {
	BottleWine,
	CupSoda,
	HelpCircle,
	Martini,
	Utensils,
	Wine,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * アイコンのマッピング定義
 */
export const iconMap: Record<
	string,
	ComponentType<{ size?: number | string; className?: string }>
> = {
	Wine: Wine,
	BottleWine: BottleWine,
	Martini: Martini,
	CupSoda: CupSoda,
	Utensils: Utensils,
};

export const DefaultIcon = HelpCircle;

/**
 * 解決されたアセットの型
 */
type ResolvedAsset =
	| {
			type: "icon";
			value: ComponentType<{ size?: number | string; className?: string }>;
	  }
	| { type: "image"; value: string };

/**
 * assetKey からアイコンまたは画像パスを解決する
 * @param key DBに保存されている assetKey
 * @returns 解決されたアセット情報
 */
export function resolveAsset(key: string | null | undefined): ResolvedAsset {
	if (!key) {
		return { type: "icon", value: DefaultIcon };
	}

	// 1. アイコンマップにあるか確認
	if (iconMap[key]) {
		return { type: "icon", value: iconMap[key] };
	}

	// 2. 画像パスとして解決（現状は /ingredient-groups/ 下にあると仮定）
	// 将来的には、キーのプレフィックスなどで判別することも可能
	return { type: "image", value: `/ingredient-groups/${key}.avif` };
}
