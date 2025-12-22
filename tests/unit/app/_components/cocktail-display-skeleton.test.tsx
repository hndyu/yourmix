import CocktailDisplaySkeleton from "@/app/_components/cocktail-display-skeleton";
import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

describe("CocktailDisplaySkeleton", () => {
	it("renders the main container", () => {
		const { container } = render(<CocktailDisplaySkeleton />);
		// Check for the main container classes
		expect(container.querySelector(".w-full.max-w-5xl")).toBeInTheDocument();
		expect(
			container.querySelector(".bg-card.rounded-\\[32px\\]"),
		).toBeInTheDocument();
	});

	it("renders the image skeleton", () => {
		const { container } = render(<CocktailDisplaySkeleton />);
		// Check for image placeholder
		expect(container.querySelector(".aspect-\\[2\\/1\\]")).toBeInTheDocument();
	});

	it("renders the header skeleton section", () => {
		const { container } = render(<CocktailDisplaySkeleton />);
		// Check for header title/description placeholders
		expect(container.querySelector(".h-12.w-3\\/4")).toBeInTheDocument();
		expect(container.querySelector(".h-6.w-full")).toBeInTheDocument();
	});

	it("renders ingredient skeletons", () => {
		const { container } = render(<CocktailDisplaySkeleton />);
		// Check for 4 ingredient items (h-16 bg-muted/50)
		const ingredients = container.querySelectorAll(".h-16.bg-muted\\/50");
		expect(ingredients.length).toBeGreaterThanOrEqual(4);
	});

	it("renders instruction skeletons", () => {
		const { container } = render(<CocktailDisplaySkeleton />);
		// Check for 4 instruction items (flex gap-4 with w-8 h-8 rounded-full)
		// We can look for the circle skeleton in instructions
		const circles = container.querySelectorAll(".w-8.h-8.rounded-full");
		// There might be others, but specific to instructions loop
		expect(circles.length).toBeGreaterThanOrEqual(4);
	});
});
