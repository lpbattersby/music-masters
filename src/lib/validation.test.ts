import { describe, expect, it } from "vitest";

import { createUserSchema } from "@/lib/validation";

describe("createUserSchema", () => {
  it("accepts a valid payload", () => {
    const result = createUserSchema.safeParse({
      email: "ada@example.com",
      displayName: "Ada",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = createUserSchema.safeParse({
      email: "not-an-email",
      displayName: "Ada",
    });
    expect(result.success).toBe(false);
  });

  it("requires a non-empty display name", () => {
    const result = createUserSchema.safeParse({
      email: "ada@example.com",
      displayName: "   ",
    });
    expect(result.success).toBe(false);
  });
});
