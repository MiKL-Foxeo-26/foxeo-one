import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/**/src/**/*.test.ts',
      'supabase/**/*.test.ts',
      'tests/**/*.test.ts',
      'apps/**/*.test.ts',
      'apps/**/*.test.tsx',
    ],
  },
})
