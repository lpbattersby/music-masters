import { expect, test, createTestUser, testUser } from "./fixtures";

test.describe("create group journey", () => {
  test.skip("a visitor can create a group and see the group on the dashboard", async ({
    page,
  }) => {
    await createTestUser();
    await page.goto("/login");

    await page.getByLabel("Username").fill(`${testUser.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();

    await page.getByRole("button", { name: "Create Group" }).click();

    // Fill in the group creation form
    // Invalid description
    await page.getByLabel("Description").fill("To");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Description must be at least 3 characters long")).toBeVisible();

    // Invalid group name
    await page.getByLabel("Group Name").fill("a");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Group name must be at least 3 characters long")).toBeVisible();

    // Invalid submission window length
    await page.getByLabel("Submission window").fill("0");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Submission window length must be at least 1 day")).toBeVisible();

    // Invalid voting window length
    await page.getByLabel("Voting window").fill("0");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Voting window length must be at least 1 day")).toBeVisible();

    // Valid submission
    await page.getByLabel("Description").fill("Valid description");
    await page.getByLabel("Group Name").fill("Valid Group Name");
    await page.getByLabel("Submission window").fill("1");
    await page.getByLabel("Voting window").fill("1");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('main')).toContainText(`Valid Group Name`)
  });
});

test.describe("view group journey", () => {
  test.skip("a visitor can view group details on the group page", async ({
    page,
  }) => {
    await createTestUser();
    await page.goto("/login");
    await page.getByLabel("Username").fill(`${testUser.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();

    await page.getByRole('link', { name: 'Valid Group Name' }).click();
    await expect(page).toHaveURL(/\/groups\/\d+/);
    await expect(page.getByRole('main')).toContainText(`Valid Group Name`)
  });
});
