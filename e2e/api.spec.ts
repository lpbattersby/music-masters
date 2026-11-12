import { expect, test } from "@playwright/test";

test.describe("/api/users", () => {
  test("creates and lists a user", async ({ request }) => {
    const email = `e2e-${Date.now()}@example.com`;

    const created = await request.post("/api/users", {
      data: { email, displayName: "E2E User" },
    });
    expect(created.status()).toBe(201);
    expect((await created.json()).user.email).toBe(email);

    const list = await request.get("/api/users");
    expect(list.ok()).toBeTruthy();
    const emails = (await list.json()).users.map(
      (u: { email: string }) => u.email,
    );
    expect(emails).toContain(email);
  });

  test("rejects an invalid payload (400)", async ({ request }) => {
    const res = await request.post("/api/users", { data: { email: "nope" } });
    expect(res.status()).toBe(400);
  });
});
