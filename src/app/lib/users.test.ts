import { beforeEach, describe, expect, it } from "vitest";

import { createUser, getUserById, listUsers } from "@/app/lib/users";
import { resetDb } from "@/test/helpers";

describe("users queries", () => {
  beforeEach(resetDb);

  it("creates and reads back a user", async () => {
    const created = await createUser({
      username: "ada_username",
      displayName: "Ada",
      password_hash: "hashed_password"
    });

    expect(created.user_id).toBeGreaterThan(0);
    expect(created.createdAt).toBeTruthy();

    const found = await getUserById(created.user_id);
    expect(found).toMatchObject({ username: "ada_username", displayName: "Ada" });
  });

  it("returns undefined for a missing id", async () => {
    expect(await getUserById(999)).toBeUndefined();
  });

  it("lists all users", async () => {
    await createUser({ username: "a_username", displayName: "A", password_hash: "hashed_password" });
    await createUser({ username: "b_username", displayName: "B", password_hash: "hashed_password" });

    const all = await listUsers();
    expect(all).toHaveLength(2);
  });

  it("enforces unique usernames", async () => {
    await createUser({ username: "dup_username", displayName: "One", password_hash: "hashed_password" });
    await expect(
      createUser({ username: "dup_username", displayName: "Two", password_hash: "hashed_password" }),
    ).rejects.toThrow();
  });
});
