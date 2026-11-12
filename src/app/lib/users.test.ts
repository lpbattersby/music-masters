import { beforeEach, describe, expect, it } from "vitest";

import { createUser, getUserById, listUsers, getUserByUsername } from "@/app/lib/users";
import { resetDb } from "@/test/helpers";

describe("users queries", () => {
  beforeEach(resetDb);

  it("creates and reads back a user", async () => {
    const created = await createUser({
      username: "ada_username",
      displayName: "Ada",
      password: "password"
    });

    expect(created.userId).toBeGreaterThan(0);
    expect(created.createdAt).toBeTruthy();

    const found = await getUserById(created.userId);
    expect(found).toMatchObject({ username: "ada_username", displayName: "Ada" });
  });

  it("returns undefined for a missing id", async () => {
    expect(await getUserById(999)).toBeUndefined();
  });

  it("lists all users", async () => {
    await createUser({ username: "a_username", displayName: "A", password: "password" });
    await createUser({ username: "b_username", displayName: "B", password: "password" });

    const all = await listUsers();
    expect(all).toHaveLength(2);

    const foundByUsername = await getUserByUsername("a_username");
    expect(foundByUsername).toMatchObject({ username: "a_username", displayName: "A" });
  });

  it("returns undefined for a missing username", async () => {
    expect(await getUserByUsername("non_existent_username")).toBeUndefined();
  });

  it("enforces unique usernames", async () => {
    await createUser({ username: "dup_username", displayName: "One", password: "password" });
    await expect(
      createUser({ username: "dup_username", displayName: "Two", password: "password" }),
    ).rejects.toThrow();
  });
});
