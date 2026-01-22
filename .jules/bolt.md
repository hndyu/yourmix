## 2025-05-14 - Importance of Indexing Foreign Keys in D1/SQLite

**Learning:** In Cloudflare D1 (and SQLite in general), foreign keys are not automatically indexed. This can lead to O(N) table scans during JOINs or relational queries, which becomes a major performance bottleneck as the dataset grows.

**Action:** Always add explicit indexes to foreign key columns in `app/db/schema.ts` for tables that are frequently joined or queried by those foreign keys. Common candidates include `groupId`, `cocktailId`, `userId`, and `categoryId` across various tables in this application.
