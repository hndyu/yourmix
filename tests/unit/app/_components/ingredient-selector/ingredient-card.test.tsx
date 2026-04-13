import IngredientCard from "@/app/_components/ingredient-selector/ingredient-card";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

describe("IngredientCard", () => {
	const mockIngredient = {
		id: 1,
		name: "Test Ingredient",
		category: "Test Category",
		categoryName: "Test Category",
		description: "Test Description",
		actualNames: ["Detail 1", "Detail 2"],
		actualIds: [100, 101],
		actualDetails: [
			{ id: 100, name: "Detail 1" },
			{ id: 101, name: "Detail 2" },
		],
	};

	const defaultProps = {
		ingredient: mockIngredient,
		isSelected: false,
		selectedDetailNames: [],
		onToggle: vi.fn(),
		onDetailToggle: vi.fn(),
		disabled: false,
	};

	it("renders basic info correctly", () => {
		render(<IngredientCard {...defaultProps} />);

		expect(screen.getByText("Test Ingredient")).toBeInTheDocument();
		expect(screen.getByText("Test Description")).toBeInTheDocument();
	});

	it("shows checkmark when selected", () => {
		const { container } = render(
			<IngredientCard {...defaultProps} isSelected={true} />,
		);

		// Check visual indicator logic
		// Check element with CheckCircleIcon. The parent div should have bg-primary.
		// We can find by class or other means.
		// The check icon wrapper:
		// className={`... ${isSelected ? "bg-primary ..." ...}`}
		// Let's assume there's one logic path for selected.

		// Since we removed 'Mui' classes, we rely on tailwind classes.
		// We can find the card container.
		const titleButtons = screen.getAllByRole("button");
		const mainButton = titleButtons[0];
		// Cannot easily check class of an internal div inside button unless we use selector.

		expect(mainButton).toBeInTheDocument();
		// Maybe check if the card is visually "active".
		// The card wrapper (parent of mainButton) has bg-stone-900 border-primary/50
		const cardWrapper = mainButton.parentElement;
		expect(cardWrapper?.className).toContain("border-primary/50");
	});

	it("calls onToggle when main area is clicked", async () => {
		const onToggle = vi.fn();
		const user = userEvent.setup();
		render(<IngredientCard {...defaultProps} onToggle={onToggle} />);

		// The first button is the main card button
		const mainButton = screen.getAllByRole("button")[0];
		await user.click(mainButton);
		expect(onToggle).toHaveBeenCalledWith(mockIngredient);
	});

	it("does not expand details by default", () => {
		render(<IngredientCard {...defaultProps} />);
		expect(screen.queryByText("Detail 1")).not.toBeInTheDocument();
	});

	it("expands details when expand button is clicked", async () => {
		const user = userEvent.setup();
		render(<IngredientCard {...defaultProps} />);

		const expandButton = screen.getByText(/銘柄・詳細/);
		await user.click(expandButton);

		expect(screen.getByText("Detail 1")).toBeInTheDocument();
		expect(screen.getByText("Detail 2")).toBeInTheDocument();
	});

	it("calls onDetailToggle when a detail is clicked", async () => {
		const onDetailToggle = vi.fn();
		const user = userEvent.setup();
		render(
			<IngredientCard {...defaultProps} onDetailToggle={onDetailToggle} />,
		);

		// Expand first
		await user.click(screen.getByText(/銘柄・詳細/));

		// Click detail
		await user.click(screen.getByRole("button", { name: /Detail 1/ }));
		expect(onDetailToggle).toHaveBeenCalledWith(mockIngredient, "Detail 1");
	});

	it("displays number of selected details", () => {
		render(
			<IngredientCard {...defaultProps} selectedDetailNames={["Detail 1"]} />,
		);
		expect(screen.getByText("1 選択中")).toBeInTheDocument();
	});
});
