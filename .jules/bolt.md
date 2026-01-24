# Bolt's Performance Journal

## 2025-05-15 - Missing Memoization in Ingredient Selector
**Learning:** The `IngredientSelector` component and its sub-components (`IngredientCard`, `CategoryNav`) were not memoized, and event handlers were passed as anonymous functions. This caused full re-renders of all ingredient cards whenever any state changed (like selection or search), which can be expensive as the number of ingredients grows.
**Action:** Wrap `IngredientCard` and `CategoryNav` in `React.memo` and use `useCallback` for event handlers, ensuring they have stable references by passing the item to the handler instead of creating arrow functions in the render loop.
