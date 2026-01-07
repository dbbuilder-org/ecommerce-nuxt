import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
      },
    },
    globals: true,
    include: ['tests/unit/**/*.{test,spec}.{js,ts}', 'tests/integration/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', '.nuxt', '.output', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'utils/**/*.ts',
        'composables/**/*.ts',
        'stores/**/*.ts',
        'server/api/**/*.ts',
      ],
      exclude: [
        'node_modules',
        'tests',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
})
