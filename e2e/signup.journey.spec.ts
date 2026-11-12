import { expect, test } from "./fixtures";

test.describe("sign up journey", () => {
  test("a visitor can sign up and land on the dashboard", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/signup");

    await page.getByLabel("Display name").fill("Ada Lovelace");
    await page.getByLabel("Username").fill(`signup-journey`);
    await page.getByLabel("Password").fill("supersecret!1");
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('main')).toContainText('hi signup-journey!')
  });
});
