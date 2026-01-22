## 2025-05-14 - React Rendering Bottleneck in Ingredient Selector
**Learning:** In a high-interaction list component like the `IngredientSelector`, failing to memoize item components (`IngredientCard`) and their event handlers leads to $O(N)$ re-renders on every selection change. For a list of 50-100 ingredients, this causes noticeable lag on lower-end devices.
**Action:** Always wrap list item components in `React.memo` and ensure all event handlers passed to them are memoized with `useCallback` to prevent cascading re-renders.
