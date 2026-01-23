## 2025-05-14 - [Ineffective Memoization due to Unstable Handlers]
**Learning:** Even when using `React.memo`, passing anonymous arrow functions as props (e.g., `onToggle={() => handleToggle(id)}`) creates new function references on every render, causing the memoized component to re-render anyway.
**Action:** Always wrap handlers in `useCallback` and pass the function reference directly. Modify child components to accept the item/ID in their callbacks if necessary, rather than capturing it in the parent's render loop.
