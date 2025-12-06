import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MixButton from "@/app/_components/mix-button";

describe("MixButton", () => {
	it("should render the button with 'Mix!' text by default", () => {
		const handleClick = vi.fn();
		render(<MixButton onClick={handleClick} />);

		const button = screen.getByRole("button", { name: /mix!/i });
		expect(button).toBeInTheDocument();
		expect(button).not.toBeDisabled();
	});

	it("should call onClick handler when clicked", () => {
		const handleClick = vi.fn();
		render(<MixButton onClick={handleClick} />);

		const button = screen.getByRole("button", { name: /mix!/i });
		fireEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should be disabled when the disabled prop is true", () => {
		const handleClick = vi.fn();
		render(<MixButton onClick={handleClick} disabled />);

		const button = screen.getByRole("button", { name: /mix!/i });
		expect(button).toBeDisabled();
	});

	it("should not call onClick handler when disabled", () => {
		const handleClick = vi.fn();
		render(<MixButton onClick={handleClick} disabled />);

		const button = screen.getByRole("button", { name: /mix!/i });
		fireEvent.click(button);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it("should show loading state and be disabled when isLoading is true", () => {
		const handleClick = vi.fn();
		render(<MixButton onClick={handleClick} isLoading />);

		const button = screen.getByRole("button", { name: /mixing.../i });
		expect(button).toBeInTheDocument();
		expect(button).toBeDisabled();

		// CircularProgressの存在も確認
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
	});

	it("should not call onClick handler when loading", () => {
		const handleClick = vi.fn();
		render(<MixButton onClick={handleClick} isLoading />);

		const button = screen.getByRole("button", { name: /mixing.../i });
		fireEvent.click(button);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it("should be disabled if both disabled and isLoading are true", () => {
		const handleClick = vi.fn();
		render(<MixButton onClick={handleClick} disabled isLoading />);

		const button = screen.getByRole("button", { name: /mixing.../i });
		expect(button).toBeDisabled();

		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});
});
