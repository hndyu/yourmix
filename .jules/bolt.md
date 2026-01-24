# Bolt's Journal ⚡

## 2025-05-15 - Add missing database indexes for JOIN performance
**Learning:** In Cloudflare D1 (SQLite), foreign keys are not automatically indexed. Missing explicit indexes on JOIN columns (like `cocktail_id` or `ingredient_id`) leads to full table scans during common operations, such as fetching cocktail details or searching by ingredient. This significantly degrades performance as the dataset grows.
**Action:** Always verify that foreign keys and frequently joined columns in `app/db/schema.ts` have explicit index definitions using Drizzle's `index()` helper.
