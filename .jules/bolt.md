## 2025-05-15 - [Database and API Efficiency]
**Learning:** In SQLite/D1, foreign key columns are not indexed by default, which can lead to O(N) full table scans during JOINs or relational queries. Also, common patterns like `reduce` with internal `filter` create O(N^2) bottlenecks that are easily avoidable with a single pass or specialized data structures like `Set`.
**Action:** Always check schema for missing indexes on frequently joined columns. Prefer `Set` for membership checks and single-pass loops for data transformation.

## 2025-05-20 - [React List Rendering Optimization]
**Learning:** Even with `React.memo`, re-renders can still occur if array props are re-generated as new references in the parent's `map` loop. Also, in-place `.sort()` on filtered arrays can be risky if the array is not guaranteed to be a new reference.
**Action:** Use custom comparison functions in `React.memo` for deep equality checks on array/object props. Always use `[...array].sort()` to ensure immutability when sorting derived data.
