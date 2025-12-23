import { DefaultIcon, iconMap } from "@/app/utils/icon-map";
import {
	Beer,
	CupSoda,
	HelpCircle,
	Martini,
	Utensils,
	Wine,
} from "lucide-react";
import { describe, expect, it } from "vitest";

describe("icon-map", () => {
	describe("iconMap", () => {
		it("期待されるすべてのアイコンキーを含んでいる", () => {
			const expectedKeys = [
				"WineBar",
				"Liquor",
				"LocalBar",
				"LocalDrink",
				"Restaurant",
			];
			expect(Object.keys(iconMap)).toEqual(
				expect.arrayContaining(expectedKeys),
			);
			expect(Object.keys(iconMap).length).toBe(expectedKeys.length);
		});

		it("各キーに正しいアイコンコンポーネントがマッピングされている", () => {
			expect(iconMap.WineBar).toBe(Wine);
			expect(iconMap.Liquor).toBe(Beer);
			expect(iconMap.LocalBar).toBe(Martini);
			expect(iconMap.LocalDrink).toBe(CupSoda);
			expect(iconMap.Restaurant).toBe(Utensils);
		});
	});

	describe("DefaultIcon", () => {
		it("DefaultIconがHelpCircleコンポーネントである", () => {
			expect(DefaultIcon).toBe(HelpCircle);
		});
	});
});
