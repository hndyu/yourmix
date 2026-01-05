import authClient from "@/app/lib/authClient";
import MyPage from "@/app/my-page/page";
import type { BetterFetchError } from "@better-fetch/fetch";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
const pushMock = vi.fn();
const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
		refresh: refreshMock,
	}),
	redirect: (url: string) => {
		throw new Error(`Redirect to ${url}`);
	},
}));

// Mock auth-client
vi.mock("@/app/lib/authClient", () => ({
	default: {
		useSession: vi.fn(),
		listAccounts: vi.fn(),
		changePassword: vi.fn(),
		signOut: vi.fn(),
		twoFactor: {
			enable: vi.fn(),
			disable: vi.fn(),
			verifyTotp: vi.fn(),
		},
		lastLoginMethodClient: vi.fn(),
		twoFactorClient: vi.fn(),
	},
}));

// Mock qrcode.react
vi.mock("qrcode.react", () => ({
	QRCodeSVG: () => <div data-testid="qr-code">QR Code</div>,
}));

// Mock fetch
global.fetch = vi.fn();

type Session = {
	user: {
		id: string;
		name: string;
		email: string;
		twoFactorEnabled: boolean | null | undefined;
		createdAt: Date;
		updatedAt: Date;
		emailVerified: boolean;
		image?: string | null;
	};
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		token: string;
		createdAt: Date;
		updatedAt: Date;
	};
};

type UseSessionReturn = {
	data: Session | null;
	isPending: boolean;
	isRefetching: boolean;
	error: BetterFetchError | null;
	refetch: ReturnType<typeof vi.fn>;
};

type AuthResponse<T = unknown> = {
	data: T;
	error: { message?: string } | null;
};

