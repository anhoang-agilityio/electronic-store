import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // CI tests the production build; locally reuse a running dev server
    command: isCI ? 'npm run build && npm run start' : 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_BASE_URL: `http://localhost:${PORT}`,
      NEXT_PUBLIC_API_URL: 'http://localhost:3001',
      NEXT_PUBLIC_API_KEY: 'e2e-test-key',
      AUTH_SECRET: 'e2e-test-secret',
      AUTH_TRUST_HOST: 'true',
    },
  },
});
