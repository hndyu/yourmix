## 2025-05-15 - [Database and API Efficiency]
**Learning:** In SQLite/D1, foreign key columns are not indexed by default, which can lead to O(N) full table scans during JOINs or relational queries. Also, common patterns like `reduce` with internal `filter` create O(N^2) bottlenecks that are easily avoidable with a single pass or specialized data structures like `Set`.
**Action:** Always check schema for missing indexes on frequently joined columns. Prefer `Set` for membership checks and single-pass loops for data transformation.

## 2025-05-25 - [Recurrence of Performance Anti-patterns]
**Learning:** Performance anti-patterns (like O(G*N) loops) often recur in parallel implementations of similar logic (e.g., in both API routes and Server Side utility libraries). Fixing one instance doesn't guarantee the pattern is removed from the entire codebase.
**Action:** When identifying a performance bottleneck in one part of the app, grep the codebase for similar patterns or logic to ensure a comprehensive fix across both client-side, server-side, and API layers.

## 2025-05-20 - [React List Rendering Optimization]
**Learning:** Even with `React.memo`, re-renders can still occur if array props are re-generated as new references in the parent's `map` loop. Also, in-place `.sort()` on filtered arrays can be risky if the array is not guaranteed to be a new reference.
**Action:** Use custom comparison functions in `React.memo` for deep equality checks on array/object props. Always use `[...array].sort()` to ensure immutability when sorting derived data.

## 2025-06-01 - [Optimizing Frequent Lookups and Schwartzian Transform]
**Learning:** React hooks like `useMemo` and `useCallback` can be combined with efficient data structures like `Set` and `Map` to transform O(N) search operations into O(1). Additionally, when sorting an array based on expensive calculations, pre-calculating those values (Schwartzian Transform) once per item avoids redundant O(N log N) work.
**Action:** Always check sort functions for expensive computations and move them outside the comparator using a pre-calculated Map. Use `Set` for membership checks in frequently called hooks.

## 2025-10-15 - [Avoiding Cartesian Products and O(N^2) Data Transformation]
**Learning:** Joining multiple one-to-many tables in a single SQL query creates a Cartesian product, leading to redundant data transfer and complex O(N^2) manual deduplication logic. Drizzle's Relational Query API (`db.query`) handles these relations more efficiently by executing separate, optimized queries.
**Action:** For complex relational data, prefer `db.query.tableName.findFirst` or `findMany` over raw JOINs. When transforming list data, use `Map` for single-pass grouping to maintain O(N) complexity.
