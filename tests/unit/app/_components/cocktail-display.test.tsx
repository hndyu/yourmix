import CocktailDisplay from "@/app/_components/cocktail-display";
import type { Cocktail } from "@/app/types/cocktail";
import * as affiliateLinks from "@/app/utils/affiliate-links";
import * as shareUtils from "@/app/utils/share-utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/image
vi.mock("next/image", () => ({
	default: ({ src, alt }: { src: string; alt: string }) => (
		<img src={src} alt={alt} />
	),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

// Mock auth-client
vi.mock("@/lib/authClient", () => ({
	default: {
		useSession: () => ({
			data: null,
			isPending: false,
			error: null,
		}),
	},
}));

// Mock utils
vi.mock("@/app/utils/share-utils", () => ({
	canUseWebShare: vi.fn(),
	shareCocktail: vi.fn(),
}));

vi.mock("@/app/utils/affiliate-links", () => ({
	extractIngredientKeyword: vi.fn((name) => name),
	getAffiliateLink: vi.fn(),
}));

describe("CocktailDisplay Component", () => {
	const mockCocktail: Cocktail = {
		id: "1",
		slug: "test-cocktail",
		name: "テストカクテル",
		description: "これはテスト用のカクテルです。",
		imageUrl: "test.jpg", // Add image URL to test image rendering
		ingredients: [
			{
				id: 101,
				category: "スピリッツ",
				name: "ジン",
				amount: "45ml",
				description: "ジンの説明",
			},
			{
				id: 102,
				name: "トニックウォーター",
				category: "ソフトドリンク",
				amount: "Full up",
			},
		],
		instructions: [
			"グラスに氷を入れる",
			"ジンとトニックウォーターを注ぐ",
			"軽く混ぜる",
		],
		garnish: "ライムウェッジ",
		tags: [
			{ name: "さっぱり", description: "さっぱりした味わい" },
			{ name: "定番", description: "愛され続ける一杯" },
		],
	};

	beforeEach(() => {
		vi.mocked(shareUtils.canUseWebShare).mockReturnValue(true);
		vi.mocked(shareUtils.shareCocktail).mockResolvedValue(true);
		vi.mocked(affiliateLinks.getAffiliateLink).mockImplementation(
			(keyword) => `https://example.com/shop/${keyword}`,
		);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders basic cocktail information correctly", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);

		// Name and description
		expect(
			screen.getByRole("heading", { name: mockCocktail.name }),
		).toBeInTheDocument();
		expect(screen.getByText(mockCocktail.description)).toBeInTheDocument();

		// Tags
		expect(screen.getByText("さっぱり")).toBeInTheDocument();
		expect(screen.getByText("定番")).toBeInTheDocument();

		// Ingredients
		expect(screen.getByText("ジン")).toBeInTheDocument();
		expect(screen.getByText("45ml")).toBeInTheDocument();
		expect(screen.getByText("トニックウォーター")).toBeInTheDocument();
		expect(screen.getByText("Full up")).toBeInTheDocument();

		// Instructions
		// Note: The number "1" and text are in separate elements now
		expect(screen.getByText("グラスに氷を入れる")).toBeInTheDocument();
		expect(
			screen.getByText("ジンとトニックウォーターを注ぐ"),
		).toBeInTheDocument();
		expect(screen.getByText("軽く混ぜる")).toBeInTheDocument();

		// Garnish
		expect(
			screen.getByText(mockCocktail.garnish as string),
		).toBeInTheDocument();
	});

	it("renders as h1 when isDetailPage is true", () => {
		render(<CocktailDisplay cocktail={mockCocktail} isDetailPage />);
		const heading = screen.getByRole("heading", { level: 1 });
		expect(heading).toHaveTextContent(mockCocktail.name);
	});

	it("renders as h1 even when isDetailPage is false (changed in new design)", () => {
		// Just check it renders a heading with the name
		render(<CocktailDisplay cocktail={mockCocktail} />);
		const heading = screen.getByRole("heading", { name: mockCocktail.name });
		expect(heading).toBeInTheDocument();
	});

	it("calls shareCocktail when share button is clicked (Web Share API supported)", async () => {
		vi.mocked(shareUtils.canUseWebShare).mockReturnValue(true);
		render(<CocktailDisplay cocktail={mockCocktail} isDetailPage={true} />);

		const shareButton = screen.getByRole("button", { name: "共有" });
		await userEvent.click(shareButton);

		expect(shareUtils.shareCocktail).toHaveBeenCalledWith(mockCocktail);
	});

	it("calls shareCocktail and shows copy message when share button is clicked (Web Share API not supported)", async () => {
		vi.mocked(shareUtils.canUseWebShare).mockReturnValue(false);
		vi.mocked(shareUtils.shareCocktail).mockResolvedValue(true);

		render(<CocktailDisplay cocktail={mockCocktail} isDetailPage={true} />);

		const copyButton = screen.getByRole("button", { name: "コピー" });
		await userEvent.click(copyButton);

		expect(shareUtils.shareCocktail).toHaveBeenCalledWith(mockCocktail);

		await waitFor(() => {
			expect(screen.getByText("コピーしました!")).toBeInTheDocument();
		});
	});

	it("renders affiliate links correctly", () => {
		render(<CocktailDisplay cocktail={mockCocktail} isDetailPage />);

		const links = screen.getAllByRole("link", { name: /買う/i });
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveAttribute("href", "https://example.com/shop/ジン");
		expect(links[1]).toHaveAttribute(
			"href",
			"https://example.com/shop/トニックウォーター",
		);
	});

	it("does not render affiliate links when isDetailPage is false", () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);
		expect(
			screen.queryByRole("link", { name: /買う/i }),
		).not.toBeInTheDocument();
	});

	it("does not render garnish section if garnish is undefined", () => {
		const cocktailWithoutGarnish = { ...mockCocktail, garnish: undefined };
		render(<CocktailDisplay cocktail={cocktailWithoutGarnish} />);

		expect(screen.queryByText("Garnish")).not.toBeInTheDocument();
	});

	it("renders grouped ingredients correctly", () => {
		const cocktailWithGroups: Cocktail = {
			...mockCocktail,
			ingredients: [
				{
					id: 101,
					category: "スピリッツ",
					name: "ジン",
					amount: "45ml",
					option_group: 1,
				},
				{
					id: 102,
					category: "スピリッツ",
					name: "ウォッカ",
					amount: "45ml",
					option_group: 1,
				},
			],
		};
		render(<CocktailDisplay cocktail={cocktailWithGroups} />);

		expect(screen.getByText("ジン")).toBeInTheDocument();
		expect(screen.getByText("or")).toBeInTheDocument();
		expect(screen.getByText("ウォッカ")).toBeInTheDocument();
		expect(screen.getByText("45ml")).toBeInTheDocument();
	});

	it("toggles step completion when clicked", async () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);

		const firstStepButton = screen.getByRole("button", {
			name: /ステップ 1/,
		});
		expect(firstStepButton).toHaveAttribute("aria-pressed", "false");

		// Click to complete
		await userEvent.click(firstStepButton);
		expect(firstStepButton).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByText(/ステップ 1（完了）/)).toBeInTheDocument();

		// Click to uncomplete
		await userEvent.click(firstStepButton);
		expect(firstStepButton).toHaveAttribute("aria-pressed", "false");
		expect(screen.getByText(/ステップ 1（未完了）/)).toBeInTheDocument();
	});

	it("resets all steps when reset button is clicked", async () => {
		render(<CocktailDisplay cocktail={mockCocktail} />);

		const firstStepButton = screen.getByRole("button", {
			name: /ステップ 1/,
		});
		const secondStepButton = screen.getByRole("button", {
			name: /ステップ 2/,
		});

		// Complete two steps
		await userEvent.click(firstStepButton);
		await userEvent.click(secondStepButton);

		expect(firstStepButton).toHaveAttribute("aria-pressed", "true");
		expect(secondStepButton).toHaveAttribute("aria-pressed", "true");

		// Find and click reset button
		const resetButton = screen.getByRole("button", { name: "進捗をリセット" });
		await userEvent.click(resetButton);

		// Verify both steps are uncompleted
		expect(firstStepButton).toHaveAttribute("aria-pressed", "false");
		expect(secondStepButton).toHaveAttribute("aria-pressed", "false");

		// Reset button should disappear
		expect(
			screen.queryByRole("button", { name: "進捗をリセット" }),
		).not.toBeInTheDocument();
	});
});
