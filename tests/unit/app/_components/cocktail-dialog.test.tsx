import CocktailDialog from "@/app/_components/cocktail-dialog";
import type { GeneratedCocktail } from "@/app/types/cocktail";
import { render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

// Mock CocktailDisplay as it is complex and tested elsewhere
vi.mock("@/app/_components/cocktail-display", () => ({
	default: ({
		cocktail,
		titleId,
		descriptionId,
	}: {
		cocktail: { name: string; description: string };
		titleId: string;
		descriptionId: string;
	}) => (
		<div>
			<h2 id={titleId}>{cocktail.name}</h2>
			<p id={descriptionId}>{cocktail.description}</p>
		</div>
	),
}));

describe("CocktailDialog Component", () => {
	const mockCocktail: GeneratedCocktail = {
		name: "AIカクテル",
		description: "AIが考えたカクテルです。",
		ingredients: [
			{ name: "ジン", amount: "45ml" },
			{ name: "トニックウォーター", amount: "適量" },
		],
		instructions: ["混ぜる"],
	};

	it("renders when open is true", () => {
		render(
			<CocktailDialog cocktail={mockCocktail} open={true} onClose={vi.fn()} />,
		);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("AIカクテル")).toBeInTheDocument();
	});

	it("does not render when open is false", () => {
		render(
			<CocktailDialog cocktail={mockCocktail} open={false} onClose={vi.fn()} />,
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("calls onClose when Escape key is pressed", () => {
		const onClose = vi.fn();
		render(
			<CocktailDialog cocktail={mockCocktail} open={true} onClose={onClose} />,
		);

		const event = new KeyboardEvent("keydown", { key: "Escape" });
		document.dispatchEvent(event);

		expect(onClose).toHaveBeenCalled();
	});

	it("shifts focus to the close button upon mounting", async () => {
		render(
			<CocktailDialog cocktail={mockCocktail} open={true} onClose={vi.fn()} />,
		);

		await waitFor(() => {
			const closeButton = screen.getByRole("button", { name: "閉じる" });
			expect(document.activeElement).toBe(closeButton);
		});
	});

	it("restores focus to the previous element when closing", async () => {
		const onClose = vi.fn();
		// Create a button to hold focus initially
		const triggerButton = document.createElement("button");
		triggerButton.innerText = "Open Dialog";
		document.body.appendChild(triggerButton);
		triggerButton.focus();
		expect(document.activeElement).toBe(triggerButton);

		const { rerender } = render(
			<CocktailDialog cocktail={mockCocktail} open={true} onClose={onClose} />,
		);

		// Focus should move to dialog
		await waitFor(() => {
			const closeButton = screen.getByRole("button", { name: "閉じる" });
			expect(document.activeElement).toBe(closeButton);
		});

		// Close the dialog
		rerender(
			<CocktailDialog cocktail={mockCocktail} open={false} onClose={onClose} />,
		);

		// Focus should return to the trigger button
		expect(document.activeElement).toBe(triggerButton);

		document.body.removeChild(triggerButton);
	});
});
