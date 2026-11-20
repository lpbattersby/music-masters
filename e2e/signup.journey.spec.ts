import { expect, test } from "@/test/fixtures";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("sign up journey", () => {
  test("a visitor can sign up and land on the dashboard", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/signup");

    // Run accessibility check on the sign up page
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);

    // Invalid fields
    await page.getByLabel("Display name").fill("A");
    await page.getByLabel("Username").fill(`signup-journey`);
    await page.getByLabel("Password").fill(`supersecret!1`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
      page.getByText("Name must be at least 2 characters long."),
    ).toBeVisible();

    // Invalid username
    await page.getByLabel("Display name").fill("Ada Lovelace");
    await page.getByLabel("Username").fill(`q`);
    await page.getByLabel("Password").fill(`supersecret!1`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
      page.getByText("Username must be at least 2 characters long."),
    ).toBeVisible();

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

    await expect(page).toHaveURL("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Your groups." }),
    ).toBeVisible();
  });
});
