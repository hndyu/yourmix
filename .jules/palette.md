## 2025-04-04 - Search Keyboard Shortcuts & Visual Hints
**Learning:** Modern web users expect quick navigation. A '/' keyboard shortcut for search is a powerful power-user feature. Discoverability is key; a subtle `<kbd>` hint that disappears on focus/input provides an intuitive way to teach users about the shortcut without cluttering the UI. Setting `type="search"` and `aria-keyshortcuts="/"` ensures standard behavior and accessibility.
**Action:** When implementing a primary search input, always include a global keyboard shortcut (usually '/') and a conditional visual hint to improve efficiency and discoverability.

## 2025-04-06 - [Dropdown Keyboard Navigation & Accessible Status Indicators]
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

## 2025-04-25 - [Semantic Lists & External Link Hints]
**Learning:** Semantic HTML is the foundation of accessibility. Using `<ol>` and `<li>` for breadcrumbs and instructions provides a clear structure for screen readers. Decorative markers (like "A", "B", or step numbers) should be hidden with `aria-hidden="true"` to avoid redundant announcements. For links opening in new windows (`target="_blank"`), a visually hidden hint like `（新しいウィンドウで開きます）` is essential for informing screen reader users of the change in context.
**Action:** Use semantic lists for ordered content, hide decorative markers, and always provide visually hidden hints for external links.

## 2026-05-01 - [Required Field Visual Indicators & Testing Patterns]
**Learning:** Adding visual indicators (like a red asterisk) to required fields significantly improves form usability by reducing cognitive load. When implementing this within a `<label>`, it's critical to use `aria-hidden="true"` on the indicator to prevent screen reader noise, as the underlying `required` attribute already provides the semantic state. Additionally, this change requires updating Testing Library `getByLabelText` queries to use regular expressions to maintain robust test selection.
**Action:** Always include visual "required" indicators in mandatory forms and use regex-based label matching in associated tests to accommodate the extra markup.

## 2026-05-06 - [Dialog Keyboard Navigation & Body Scroll Locking]
**Learning:** Manual dialog implementations often forget standard UX expectations: closing with the 'Escape' key and preventing the background content from scrolling. Managing these via centralized `useEffect` hooks linked to an aggregate 'open' state (e.g., `anyDialogOpen`) ensures consistent behavior across multiple modals within the same component and prevents common accessibility regressions.
**Action:** For components with multiple dialogs/modals, implement a centralized Escape key listener and body scroll locking effect to ensure standard accessible behavior.
