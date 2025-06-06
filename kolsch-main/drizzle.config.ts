import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://dylan.mcsparren@localhost:5432/kolsch_db';

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
