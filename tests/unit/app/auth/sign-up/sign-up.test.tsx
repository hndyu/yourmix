import SignUpPage from "@/app/auth/sign-up/page";
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
		signUp: {
			email: vi.fn(),
		},
		signIn: {
			social: vi.fn(),
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

describe("SignUpPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders all form fields", () => {
		render(<SignUpPage />);
		expect(screen.getByTestId("name-input")).toBeInTheDocument();
		expect(screen.getByTestId("email-input")).toBeInTheDocument();
		expect(screen.getByTestId("password-input")).toBeInTheDocument();
		expect(screen.getByTestId("sign-up-button")).toBeInTheDocument();
	});

	it("shows a dialog when trying to sign up without agreeing to the terms", async () => {
		render(<SignUpPage />);

		fireEvent.change(screen.getByTestId("name-input"), {
			target: { value: "Test User" },
		});
		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByTestId("sign-up-button"));

		await waitFor(() => {
			expect(
				screen.getByText("登録には利用規約への同意が必要です"),
			).toBeInTheDocument();
		});

		expect(vi.mocked(authClient.signUp.email)).not.toHaveBeenCalled();
		expect(pushMock).not.toHaveBeenCalled();
	});

	it("handles successful sign up when terms are agreed", async () => {
		vi.mocked(authClient.signUp.email).mockImplementation(
			async (data, options) => {
				// 非同期で成功を解決
				await Promise.resolve();
				options?.onSuccess?.({
					data: {
						user: {
							id: "1",
							email: data.email,
							emailVerified: true,
							name: data.name,
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
						name: data.name,
						image: undefined,
					},
					error: null,
				};
			},
		);

		render(<SignUpPage />);

		fireEvent.change(screen.getByTestId("name-input"), {
			target: { value: "Test User" },
		});
		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "password123" },
		});

		// Click the checkbox to agree to the terms
		fireEvent.click(screen.getByTestId("terms-agreement-checkbox"));

		fireEvent.click(screen.getByTestId("turnstile-mock"));

		fireEvent.click(screen.getByTestId("sign-up-button"));

		await waitFor(() => {
			expect(vi.mocked(authClient.signUp.email)).toHaveBeenCalledWith(
				{
					email: "test@example.com",
					password: "password123",
					name: "Test User",
				},
				expect.any(Object),
			);
			expect(pushMock).toHaveBeenCalledWith("/");
		});
	});

	it("handles sign up error", async () => {
		vi.mocked(authClient.signUp.email).mockImplementation(
			async (data, options) => {
				const ctx = {
					error: {
						code: "API_ERROR",
						message: "User already exists",
						status: 400, // ダミーの値
						statusText: "Bad Request", // ダミーの値
						name: "BetterFetchError", // ダミーの値
						error: new Error("Original Error"), // ダミーのErrorオブジェクト
					},
					response: new Response(),
					request: new Request("http://localhost"),
				};
				// 非同期でエラーを解決
				await Promise.resolve();
				options?.onError?.(ctx);
				return {
					data: null,
					error: ctx.error,
				};
			},
		);

		render(<SignUpPage />);

		fireEvent.change(screen.getByTestId("name-input"), {
			target: { value: "Test User" },
		});
		fireEvent.change(screen.getByTestId("email-input"), {
			target: { value: "existing@example.com" },
		});
		fireEvent.change(screen.getByTestId("password-input"), {
			target: { value: "password123" },
		});

		// Click the checkbox to agree to the terms
		fireEvent.click(screen.getByTestId("terms-agreement-checkbox"));

		fireEvent.click(screen.getByTestId("turnstile-mock"));

		fireEvent.click(screen.getByTestId("sign-up-button"));

		await waitFor(() => {
			expect(screen.getByText("User already exists")).toBeInTheDocument();
			expect(pushMock).not.toHaveBeenCalled();
		});
	});
});
