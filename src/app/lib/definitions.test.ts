import { describe, expect, it } from "vitest";

import { SignupFormSchema, LoginFormSchema } from "@/app/lib/definitions";

describe("SignupFormSchema", () => {
  it("accepts a valid payload", () => {
    const result = SignupFormSchema.safeParse({
      username: "ada_username",
      displayName: "Ada",
      password: "abcdefg1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid username", () => {
    const result = SignupFormSchema.safeParse({
      username: "n",
      displayName: "Ada",
      password: "abcdefg1234!",
    });
    expect(result.success).toBe(false);
  });

  it("requires a non-empty display name", () => {
    const result = SignupFormSchema.safeParse({
      username: "ada_username",
      displayName: "   ",
      password: "abcdefg1234!",
    });
    expect(result.success).toBe(false);
  });

  it("requires a valid password", () => {
    const result = SignupFormSchema.safeParse({
      username: "ada_username",
      displayName: "Ada",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid login payload", () => {
    const result = LoginFormSchema.safeParse({
      username: "ada_username",
      password: "abcdefg1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid login payload", () => {
    const result = LoginFormSchema.safeParse({
      username: "n",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});
