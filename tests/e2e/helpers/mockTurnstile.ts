import type { Page } from "@playwright/test";

type TurnstileCallback = (token: string) => void;
type TurnstileOpts = Partial<{
	callback: TurnstileCallback;
	onSuccess: TurnstileCallback;
	"data-callback": TurnstileCallback;
}> &
	Record<string, unknown>;

interface TurnstileWidget {
	reset(): void;
	execute(): void;
}

declare global {
	interface Window {
		turnstile?: {
			render(el: HTMLElement | null, opts?: TurnstileOpts): TurnstileWidget;
			create(opts?: TurnstileOpts): TurnstileWidget;
			// Additional helpers used by wrappers/runtime
			getResponse?(widget?: unknown): string | undefined;
			getResponsePromise?(widget?: unknown): Promise<string | undefined>;
			isExpired?(widget?: unknown): boolean;
			remove?(widget?: unknown): void;
			ready?(fn: () => void): void;
		};
	}
}

export async function installMockTurnstile(page: Page) {
	await page.addInitScript(() => {
		const getCallback = (
			opts?: TurnstileOpts,
		): TurnstileCallback | undefined => {
			if (!opts) return undefined;
			const maybe = opts.callback ?? opts.onSuccess ?? opts["data-callback"];
			return typeof maybe === "function"
				? (maybe as TurnstileCallback)
				: undefined;
		};

		const __mockTurnstile = {
			render(el: HTMLElement | null, opts?: TurnstileOpts) {
				const cb = getCallback(opts);
				if (typeof cb === "function") setTimeout(() => cb("mock-token"), 0);
				return {
					reset() {},
					execute() {
						if (typeof cb === "function") cb("mock-token");
					},
				};
			},
			create(opts?: TurnstileOpts) {
				const cb = getCallback(opts);
				if (typeof cb === "function") setTimeout(() => cb("mock-token"), 0);
				return {
					reset() {},
					execute() {
						if (typeof cb === "function") cb("mock-token");
					},
				};
			},
			// Additional helpers expected by some wrappers
			getResponse(_widget?: unknown) {
				return "mock-token";
			},
			async getResponsePromise(_widget?: unknown) {
				return "mock-token";
			},
			isExpired(_widget?: unknown) {
				return false;
			},
			remove(_widget?: unknown) {
				// noop
			},
			ready(fn?: () => void) {
				try {
					if (typeof fn === "function") fn();
				} catch (e) {
					// ignore
				}
			},
		};

		Object.defineProperty(window, "turnstile", {
			value: __mockTurnstile as unknown as Window["turnstile"],
			writable: true,
			configurable: true,
		});
	});
}
