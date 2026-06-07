import NotFound, { metadata } from "@/app/not-found";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

describe("NotFound Page", () => {
	describe("metadata", () => {
		it("should have the correct title and description", () => {
			expect(metadata.title).toEqual({
				absolute: "ページが見つかりません | YourMix",
			});
			expect(metadata.description).toBe(
				"お探しのページは見つかりませんでした。URLが正しいかご確認ください。",
			);
		});
	});

	describe("NotFound component", () => {
		it("should render the not found message and a link to the home page", () => {
			render(<NotFound />);

			expect(
				screen.getByRole("heading", { name: /404 - ページが見つかりません/ }),
			).toBeInTheDocument();

			expect(
				screen.getByText(
					/お探しのページは移動または削除された可能性があります。/,
				),
			).toBeInTheDocument();

			const linkButton = screen.getByRole("link", {
				name: "トップページに戻る",
			});
			expect(linkButton).toBeInTheDocument();
			expect(linkButton).toHaveAttribute("href", "/");
		});
	});
});
