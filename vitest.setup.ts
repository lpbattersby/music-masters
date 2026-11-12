import { afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

process.env.DATABASE_URL = ":memory:";

afterEach(async () => {
  if (typeof document !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
  }
});
