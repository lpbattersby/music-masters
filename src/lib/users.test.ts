import { beforeEach, describe, expect, it } from "vitest";

import { createUser, getUserById, listUsers } from "@/lib/users";
import { resetDb } from "@/test/helpers";

describe("users queries", () => {
  beforeEach(resetDb);

  it("creates and reads back a user", async () => {
    const created = await createUser({
      email: "ada@example.com",
      displayName: "Ada",
    });

    expect(created.id).toBeGreaterThan(0);
    expect(created.createdAt).toBeTruthy();

    const found = await getUserById(created.id);
    expect(found).toMatchObject({ email: "ada@example.com", displayName: "Ada" });
  });

  it("returns undefined for a missing id", async () => {
    expect(await getUserById(999)).toBeUndefined();
  });

  it("lists all users", async () => {
    await createUser({ email: "a@example.com", displayName: "A" });
    await createUser({ email: "b@example.com", displayName: "B" });

    const all = await listUsers();
    expect(all).toHaveLength(2);
  });

  it("enforces unique emails", async () => {
    await createUser({ email: "dup@example.com", displayName: "One" });
    await expect(
      createUser({ email: "dup@example.com", displayName: "Two" }),
    ).rejects.toThrow();
  });
});
