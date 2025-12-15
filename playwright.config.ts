import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for E2E Tests
 *
 * Two test modes:
 * 1. Default (chromium): Tests basic UI against production server (port 8081)
 *    - Run: npm run test:e2e
 *    - Auto-starts: npm start -- --port 8081
 *
 * 2. Dev (dev-chromium): Tests with login against dev server (port 8082)
 *    - First start: npm run start:test (in separate terminal)
 *    - Then run: npm run test:e2e:dev
 *    - Uses 10k-dev Supabase with test users
 */

// Check if testing against dev server
const isDevTest = process.env.PLAYWRIGHT_PROJECT === 'dev-chromium' ||
                  process.argv.includes('--project=dev-chromium');

export default defineConfig({
  // Test directory
  testDir: './__tests__/e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'on-first-retry',
  },

  // Configure projects for major browsers and devices
  projects: [
    // Desktop Chrome - Basic UI tests (no auth)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8081',
      },
      // Only run non-login tests (grep out tests that need auth)
      grep: /@noauth|Edge Cases|Visual/,
    },
    // Desktop Chrome - Full tests with login
    {
      name: 'dev-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8082',
      },
      // Run all tests including login tests
    },
    // Mobile - iPhone (small phone)
    {
      name: 'mobile-iphone-se',
      use: {
        ...devices['iPhone SE'],
        baseURL: 'http://localhost:8081',
      },
      grep: /@noauth/,
    },
    // Mobile - iPhone (standard)
    {
      name: 'mobile-iphone-12',
      use: {
        ...devices['iPhone 12'],
        baseURL: 'http://localhost:8081',
      },
      grep: /@noauth/,
    },
    // Mobile - Android (Pixel 5)
    {
      name: 'mobile-pixel-5',
      use: {
        ...devices['Pixel 5'],
        baseURL: 'http://localhost:8081',
      },
      grep: /@noauth/,
    },
    // Tablet - iPad
    {
      name: 'tablet-ipad',
      use: {
        ...devices['iPad (gen 7)'],
        baseURL: 'http://localhost:8081',
      },
      grep: /@noauth/,
    },
    // Tablet - iPad landscape
    {
      name: 'tablet-ipad-landscape',
      use: {
        ...devices['iPad (gen 7) landscape'],
        baseURL: 'http://localhost:8081',
      },
      grep: /@noauth/,
    },
  ],

  // Run local dev server before starting tests (only for default chromium project)
  webServer: isDevTest ? undefined : {
    command: 'npm start -- --port 8081',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Test timeout
  timeout: 60 * 1000,

  // Expect timeout
  expect: {
    timeout: 10 * 1000,
  },
});
