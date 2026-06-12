import CustomError from "@/app/error";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("CustomError", () => {
	const mockError = new Error("Test error");
	const mockReset = vi.fn();

	// console.errorをモック化して、テスト中にエラーログが出力されないようにする
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.mocked(console.error).mockRestore();
		mockReset.mockClear();
	});

	// Mock Lucide icons
	vi.mock("lucide-react", () => ({
		AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
		Martini: () => <div data-testid="martini-icon" />,
		RotateCcw: () => <div data-testid="rotate-ccw-icon" />,
	}));

	it("エラーメッセージと再試行ボタンが正しくレンダリングされる", () => {
		render(<CustomError error={mockError} reset={mockReset} />);

		expect(
			screen.getByRole("heading", { name: /予期せぬエラーが発生しました/ }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/ご迷惑をおかけしております。/),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "再試行" })).toBeInTheDocument();
	});

	it("useEffect内でdocument.titleが設定される", () => {
		render(<CustomError error={mockError} reset={mockReset} />);
		expect(document.title).toBe("エラーが発生しました");
	});

	it("useEffect内でconsole.errorが呼び出される", () => {
		render(<CustomError error={mockError} reset={mockReset} />);
		expect(console.error).toHaveBeenCalledWith(mockError);
	});

	it("再試行ボタンをクリックするとreset関数が呼び出される", async () => {
		const user = userEvent.setup();
		render(<CustomError error={mockError} reset={mockReset} />);

		const retryButton = screen.getByRole("button", { name: "再試行" });
		await user.click(retryButton);

		expect(mockReset).toHaveBeenCalledTimes(1);
	});
});
