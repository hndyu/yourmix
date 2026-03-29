# Palette's Journal - UX & Accessibility

## 2025-05-14 - Interactive State Consistency
**Learning:** For multi-state interactive components (like a toggleable card), using `aria-pressed` for the main selection state and `aria-expanded` for detail expansion significantly improves the mental model for screen reader users. Combining these with descriptive labels (like "銘柄・詳細を表示") ensures that users understand exactly what each action does, especially when components are grouped in a grid.
**Action:** Always verify that both the selection and the "view details" paths of an interactive card have appropriate ARIA attributes.

## 2025-05-15 - Actionable Empty States
**Learning:** When a search or filter operation yields no results, simply informing the user is insufficient. Providing a clear, immediate action (like a "Clear Selection" button) directly within the "No Results" component significantly reduces friction and prevents the user from feeling stuck.
**Action:** In all "no results" or empty state components, include at least one actionable next step or a way to reset the current state.

## 2025-05-16 - Dismissible Modals in Portals
**Learning:** Modals rendered via `createPortal` often bypass default browser behaviors for accessibility. Implementing an explicit `useEffect` for the `Escape` key and providing a clear, visible close button (X) is essential for ensuring that users can easily dismiss the modal, preventing them from feeling trapped in the interface.
**Action:** Always include keyboard listeners for `Escape` and a visible close action when implementing custom overlay components.
