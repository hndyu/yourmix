import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignInPage from "@/app/auth/sign-in/page";
import * as authClient from "@/lib/auth-client";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
	}),
}));

// Mock auth-client
vi.mock("@/lib/auth-client", () => ({
	signIn: {
		email: vi.fn(),
	},
}));

describe("SignInPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders all form fields", () => {
		render(<SignInPage />);
		expect(screen.getByTestId("email-input")).toBeInTheDocument();
		expect(screen.getByTestId("password-input")).toBeInTheDocument();
		expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
	});

	it("handles successful sign in", async () => {
		const signInMock = vi.spyOn(authClient.signIn, "email").mockImplementation(
			async (
				data,
				options,
			): Promise<{
				data: typeof data;
				error: null;
			}> => {
				options?.onSuccess?.({
					data: {
						user: {
							id: "1",
							email: data.email,
							emailVerified: true,
							name: "Test User",
							createdAt: new Date(),
							updatedAt: new Date(),
							image: null,
						},
						session: {
							id: "1",
							userId: "1",
							token: "token",
							expiresAt: new Date(),
							ipAddress: "127.0.0.1",
							userAgent: "user-agent",
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					},
					request: new Request("https://example.com"),
					response: new Response(),
				});
				return {
					data: {
						email: data.email,
						password: data.password,
					},
					error: null,
				};
			},
		);

		render(<SignInPage />);

		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByTestId("sign-in-button"));

		await waitFor(() => {
			expect(signInMock).toHaveBeenCalledWith(
				{
					email: "test@example.com",
					password: "password123",
				},
				expect.any(Object),
			);
			expect(pushMock).toHaveBeenCalledWith("/");
		});
	});

	it("handles sign in error", async () => {
		const signInMock = vi
			.spyOn(authClient.signIn, "email")
			.mockImplementation(async (data, options) => {
				const ctx = {
					error: {
						code: "API_ERROR",
						message: "Invalid credentials",
					},
				};
				// @ts-ignore
				options?.onError?.(ctx);
				return {
					data: null,
					error: ctx.error,
				};
			});

		render(<SignInPage />);

		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "wrong@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "wrongpass" },
		});

		fireEvent.click(screen.getByTestId("sign-in-button"));

		await waitFor(() => {
			expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
			expect(pushMock).not.toHaveBeenCalled();
		});
	});
});
