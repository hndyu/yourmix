import IngredientSearch from "@/app/_components/ingredient-selector/ingredient-search";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

describe("IngredientSearch", () => {
	const defaultProps = {
		value: "",
		onChange: vi.fn(),
	};

	it("renders correctly", () => {
		render(<IngredientSearch {...defaultProps} />);
		expect(screen.getByPlaceholderText("材料名で検索...")).toBeInTheDocument();
	});

	it("calls onChange when typing", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(<IngredientSearch {...defaultProps} onChange={onChange} />);

		const input = screen.getByPlaceholderText("材料名で検索...");
		await user.type(input, "gin");

		expect(onChange).toHaveBeenCalled();
	});

	it("focuses input when '/' key is pressed", async () => {
		render(<IngredientSearch {...defaultProps} />);
		const input = screen.getByPlaceholderText("材料名で検索...");

		expect(input).not.toHaveFocus();

		fireEvent.keyDown(window, { key: "/" });

		expect(input).toHaveFocus();
	});

	it("does not focus input when '/' is pressed and another input is focused", async () => {
		render(
			<>
				<input data-testid="other-input" />
				<IngredientSearch {...defaultProps} />
			</>,
		);
		const otherInput = screen.getByTestId("other-input");
		const searchInput = screen.getByPlaceholderText("材料名で検索...");

		otherInput.focus();
		expect(otherInput).toHaveFocus();

		fireEvent.keyDown(window, { key: "/" });

		expect(otherInput).toHaveFocus();
		expect(searchInput).not.toHaveFocus();
	});

	it("shows kbd hint when empty and not focused", () => {
		render(<IngredientSearch {...defaultProps} />);
		const kbd = screen.getByText("/");
		expect(kbd).toBeInTheDocument();
		expect(kbd.closest("div")).not.toHaveClass("hidden");
	});

	it("hides kbd hint when focused", async () => {
		const user = userEvent.setup();
		render(<IngredientSearch {...defaultProps} />);
		const input = screen.getByPlaceholderText("材料名で検索...");

		await user.click(input);

		expect(input).toHaveFocus();
		expect(screen.queryByText("/")).not.toBeInTheDocument();
	});

	it("hides kbd hint when value is present", () => {
		render(<IngredientSearch {...defaultProps} value="gin" />);
		expect(screen.queryByText("/")).not.toBeInTheDocument();
	});

	it("shows clear button when value is present", () => {
		render(<IngredientSearch {...defaultProps} value="gin" />);
		expect(
			screen.getByRole("button", { name: "検索をクリア" }),
		).toBeInTheDocument();
	});

	it("calls onChange with empty string when clear button is clicked", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(
			<IngredientSearch {...defaultProps} value="gin" onChange={onChange} />,
		);

		const clearButton = screen.getByRole("button", { name: "検索をクリア" });
		await user.click(clearButton);

		expect(onChange).toHaveBeenCalledWith("");
	});

	it("clears search value when Escape is pressed", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(
			<IngredientSearch {...defaultProps} value="gin" onChange={onChange} />,
		);

		const input = screen.getByPlaceholderText("材料名で検索...");
		await user.type(input, "{Escape}");

		expect(onChange).toHaveBeenCalledWith("");
	});

	it("blurs input when Escape is pressed and value is empty", async () => {
		const user = userEvent.setup();
		render(<IngredientSearch {...defaultProps} />);

		const input = screen.getByPlaceholderText("材料名で検索...");
		input.focus();
		expect(input).toHaveFocus();

		await user.type(input, "{Escape}");

		expect(input).not.toHaveFocus();
	});
});
