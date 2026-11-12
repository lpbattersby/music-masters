import { expect, test } from "@/test/fixtures";

test.describe("sign up journey", () => {
  test("a visitor can sign up and land on the dashboard", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/signup");

    // Invalid fields
    await page.getByLabel("Display name").fill("A");
    await page.getByLabel("Username").fill(`signup-journey`);
    await page.getByLabel("Password").fill(`supersecret!1`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Name must be at least 2 characters long.")).toBeVisible();

    // Invalid username
    await page.getByLabel("Display name").fill("Ada Lovelace");
    await page.getByLabel("Username").fill(`q`);
    await page.getByLabel("Password").fill(`supersecret!1`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Username must be at least 2 characters long.")).toBeVisible();

    // Invalid password
    await page.getByLabel("Username").fill(`signup-journey`);
    await page.getByLabel("Password").fill(`test123`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Password must:")).toBeVisible();

    // Successful sign up
    await page.getByLabel("Display name").fill("Ada Lovelace");
    await page.getByLabel("Username").fill(`signup-journey`);
    await page.getByLabel("Password").fill("supersecret!1");
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('main')).toContainText('Your Groups')
  });
});