describe("MyPage", () => {
	const mockSession = {
		data: {
			user: {
				id: "user-1",
				name: "Test User",
				email: "test@example.com",
				twoFactorEnabled: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				emailVerified: true,
			},
			session: {
				id: "session-1",
				userId: "user-1",
				expiresAt: new Date(),
				token: "token-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
		isPending: false,
		isRefetching: false,
		error: null,
		refetch: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(authClient.useSession).mockReturnValue(
			mockSession as unknown as UseSessionReturn,
		);
		vi.mocked(authClient.listAccounts).mockResolvedValue({
			data: [{ providerId: "credential" }],
		} as AuthResponse<{ providerId: string }[]>);
	});

	it("renders user information correctly", async () => {
		render(<MyPage />);

		expect(screen.getByText("マイページ")).toBeInTheDocument();
		expect(screen.getByText("Test User")).toBeInTheDocument();
		expect(screen.getByText("test@example.com")).toBeInTheDocument();
	});

	it("redirects to sign-in if no session", async () => {
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
			refetch: vi.fn(),
		} as unknown as UseSessionReturn);

		render(<MyPage />);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith(
				"/auth/sign-in?callbackUrl=/my-page",
			);
		});
	});

	it("handles profile update", async () => {
		vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);

		render(<MyPage />);

		fireEvent.click(screen.getByText("編集"));

		const nameInput = screen.getByPlaceholderText("お名前");
		const emailInput = screen.getByPlaceholderText("メールアドレス");

		fireEvent.change(nameInput, { target: { value: "Updated Name" } });
		fireEvent.change(emailInput, { target: { value: "updated@example.com" } });

		fireEvent.click(screen.getByText("保存する"));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				"/api/user",
				expect.objectContaining({
					method: "PATCH",
					body: JSON.stringify({
						name: "Updated Name",
						email: "updated@example.com",
					}),
				}),
			);
			expect(
				screen.getByText("プロフィールが更新されました。"),
			).toBeInTheDocument();
		});
	});

	it("handles 2FA enablement flow", async () => {
		vi.mocked(authClient.twoFactor.enable).mockResolvedValueOnce({
			data: {
				totpURI: "otpauth://totp/Test?secret=ABC",
				backupCodes: ["code1", "code2"],
			},
			error: null,
		} as AuthResponse<{ totpURI: string; backupCodes: string[] }>);

		vi.mocked(authClient.twoFactor.verifyTotp).mockResolvedValueOnce({
			data: { user: { twoFactorEnabled: true } },
			error: null,
		} as AuthResponse<{ user: { twoFactorEnabled: boolean } }>);

		render(<MyPage />);

		// 1. Click Enable (the one in the security section)
		const enableButtons = await screen.findAllByText("有効にする");
		fireEvent.click(enableButtons[0]);

		// 2. Enter password
		const passwordInput = screen.getByPlaceholderText("パスワード");
		fireEvent.change(passwordInput, { target: { value: "password123" } });
		fireEvent.click(screen.getByText("確認"));

		await waitFor(() => {
			expect(authClient.twoFactor.enable).toHaveBeenCalledWith({
				password: "password123",
			});
			expect(screen.getByTestId("qr-code")).toBeInTheDocument();
		});

		// 3. Enter 2FA code
		const codeInput = screen.getByPlaceholderText("000000");
		fireEvent.change(codeInput, { target: { value: "123456" } });

		// Click the Enable button in the dialog
		const dialogEnableButton = screen
			.getAllByText("有効にする")
			.find((btn) => btn.closest(".fixed"));
		if (dialogEnableButton) {
			fireEvent.click(dialogEnableButton);
		} else {
			// Fallback if structure changes
			fireEvent.click(screen.getAllByText("有効にする")[1]);
		}

		await waitFor(() => {
			expect(authClient.twoFactor.verifyTotp).toHaveBeenCalledWith({
				code: "123456",
			});
			expect(
				screen.getByText(/2要素認証が有効になりました/),
			).toBeInTheDocument();
			expect(screen.getByText("code1")).toBeInTheDocument();
			expect(screen.getByText("code2")).toBeInTheDocument();
		});
	});

	it("handles 2FA disablement", async () => {
		const sessionWith2FA = {
			...mockSession,
			data: {
				...mockSession.data,
				user: { ...mockSession.data.user, twoFactorEnabled: true },
			},
		};
		vi.mocked(authClient.useSession).mockReturnValue(
			sessionWith2FA as unknown as UseSessionReturn,
		);
		vi.mocked(authClient.twoFactor.disable).mockResolvedValueOnce({
			error: null,
		} as AuthResponse<null>);

		render(<MyPage />);

		const disableButton = await screen.findByText("無効にする");
		fireEvent.click(disableButton);

		const passwordInput = screen.getByPlaceholderText("パスワード");
		fireEvent.change(passwordInput, { target: { value: "password123" } });
		fireEvent.click(screen.getByText("確認"));

		await waitFor(() => {
			expect(authClient.twoFactor.disable).toHaveBeenCalledWith({
				password: "password123",
			});
			expect(
				screen.getByText("2要素認証を無効にしました。"),
			).toBeInTheDocument();
		});
	});

	it("handles password change", async () => {
		vi.mocked(authClient.changePassword).mockResolvedValueOnce({
			error: null,
		} as AuthResponse<null>);

		render(<MyPage />);

		const changePasswordButton = await screen.findByText("パスワードを変更");
		fireEvent.click(changePasswordButton);

		fireEvent.change(screen.getByPlaceholderText("現在のパスワード"), {
			target: { value: "old-pass" },
		});
		fireEvent.change(
			screen.getByPlaceholderText("新しいパスワード（8文字以上）"),
			{ target: { value: "new-password" } },
		);
		fireEvent.change(screen.getByPlaceholderText("新しいパスワード（確認）"), {
			target: { value: "new-password" },
		});

		fireEvent.click(screen.getByText("更新する"));

		await waitFor(() => {
			expect(authClient.changePassword).toHaveBeenCalledWith({
				currentPassword: "old-pass",
				newPassword: "new-password",
				revokeOtherSessions: true,
			});
			expect(
				screen.getByText("パスワードが正常に更新されました。"),
			).toBeInTheDocument();
		});
	});

	it("handles account deletion", async () => {
		vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
		vi.mocked(authClient.signOut).mockResolvedValueOnce(
			{} as AuthResponse<null>,
		);

		render(<MyPage />);

		fireEvent.click(screen.getByText("アカウントを削除"));
		fireEvent.click(screen.getByText("削除する"));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				"/api/user",
				expect.objectContaining({ method: "DELETE" }),
			);
			expect(
				screen.getByText("アカウントが削除されました。"),
			).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText("閉じる"));

		await waitFor(() => {
			expect(authClient.signOut).toHaveBeenCalled();
			expect(pushMock).toHaveBeenCalledWith("/");
		});
	});
});
