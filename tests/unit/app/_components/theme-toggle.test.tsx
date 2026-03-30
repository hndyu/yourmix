import { ThemeToggle } from "@/app/_components/theme-toggle";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import type { UseThemeProps } from "next-themes";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-themes", () => ({
	useTheme: vi.fn(),
}));

describe("ThemeToggle", () => {
	it("renders correctly and toggles theme", async () => {
		const setTheme = vi.fn();
		vi.mocked(useTheme).mockReturnValue({
			resolvedTheme: "light",
			setTheme,
			themes: ["light", "dark"],
			theme: "light",
		} as UseThemeProps);

		render(<ThemeToggle />);

		// After mounting
		const button = screen.getByRole("button", {
			name: "ダークモードに切り替え",
		});
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("title", "ダークモードに切り替え");

		// light theme should show moon icon (to switch to dark)
		// but the code says: {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
		// so if light, it shows Moon.
		expect(button.querySelector("svg")).toBeInTheDocument();

		fireEvent.click(button);
		expect(setTheme).toHaveBeenCalledWith("dark");
	});

	it("switches theme from dark to light", () => {
		const setTheme = vi.fn();
		vi.mocked(useTheme).mockReturnValue({
			resolvedTheme: "dark",
			setTheme,
			themes: ["light", "dark"],
			theme: "dark",
		} as UseThemeProps);

		render(<ThemeToggle />);

		const button = screen.getByRole("button", {
			name: "ライトモードに切り替え",
		});
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("title", "ライトモードに切り替え");

		fireEvent.click(button);
		expect(setTheme).toHaveBeenCalledWith("light");
	});
});
