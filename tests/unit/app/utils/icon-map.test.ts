import { describe, it, expect } from "vitest";
import { iconMap, DefaultIcon } from "@/app/utils/icon-map";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Liquor from "@mui/icons-material/Liquor";
import LocalBar from "@mui/icons-material/LocalBar";
import LocalDrink from "@mui/icons-material/LocalDrink";
import Restaurant from "@mui/icons-material/Restaurant";
import WineBar from "@mui/icons-material/WineBar";

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
