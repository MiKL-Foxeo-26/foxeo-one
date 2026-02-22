import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // Stub openvidu-browser for test environment (package not installed in monorepo)
      'openvidu-browser': path.resolve(__dirname, './__mocks__/openvidu-browser.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['../../vitest.setup.ts'],
    include: [
      '**/*.test.ts',
      '**/*.test.tsx'
    ],
  },
})
