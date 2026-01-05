import SignInPage from "@/app/auth/sign-in/page";
import authClient from "@/app/lib/authClient";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
	}),
	useSearchParams: () => ({
		get: () => null,
	}),
}));

// Mock auth-client
vi.mock("@/app/lib/authClient", () => ({
	default: {
		signIn: {
			email: vi.fn(),
			social: vi.fn(),
		},
		twoFactor: {
			verifyTotp: vi.fn(),
			verifyBackupCode: vi.fn(),
		},
		getLastUsedLoginMethod: vi.fn(() => null),
	},
}));

vi.mock("@marsidev/react-turnstile", () => ({
	Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => (
		<button
			type="button"
			data-testid="turnstile-mock"
			onClick={() => onSuccess("mock-token")}
		>
			Turnstile
		</button>
	),
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
		vi.mocked(authClient.signIn.email).mockImplementation(
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

		fireEvent.click(screen.getByTestId("turnstile-mock"));

		fireEvent.click(screen.getByTestId("sign-in-button"));

		await waitFor(() => {
			expect(vi.mocked(authClient.signIn.email)).toHaveBeenCalledWith(
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
		vi.mocked(authClient.signIn.email).mockImplementation(
			async (data, options) => {
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
			},
		);

		render(<SignInPage />);

		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "wrong@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "wrongpass" },
		});

		fireEvent.click(screen.getByTestId("turnstile-mock"));

		fireEvent.click(screen.getByTestId("sign-in-button"));

		await waitFor(() => {
			expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
			expect(pushMock).not.toHaveBeenCalled();
		});
	});

	it("handles 2FA requirement", async () => {
		vi.mocked(authClient.signIn.email).mockImplementation(
			async (data, options) => {
				const ctx = {
					data: { twoFactorRedirect: true },
				};
				// @ts-ignore
				options?.onSuccess?.(ctx);
				return { data: ctx.data, error: null };
			},
		);

		vi.mocked(authClient.twoFactor.verifyTotp).mockImplementation(
			async (data, options) => {
				options?.onSuccess?.({
					data: {
						user: {
							id: "1",
							email: "test@example.com",
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
					// @ts-ignore
				});
				return { data: {}, error: null };
			},
		);

		render(<SignInPage />);

		// Initial sign in
		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByTestId("turnstile-mock"));
		fireEvent.click(screen.getByTestId("sign-in-button"));

		// Should show 2FA form
		await waitFor(() => {
			expect(screen.getByText("2要素認証")).toBeInTheDocument();
			expect(screen.getByLabelText("認証コード")).toBeInTheDocument();
		});

		// Submit 2FA code
		fireEvent.change(screen.getByLabelText("認証コード"), {
			target: { value: "123456" },
		});
		fireEvent.click(screen.getByText("認証してログイン"));

		await waitFor(() => {
			expect(authClient.twoFactor.verifyTotp).toHaveBeenCalledWith(
				{ code: "123456", trustDevice: false },
				expect.any(Object),
			);
			expect(pushMock).toHaveBeenCalledWith("/");
		});
	});

	it("handles backup code verification", async () => {
		vi.mocked(authClient.signIn.email).mockImplementation(
			async (data, options) => {
				const ctx = {
					data: { twoFactorRedirect: true },
					request: new Request("https://example.com"),
					response: new Response(),
				};
				// @ts-ignore
				options?.onSuccess?.(ctx);
				return { data: ctx.data, error: null };
			},
		);

		vi.mocked(authClient.twoFactor.verifyBackupCode).mockImplementation(
			async (data, options) => {
				options?.onSuccess?.({
					data: {
						user: {
							id: "1",
							email: "test@example.com",
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
					// @ts-ignore
				});
				return { data: {}, error: null };
			},
		);

		render(<SignInPage />);

		// Fill inputs
		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "password123" },
		});

		// Trigger 2FA
		fireEvent.click(screen.getByTestId("turnstile-mock"));
		fireEvent.click(screen.getByTestId("sign-in-button"));

		await waitFor(() => {
			expect(screen.getByText("2要素認証")).toBeInTheDocument();
		});

		// Switch to backup code mode
		fireEvent.click(screen.getByText("バックアップコードを使用する"));

		expect(screen.getByLabelText("バックアップコード")).toBeInTheDocument();

		// Submit backup code
		fireEvent.change(screen.getByLabelText("バックアップコード"), {
			target: { value: "ABCDEFGH" },
		});
		fireEvent.click(screen.getByText("認証してログイン"));

		await waitFor(() => {
			expect(authClient.twoFactor.verifyBackupCode).toHaveBeenCalledWith(
				{ code: "ABCDEFGH" },
				expect.any(Object),
			);
			expect(pushMock).toHaveBeenCalledWith("/");
		});
	});
});
