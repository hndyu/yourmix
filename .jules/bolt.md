## 2025-05-15 - [Database and API Efficiency]
**Learning:** In SQLite/D1, foreign key columns are not indexed by default, which can lead to O(N) full table scans during JOINs or relational queries. Also, common patterns like `reduce` with internal `filter` create O(N^2) bottlenecks that are easily avoidable with a single pass or specialized data structures like `Set`.
**Action:** Always check schema for missing indexes on frequently joined columns. Prefer `Set` for membership checks and single-pass loops for data transformation.

## 2025-05-25 - [Recurrence of Performance Anti-patterns]
**Learning:** Performance anti-patterns (like O(G*N) loops) often recur in parallel implementations of similar logic (e.g., in both API routes and Server Side utility libraries). Fixing one instance doesn't guarantee the pattern is removed from the entire codebase.
**Action:** When identifying a performance bottleneck in one part of the app, grep the codebase for similar patterns or logic to ensure a comprehensive fix across both client-side, server-side, and API layers.

## 2025-05-20 - [React List Rendering Optimization]
**Learning:** Even with `React.memo`, re-renders can still occur if array props are re-generated as new references in the parent's `map` loop. Also, in-place `.sort()` on filtered arrays can be risky if the array is not guaranteed to be a new reference.
**Action:** Use custom comparison functions in `React.memo` for deep equality checks on array/object props. Always use `[...array].sort()` to ensure immutability when sorting derived data.

## 2026-01-27 - [Client-side Search and Sort Optimization]
**Learning:** Heavy client-side operations like sorting hundreds of items based on derived properties (like match ratios) can become O(N^2) or worse if those properties are recalculated in the sort comparator. Using the Schwartzian Transform pattern (pre-calculating keys) and optimized data structures (Set/Map) for the underlying logic significantly improves responsiveness.
**Action:** When sorting arrays in `useMemo`, pre-calculate comparison keys in a single pass if the calculation is more than a simple property access. Use `Set` for membership checks in frequently called helpers.
