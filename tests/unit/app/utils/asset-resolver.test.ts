import { DefaultIcon, iconMap, resolveAsset } from "@/app/utils/asset-resolver";
import {
	BottleWine,
	CupSoda,
	HelpCircle,
	Martini,
	Utensils,
	Wine,
} from "lucide-react";
import { describe, expect, it } from "vitest";

describe("asset-resolver", () => {
	describe("iconMap", () => {
		it("期待されるすべてのアイコンキーを含んでいる", () => {
			const expectedKeys = [
				"Wine",
				"BottleWine",
				"Martini",
				"CupSoda",
				"Utensils",
			];
			expect(Object.keys(iconMap)).toEqual(
				expect.arrayContaining(expectedKeys),
			);
			expect(Object.keys(iconMap).length).toBe(expectedKeys.length);
		});

		it("各キーに正しいアイコンコンポーネントがマッピングされている", () => {
			expect(iconMap.Wine).toBe(Wine);
			expect(iconMap.BottleWine).toBe(BottleWine);
			expect(iconMap.Martini).toBe(Martini);
			expect(iconMap.CupSoda).toBe(CupSoda);
			expect(iconMap.Utensils).toBe(Utensils);
		});
	});

	describe("DefaultIcon", () => {
		it("DefaultIconがHelpCircleコンポーネントである", () => {
			expect(DefaultIcon).toBe(HelpCircle);
		});
	});

	describe("resolveAsset", () => {
		it("有効なアイコンキーに対してアイコン型を返す", () => {
			const result = resolveAsset("Wine");
			expect(result).toEqual({ type: "icon", value: Wine });
		});

		it("アイコンマップにないキーに対して画像型を返す", () => {
			const result = resolveAsset("gin");
			expect(result).toEqual({
				type: "image",
				value: "/ingredient-groups/gin.avif",
			});
		});

		it("null または undefined に対してデフォルトアイコンを返す", () => {
			expect(resolveAsset(null)).toEqual({ type: "icon", value: HelpCircle });
			expect(resolveAsset(undefined)).toEqual({
				type: "icon",
				value: HelpCircle,
			});
			expect(resolveAsset("")).toEqual({ type: "icon", value: HelpCircle });
		});
	});
});
