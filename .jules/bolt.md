## 2025-05-22 - Ingredient Selector Performance Optimization
**Learning:** Anonymous arrow functions in React props (e.g., `onToggle={() => handler(item)}`) create new function references on every render, causing `React.memo` to fail even if other props are stable.
**Action:** Always wrap event handlers in `useCallback` and design child components to accept the item/ID as an argument in the callback, passing the stable function reference directly.
