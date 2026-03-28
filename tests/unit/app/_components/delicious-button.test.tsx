import DeliciousButton from "@/app/_components/delicious-button";
import authClient from "@/app/lib/authClient";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock auth-client
vi.mock("@/app/lib/authClient", () => ({
	default: {
		useSession: vi.fn(),
	},
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

// Mock toggleLikeAction
vi.mock("../actions/likes", () => ({
	toggleLikeAction: vi.fn(),
}));

describe("DeliciousButton", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("shows login modal when unauthenticated user clicks", async () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		const user = userEvent.setup();
		render(
			<DeliciousButton
				cocktailId="test-id"
				initialCount={5}
				initialIsLiked={false}
			/>,
		);

		const button = screen.getByRole("button", { name: /おいしい！/ });
		await user.click(button);

		const modal = screen.getByRole("dialog");
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveAttribute("aria-modal", "true");
		expect(screen.getByText("ログインが必要です")).toBeInTheDocument();
	});

	it("closes login modal when close button is clicked", async () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		const user = userEvent.setup();
		render(
			<DeliciousButton
				cocktailId="test-id"
				initialCount={5}
				initialIsLiked={false}
			/>,
		);

		await user.click(screen.getByRole("button", { name: /おいしい！/ }));
		expect(screen.queryByRole("dialog")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "閉じる" }));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("closes login modal when Escape key is pressed", async () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		const user = userEvent.setup();
		render(
			<DeliciousButton
				cocktailId="test-id"
				initialCount={5}
				initialIsLiked={false}
			/>,
		);

		await user.click(screen.getByRole("button", { name: /おいしい！/ }));
		expect(screen.queryByRole("dialog")).toBeInTheDocument();

		fireEvent.keyDown(window, { key: "Escape" });
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
