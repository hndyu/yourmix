import { NoResults } from "@/app/_components/no-results";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("NoResults", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders nothing when show=false", () => {
		const { container } = render(<NoResults show={false} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders message when show=true", () => {
		render(<NoResults show={true} />);
		expect(
			screen.getByText("レシピが見つかりませんでした"),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/選択された材料の組み合わせではレシピが見つかりませんでした/,
			),
		).toBeInTheDocument();
	});

	it("renders reset button when onReset is provided", () => {
		const onReset = vi.fn();
		render(<NoResults show={true} onReset={onReset} />);

		const resetButton = screen.getByRole("button", {
			name: "選択をすべてクリア",
		});
		expect(resetButton).toBeInTheDocument();
	});

	it("calls onReset when reset button is clicked", async () => {
		const onReset = vi.fn();
		const user = userEvent.setup();
		render(<NoResults show={true} onReset={onReset} />);

		const resetButton = screen.getByRole("button", {
			name: "選択をすべてクリア",
		});
		await user.click(resetButton);

		expect(onReset).toHaveBeenCalledTimes(1);
	});

	it("does not render reset button when onReset is not provided", () => {
		render(<NoResults show={true} />);
		const resetButton = screen.queryByRole("button", {
			name: "選択をすべてクリア",
		});
		expect(resetButton).not.toBeInTheDocument();
	});
});
