import AuthControls from "@/app/_components/auth-controls";
import authClient from "@/app/lib/authClient";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock auth-client
vi.mock("@/app/lib/authClient", () => ({
	default: {
		useSession: vi.fn(),
		signOut: vi.fn(),
	},
}));

type User = typeof authClient.$Infer.Session.user;

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
		refresh: mockRefresh,
	}),
	usePathname: () => "/",
}));

describe("AuthControls", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("shows loading spinner when session is pending", () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: true,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		const { container } = render(<AuthControls />);
		// Look for spinner class
		expect(container.querySelector(".animate-spin")).toBeInTheDocument();
	});

	it("shows login/signup buttons when not authenticated", () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		render(<AuthControls />);

		expect(screen.getByRole("link", { name: "ログイン" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /アカウント登録/ }),
		).toBeInTheDocument();
	});

	it("shows user avatar when authenticated", () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				user: {
					id: "1",
					name: "Test User",
					email: "test@example.com",
					image: "test-image.jpg",
					emailVerified: true,
					createdAt: new Date(),
					updatedAt: new Date(),
					twoFactorEnabled: false,
				} as unknown as User,
				session: {
					id: "session-1",
					userId: "1",
					expiresAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
					ipAddress: "",
					userAgent: "",
					token: "",
				},
			},
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		render(<AuthControls />);

		// Avatar button (User menu)
		const userButton = screen.getByLabelText("ユーザーメニュー");
		expect(userButton).toBeInTheDocument();
		expect(userButton).toHaveAttribute("aria-controls", "user-menu");
		expect(userButton).toHaveAttribute("aria-expanded", "false");

		// Image inside
		const img = screen.getByAltText("Test User");
		expect(img).toHaveAttribute("src", "test-image.jpg");
	});

	it("opens menu and shows user info when avatar is clicked", async () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				user: {
					id: "1",
					name: "Test User",
					email: "test@example.com",
					emailVerified: true,
					createdAt: new Date(),
					updatedAt: new Date(),
					twoFactorEnabled: false,
					image: null,
				} as unknown as User,
				session: {
					id: "session-1",
					userId: "1",
					expiresAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
					ipAddress: "",
					userAgent: "",
					token: "",
				},
			},
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		const user = userEvent.setup();
		render(<AuthControls />);

		const userButton = screen.getByLabelText("ユーザーメニュー");
		expect(userButton).toHaveAttribute("aria-expanded", "false");

		await user.click(userButton);
		expect(userButton).toHaveAttribute("aria-expanded", "true");

		expect(screen.getByText("Test User")).toBeInTheDocument();
		expect(screen.getByText("test@example.com")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "マイページ" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "ログアウト" }),
		).toBeInTheDocument();
	});

	it("handles logout", async () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				user: {
					id: "1",
					name: "Test User",
					email: "test@example.com",
					emailVerified: true,
					createdAt: new Date(),
					updatedAt: new Date(),
					twoFactorEnabled: false,
					image: null,
				} as unknown as User,
				session: {
					id: "session-1",
					userId: "1",
					expiresAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
					ipAddress: "",
					userAgent: "",
					token: "",
				},
			},
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: vi.fn(),
		});

		const user = userEvent.setup();
		render(<AuthControls />);

		// Open menu
		await user.click(screen.getByLabelText("ユーザーメニュー"));

		// Click logout
		await user.click(screen.getByRole("button", { name: "ログアウト" }));

		expect(authClient.signOut).toHaveBeenCalled();
		expect(mockRefresh).toHaveBeenCalled();
	});
});
