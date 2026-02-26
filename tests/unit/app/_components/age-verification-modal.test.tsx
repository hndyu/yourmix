import AgeVerificationModal from "@/app/_components/age-verification-modal";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("AgeVerificationModal", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	it("should not render if already verified", () => {
		localStorage.setItem("age-verified", "true");
		render(<AgeVerificationModal />);
		expect(
			screen.queryByTestId("age-verification-modal"),
		).not.toBeInTheDocument();
	});

	it("should render and handle agreement", () => {
		render(<AgeVerificationModal />);

		expect(screen.getByTestId("age-verification-modal")).toBeInTheDocument();
		expect(screen.getByTestId("age-verification-content")).toBeInTheDocument();

		const agreeButton = screen.getByTestId("age-agree-button");
		fireEvent.click(agreeButton);

		expect(localStorage.getItem("age-verified")).toBe("true");
		expect(
			screen.queryByTestId("age-verification-modal"),
		).not.toBeInTheDocument();
	});

	it("should show denied content when denied", () => {
		render(<AgeVerificationModal />);

		const denyButton = screen.getByTestId("age-deny-button");
		fireEvent.click(denyButton);

		expect(screen.getByTestId("age-denied-content")).toBeInTheDocument();
		expect(
			screen.queryByTestId("age-verification-content"),
		).not.toBeInTheDocument();

		const leaveButton = screen.getByTestId("leave-site-button");
		expect(leaveButton).toBeInTheDocument();

		// window.location.href mock is tricky in jsdom but we can check the button exists
	});
});
