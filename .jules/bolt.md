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

## 2025-11-20 - [Optimizing List Item Props Derivation]
**Learning:** Calculating derived props for list items within a `map` loop can introduce hidden O(N * M^2) complexity if using patterns like `.filter` with a nested `.find`. This significantly increases the rendering time of large interactive lists.
**Action:** Prefer iterating over the source of truth (e.g., `actualDetails`) once and using a `Set` for lookups to achieve O(N * M) complexity. Avoid redundant search operations in render loops.

## 2026-02-04 - [Optimizing API DB Round-trips]
**Learning:** Sequential DB queries within an endpoint (especially those in loops) can significantly increase latency in serverless environments like Cloudflare Workers. Consolidating data fetching into parallelized queries at the start of the request and using in-memory data structures (like Maps) for lookups is a major performance win.
**Action:** Always look for sequential 'await' calls that can be parallelized with Promise.all, and check for N+1 patterns where a simple join or merged fetch could provide all necessary data upfront.

## 2026-02-10 - [Consolidating Parallel Queries into Single SQL Call]
**Learning:** Even when queries are parallelized with `Promise.all`, they still result in multiple database round-trips. In high-latency or serverless environments, consolidating these into a single SQL query using conditional aggregation (e.g., `COUNT(*)` and `MAX(CASE WHEN ... THEN 1 ELSE 0 END)`) further reduces overhead and latency.
**Action:** When fetching multiple metrics from the same table based on the same filter, use SQL aggregation functions to retrieve them in one go.

## 2026-05-15 - [Minimizing Round-trips with Drizzle Batch]
**Learning:** For write operations that require a subsequent read (e.g., toggling a 'like' and returning the new count), `db.batch` allows grouping these distinct operations into a single round-trip to the database. This is particularly effective on Cloudflare D1 where minimizing network overhead between the worker and the database is critical for snappy interactive features.
**Action:** Use `db.batch` when performing a mutation that requires fresh state from the database as a response.

## 2026-06-20 - [Batching Parallel Selects and Single-Pass Transformation]
**Learning:** `db.batch` is not only for mutations; it's also highly effective for consolidating multiple independent `select` queries (previously using `Promise.all`) into a single round-trip to Cloudflare D1. Additionally, when transforming relational data, combining multiple iterations over the same set (e.g., building a Map and a grouping object) into a single `reduce` pass further minimizes overhead.
**Action:** Use `db.batch` for any independent queries that can be executed together. Always look for opportunities to merge multiple O(N) loops into a single-pass transformation.
