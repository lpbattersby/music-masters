import { defineConfig, devices } from "@playwright/test";

const databaseUrl = 'file:./data/e2e.db'
process.env.DATABASE_URL = databaseUrl

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers:1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- --port 3001",
    url: "http://localhost:3001",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      E2E_TEST: '1',
      DATABASE_URL: "file:./data/e2e.db",
    },
  },
});
