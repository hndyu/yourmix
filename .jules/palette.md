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

## 2026-05-11 - [Manual Toast Dismissal & A11y]
**Learning:** While auto-dismissing toasts are standard for non-critical information, providing a manual "close" button significantly improves UX for users who read faster or find persistent overlays distracting. For accessibility, icon-only dismiss buttons must have a clear `aria-label` (e.g., "閉じる"), tactile feedback (`active:scale-90`), and high-contrast focus rings (`focus-visible:ring-white`) to ensure they are discoverable and easy to interact with via keyboard or touch.
**Action:** Always include a manual dismiss button in Toast/Notification components, ensuring it follows the repository's standard for accessible icon-only buttons.

## 2026-05-14 - Standardized High-Contrast Focus Rings
**Learning:** Accessibility and visual consistency are improved by standardizing focus indicators across interactive components. Using `focus-visible` prevents rings from appearing on click for mouse users, while `ring-offset-2` (and `dark:ring-offset-stone-950`) ensures the focus indicator is always visible regardless of the component's background color or theme.
**Action:** Always apply `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950` to primary interactive elements, and consider `ring-offset-1` for smaller elements like tags or chips to maintain visual balance.

## 2026-05-16 - Completion Delight Pattern with Sparkles & Tooltips
**Learning:** High-value actions (like viewing a custom AI-generated result) benefit from subtle celebratory cues. Adding a 'Sparkles' icon with a rotation animation on hover (`group-hover:rotate-12`) provides immediate positive feedback. Furthermore, including a native `title` attribute that matches the `aria-label` improves discoverability for desktop users while maintaining accessibility.
**Action:** For primary action buttons in success/completion states, add celebratory icons with micro-animations and ensure `title` attributes are used alongside `aria-label` for consistency.

## 2026-05-17 - Empty Search State Focus Management
**Learning:** An empty search result state is a dead-end if not handled carefully. Providing a clear "Reset" or "Clear Search" button that programmatically returns focus to the search input via `useImperativeHandle` creates a seamless loop, allowing users to immediately try a different query without losing their place or needing extra clicks. Visual consistency with other reset actions (using `RotateCcw` and `gap-2`) further reinforces the app's interaction patterns.
**Action:** Implement focus return logic in empty states to maintain user flow, and use standardized icons/classes for reset actions to ensure visual consistency.

## 2026-05-18 - Modal Focus Management in Multi-Dialog Pages
**Learning:** In complex pages with multiple manual dialog implementations (like a profile management hub), relying solely on a global "any open" derived state for focus capture can be flaky if multiple state updates happen simultaneously. Explicitly capturing the `e.currentTarget` in the trigger button's `onClick` handler and storing it in a `useRef` ensures reliable focus restoration. Additionally, using `autoFocus` on the primary input field (with a Biome ignore comment) provides immediate context for keyboard users.
**Action:** For complex multi-modal pages, explicitly capture the triggering element in a ref during the `onClick` event and use a `useEffect` on the open state to restore focus. Always provide an immediate focus target within the modal using `autoFocus` or a ref.

## 2026-05-23 - [Interactive Instruction Tracking & Accessible Button Labeling]
**Learning:** Adding interactive elements like step-tracking to recipe instructions enhances the "cooking" UX. However, using `aria-label` on buttons that contain rich text (like instruction steps) is an anti-pattern because it causes screen readers to ignore the internal content. Instead, use `sr-only` text within the button to provide status context (e.g., "Step 1: Completed") while allowing the primary instruction text to remain discoverable.
**Action:** When making text content interactive via buttons, use `sr-only` for additional status context instead of `aria-label` to preserve the accessibility of the original text.

## 2026-05-24 - Standardized Form Input Focus Experience
**Learning:** Accessibility and visual consistency are paramount in form design. Unlike buttons, text-based inputs should provide immediate focus feedback regardless of the interaction method (mouse or keyboard). Standardizing on `focus:ring-2` with `focus:ring-offset-2` and `transition-all` ensures a high-contrast, responsive indicator that works across all themes and input devices. Additionally, enhancing icon-only toggles within inputs (like password visibility) with tactile feedback (`active:scale-90`) and native tooltips (`title`) improves both usability and discoverability.
**Action:** Apply a consistent focus ring pattern to all form inputs (`focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-stone-950 transition-all`) and ensure nested interactive elements provide clear tactile and descriptive feedback.
