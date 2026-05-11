import { Toast } from "@/app/_components/ui/toast";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
	AlertTriangle: () => <div data-testid="icon-warning" />,
	CheckCircle: () => <div data-testid="icon-success" />,
	Info: () => <div data-testid="icon-info" />,
	XCircle: () => <div data-testid="icon-error" />,
	X: () => <div data-testid="icon-close" />,
}));

describe("Toast Component", () => {
	it("renders the message when open is true", () => {
		render(
			<Toast
				open={true}
				message="Test Message"
				severity="info"
				onClose={() => {}}
			/>,
		);

		expect(screen.getByText("Test Message")).toBeInTheDocument();
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("does not render when open is false", () => {
		render(
			<Toast
				open={false}
				message="Test Message"
				severity="info"
				onClose={() => {}}
			/>,
		);

		expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
	});

	it("calls onClose when the close button is clicked", async () => {
		const handleClose = vi.fn();
		render(
			<Toast
				open={true}
				message="Test Message"
				severity="info"
				onClose={handleClose}
			/>,
		);

		const closeButton = screen.getByRole("button", { name: "閉じる" });
		await userEvent.click(closeButton);

		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it("renders the correct icon based on severity", () => {
		const { rerender } = render(
			<Toast
				open={true}
				message="Success"
				severity="success"
				onClose={() => {}}
			/>,
		);
		expect(screen.getByTestId("icon-success")).toBeInTheDocument();

		rerender(
			<Toast
				open={true}
				message="Warning"
				severity="warning"
				onClose={() => {}}
			/>,
		);
		expect(screen.getByTestId("icon-warning")).toBeInTheDocument();

		rerender(
			<Toast open={true} message="Error" severity="error" onClose={() => {}} />,
		);
		expect(screen.getByTestId("icon-error")).toBeInTheDocument();
	});
});
