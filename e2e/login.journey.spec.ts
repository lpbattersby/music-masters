import { expect, test, createTestUser, testUser } from "./fixtures";

test.describe("login journey", () => {
  test("a visitor can login and land on the dashboard", async ({
    page,
  }) => {
    await createTestUser();
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).click();
    await expect(page).toHaveURL("/login");

    // Username not recognized
    await page.getByLabel("Username").fill(`wrongusername`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("User not found.")).toBeVisible();

    // Invalid password
    await page.getByLabel("Username").fill(`${testUser.username}`);
    await page.getByLabel("Password").fill(`test123`);
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByText("Password must:")).toBeVisible();

    // Wrong password
    await page.getByLabel("Username").fill(`${testUser.username}`);
    await page.getByLabel("Password").fill(`incorrectpassword123!`);
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByText("Incorrect password")).toBeVisible();

    // Successful login
    await page.getByLabel("Username").fill(`${testUser.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('main')).toContainText(`hi ${testUser.displayName}`)
  });
});
