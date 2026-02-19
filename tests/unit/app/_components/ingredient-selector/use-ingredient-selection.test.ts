import { useIngredientSelection } from "@/app/_components/ingredient-selector/use-ingredient-selection";
import type { Ingredient } from "@/app/types/cocktail";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock Ingredient Data
const mockIngredients: Ingredient[] = [
	{
		id: 10,
		name: "Gin",
		category: "Spirits",
		actualNames: ["Gin", "Bombay Sapphire", "Tanqueray"],
		actualIds: [100, 101, 102],
		actualDetails: [
			{ id: 100, name: "Gin" },
			{ id: 101, name: "Bombay Sapphire" },
			{ id: 102, name: "Tanqueray" },
		],
	},
	{
		id: 20,
		name: "Lime",
		category: "Fruits",
		actualNames: ["Lime", "Lime Juice"],
		actualIds: [200, 201],
		actualDetails: [
			{ id: 200, name: "Lime" },
			{ id: 201, name: "Lime Juice" },
		],
	},
	// Simple groups for counting test
	{
		id: 30,
		name: "A",
		category: "Test",
		actualNames: [],
		actualIds: [30],
		actualDetails: [],
	},
	{
		id: 40,
		name: "B",
		category: "Test",
		actualNames: [],
		actualIds: [40],
		actualDetails: [],
	},
	{
		id: 50,
		name: "C",
		category: "Test",
		actualNames: [],
		actualIds: [50],
		actualDetails: [],
	},
	{
		id: 60,
		name: "D",
		category: "Test",
		actualNames: [],
		actualIds: [60],
		actualDetails: [],
	},
	{
		id: 70,
		name: "E",
		category: "Test",
		actualNames: [],
		actualIds: [70],
		actualDetails: [],
	},
	// Rum group with Rum detail
	{
		id: 80,
		name: "Rum",
		category: "Spirits",
		actualNames: ["Rum", "White Rum"],
		actualIds: [800, 801],
		actualDetails: [
			{ id: 800, name: "Rum" },
			{ id: 801, name: "White Rum" },
		],
	},
];

describe("useIngredientSelection", () => {
	it("should select a group correctly", () => {
		const onIngredientsChange = vi.fn();
		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				selectedIngredientIds: [],
				selectedIngredientNames: [],
				onIngredientsChange,
			}),
		);

		const group = mockIngredients[0]; // Gin
		result.current.toggleGroup(group);

		expect(onIngredientsChange).toHaveBeenCalledWith([100, 101, 102], ["Gin"]);
	});

	it("should deselect a group correctly", () => {
		const onIngredientsChange = vi.fn();
		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				selectedIngredientIds: [100, 101, 102],
				selectedIngredientNames: ["Gin"],
				onIngredientsChange,
			}),
		);

		const group = mockIngredients[0]; // Gin
		result.current.toggleGroup(group);

		expect(onIngredientsChange).toHaveBeenCalledWith([], []);
	});

	it("should select a detail correctly", () => {
		const onIngredientsChange = vi.fn();
		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				selectedIngredientIds: [],
				selectedIngredientNames: [],
				onIngredientsChange,
			}),
		);

		const group = mockIngredients[0]; // Gin
		result.current.toggleDetail(group, "Bombay Sapphire");

		expect(onIngredientsChange).toHaveBeenCalledWith(
			[101],
			["Bombay Sapphire"],
		);
	});

	it("should switch from group to detail", () => {
		const onIngredientsChange = vi.fn();
		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				selectedIngredientIds: [100, 101, 102],
				selectedIngredientNames: ["Gin"],
				onIngredientsChange,
			}),
		);

		const group = mockIngredients[0]; // Gin
		result.current.toggleDetail(group, "Tanqueray");

		// Should remove "Gin" (group) and add "Tanqueray"
		expect(onIngredientsChange).toHaveBeenCalledWith([102], ["Tanqueray"]);
	});

	it("should switch from detail to group", () => {
		const onIngredientsChange = vi.fn();
		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				selectedIngredientIds: [101],
				selectedIngredientNames: ["Bombay Sapphire"],
				onIngredientsChange,
			}),
		);

		const group = mockIngredients[0]; // Gin
		result.current.toggleGroup(group);

		// Should remove "Bombay Sapphire" and add "Gin" (group)
		expect(onIngredientsChange).toHaveBeenCalledWith([100, 101, 102], ["Gin"]);
	});

	it("should limit selection to 5", () => {
		const onIngredientsChange = vi.fn();
		const currentNames = ["A", "B", "C", "D", "E"];

		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				selectedIngredientIds: [30, 40, 50, 60, 70],
				selectedIngredientNames: currentNames,
				onIngredientsChange,
				maxSelectionCount: 5,
			}),
		);

		const group = mockIngredients[0]; // Gin
		const res = result.current.toggleGroup(group);

		expect(res).toEqual({ success: false, reason: "LIMIT_REACHED" });
		expect(onIngredientsChange).not.toHaveBeenCalled();
	});

	it("should switch from group to detail when detail name equals group name", () => {
		const onIngredientsChange = vi.fn();
		// Setup: Rum Group is selected
		const group = mockIngredients[7]; // Rum (id 80)

		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				// Group Selected: All IDs present, Group Name present
				selectedIngredientIds: [800, 801],
				selectedIngredientNames: ["Rum"],
				onIngredientsChange,
			}),
		);

		// Toggle "Rum" detail (which has same name as group)
		result.current.toggleDetail(group, "Rum");

		// Expected: Should be "Rum" detail ONLY.
		// ID: [800] (Rum detail ID)
		// Name: ["Rum"]

		// If the bug exists, it might deselect "Rum" completely or do something else.
		expect(onIngredientsChange).toHaveBeenCalledWith([800], ["Rum"]);
	});

	it("should allow selecting multiple details even if one has same name as group", () => {
		const onIngredientsChange = vi.fn();
		const group = mockIngredients[7]; // Rum (id 80)

		const { result } = renderHook(() =>
			useIngredientSelection({
				allIngredients: mockIngredients,
				// Detail "Rum" Selected. Group "Rum" NOT fully selected.
				selectedIngredientIds: [800],
				selectedIngredientNames: ["Rum"],
				onIngredientsChange,
			}),
		);

		// Toggle "White Rum" detail
		result.current.toggleDetail(group, "White Rum");

		// Expected: Both "Rum" and "White Rum" selected.
		// IDs: [800, 801]
		// Names: ["Rum", "White Rum"]
		expect(onIngredientsChange).toHaveBeenCalledWith(
			[800, 801],
			["Rum", "White Rum"],
		);
	});
});
