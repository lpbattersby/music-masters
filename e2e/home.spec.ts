import { expect, test } from "./fixtures";

test.describe("landing page", () => {
  test("shows the login and sign up calls to action", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
  });

  test("the login CTA links to /login", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("the sign up CTA links to /signup", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Sign Up" })).toHaveAttribute(
      "href",
      "/signup",
    );
  });
});
