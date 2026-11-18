import { defineConfig, devices } from "@playwright/test";

const databaseUrl = "file:./data/e2e.db";
process.env.DATABASE_URL = databaseUrl;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  retries: isCI ? 1 : 0,
  timeout: isCI ? 15_000 : 5_000,
  webServer: {
    command: isCI
      ? "npm run build && npm run start -- --port 3001"
      : "npm run dev -- --port 3001",
    url: "http://localhost:3001",
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      E2E_TEST: "1",
      DATABASE_URL: "file:./data/e2e.db",
    },
  },
});
