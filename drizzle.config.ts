'''
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "./wrangler.jsonc",
    dbName: "yourmix-db",
  },
});
'''