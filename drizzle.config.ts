import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: './src/infra/db/migrations',
  schema: './src/infra/db/schemas/index.ts',
  casing: 'snake_case',
})
