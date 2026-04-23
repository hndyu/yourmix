## 2025-04-04 - Search Keyboard Shortcuts & Visual Hints
**Learning:** Modern web users expect quick navigation. A '/' keyboard shortcut for search is a powerful power-user feature. Discoverability is key; a subtle `<kbd>` hint that disappears on focus/input provides an intuitive way to teach users about the shortcut without cluttering the UI. Setting `type="search"` and `aria-keyshortcuts="/"` ensures standard behavior and accessibility.
**Action:** When implementing a primary search input, always include a global keyboard shortcut (usually '/') and a conditional visual hint to improve efficiency and discoverability.

## 2026-04-06 - [Dropdown Keyboard Navigation & Accessible Status Indicators]
**Learning:** Dropdown menus should always be dismissible via the 'Escape' key to meet user expectations for keyboard navigation. For persistent loading indicators like spinners, using a 'div' with 'role="status"' and an internal 'sr-only' span for text provides a robust and accessible way to inform screen readers of ongoing processes without cluttering the visual UI or misusing transient elements like '<output>'.
**Action:** Implement global 'Escape' key listeners for all custom dropdown/modal components and use 'role="status"' for persistent loading states.

## 2025-05-15 - [Icon-only Button Accessibility]
**Learning:** Icon-only buttons, such as password visibility toggles, need explicit focus-visible styles (e.g., `focus-visible:text-primary`) to be clearly identifiable during keyboard navigation.
**Action:** Always include focus-visible utility classes for icon-only buttons to enhance accessibility.

## 2025-05-15 - [Button Component A11y & Robustness]
**Learning:** Shared UI components like `Button` should proactively manage accessibility and common pitfalls. Adding `aria-busy` when in a loading state provides immediate feedback to assistive technologies. Setting a default `type="button"` is critical in React/Next.js to prevent unintended form submissions, as the browser default is `submit`.
**Action:** Always include `aria-busy` for loading states and ensure `type="button"` is the default for generic button components unless explicitly overridden.

## 2025-05-20 - [Modal Focus Management & Contextual ARIA Labels]
**Learning:** For a truly accessible modal experience, focus management must handle two phases: 1) shifting focus to a sensible default (like the close button) when the modal opens to avoid leaving the keyboard focus on the background, and 2) restoring focus to the triggering element when the modal closes. Additionally, using contextual ARIA labels (e.g., "完成したオリジナルカクテルを見る" instead of just "見る") significantly improves navigation for screen reader users by providing clear intent.
**Action:** Implement focus trapping and restoration for all modals using `useRef` to store the previous active element. Use descriptive, action-oriented ARIA labels for buttons that carry specific context.
