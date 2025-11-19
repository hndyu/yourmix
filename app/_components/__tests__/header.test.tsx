import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "../header";

// next/navigation の usePathname をモック化
const usePathnameMock = vi.fn();
vi.mock("next/navigation", () => ({
	usePathname: () => usePathnameMock(),
}));

describe("Header Component", () => {
	it("常にアプリ名「YourMix」を表示する", () => {
		usePathnameMock.mockReturnValue("/");
		render(<Header />);
		// `getByText` を使用してテキストの存在を確認
		expect(screen.getByText("YourMix")).toBeInTheDocument();
	});

	it("アプリ名がルートパス「/」へのリンクになっている", () => {
		usePathnameMock.mockReturnValue("/some-page");
		render(<Header />);
		// `closest('a')` を使って、テキストがアンカータグ内にあることを確認
		const linkElement = screen.getByText("YourMix").closest("a");
		expect(linkElement).toHaveAttribute("href", "/");
	});

	describe("ホームページ (pathname: /) の場合", () => {
		it("アプリ名をh1要素としてレンダリングする", () => {
			usePathnameMock.mockReturnValue("/");
			render(<Header />);
			// `getByRole` を使用して h1 要素の存在を確認
			const headingElement = screen.getByRole("heading", { level: 1 });
			expect(headingElement).toBeInTheDocument();
			expect(headingElement).toHaveTextContent("YourMix");
		});
	});

	describe("ホームページ以外の場合", () => {
		it("アプリ名をh1要素としてレンダリングしない", () => {
			usePathnameMock.mockReturnValue("/recipes/1");
			render(<Header />);
			// `queryByRole` を使用して h1 要素が存在しないことを確認
			const headingElement = screen.queryByRole("heading", { level: 1 });
			expect(headingElement).not.toBeInTheDocument();

			// h1ではないが、テキストは表示されていることを確認
			const textElement = screen.getByText("YourMix");
			expect(textElement).toBeInTheDocument();
		});
	});
});
