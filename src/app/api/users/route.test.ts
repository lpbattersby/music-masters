import { beforeEach, describe, expect, it } from "vitest";

import { resetDb } from "@/test/helpers";

import { GET, POST } from "./route";

function postUsers(body: unknown): Promise<Response> {
  return POST(
    new Request("http://test/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("/api/users", () => {
  beforeEach(resetDb);

  it("creates a user (201)", async () => {
    const res = await postUsers({ email: "ada@example.com", displayName: "Ada" });
    expect(res.status).toBe(201);

    const { user } = await res.json();
    expect(user).toMatchObject({ email: "ada@example.com", displayName: "Ada" });
  });

  it("rejects an invalid body (400) with field errors", async () => {
    const res = await postUsers({ email: "nope" });
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.issues.email).toBeDefined();
    expect(body.issues.displayName).toBeDefined();
  });

  it("rejects a duplicate email (409)", async () => {
    await postUsers({ email: "dup@example.com", displayName: "One" });
    const res = await postUsers({ email: "dup@example.com", displayName: "Two" });
    expect(res.status).toBe(409);
  });

  it("lists created users (200)", async () => {
    await postUsers({ email: "ada@example.com", displayName: "Ada" });

    const res = await GET();
    expect(res.status).toBe(200);

    const { users } = await res.json();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("ada@example.com");
  });
});
