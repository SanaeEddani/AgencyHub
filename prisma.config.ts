import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    adapter: "postgresql",          // Obligatoire pour PostgreSQL
    url: process.env.DATABASE_URL,  // Depuis ton .env
  },
  migrations: {
    path: "prisma/migrations",
  },
});
