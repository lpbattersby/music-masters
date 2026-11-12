import { expect, test } from "@playwright/test";

test.describe("sign up journey", () => {
  test.skip("a visitor can sign up and land back on the home page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/signup");

    await page.getByLabel("Display name").fill("Ada Lovelace");
    await page.getByLabel("Username").fill(`signup-journey`);
    await page.getByLabel("Password").fill("supersecret");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page).toHaveURL("/");
  });
});
