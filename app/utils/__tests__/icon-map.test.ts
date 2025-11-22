import { describe, it, expect } from "vitest";
import { iconMap, DefaultIcon } from "../icon-map";
import {
	HelpOutline,
	Liquor,
	LocalBar,
	LocalDrink,
	Restaurant,
	WineBar,
} from "@mui/icons-material";

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
			expect(iconMap.WineBar).toBe(WineBar);
			expect(iconMap.Liquor).toBe(Liquor);
			expect(iconMap.LocalBar).toBe(LocalBar);
			expect(iconMap.LocalDrink).toBe(LocalDrink);
			expect(iconMap.Restaurant).toBe(Restaurant);
		});
	});

	describe("DefaultIcon", () => {
		it("DefaultIconがHelpOutlineコンポーネントである", () => {
			expect(DefaultIcon).toBe(HelpOutline);
		});
	});
});
