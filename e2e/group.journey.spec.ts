import { createMembership } from "@/app/lib/memberships";
import { expect, test, createTestUsers, createTestGroups, testUser } from "@/test/fixtures";

test.describe("create group journey", () => {
  test("a visitor can create a group and get redirected to the group page", async ({
    page,
  }) => {
    const [user] = await createTestUsers(1);
    await page.goto("/login");

    await page.getByLabel("Username").fill(`${user.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();

    await page.getByRole("button", { name: "Create Group" }).click();

    // Fill in the group creation form
    // Invalid description
    await page.getByLabel("Description").fill("To");
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Description must be at least 3 characters long")).toBeVisible();

    // Invalid group name
    await page.getByLabel("Name", { exact: true }).fill("a");
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Name must be at least 2 characters long.")).toBeVisible();

    // Invalid submission window length
    await page.getByLabel("Submission window").fill("0");
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Submission window must be at least 1 day.")).toBeVisible();

    // Invalid voting window length
    await page.getByLabel("Voting window").fill("0");
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Voting window must be at least 1 day.")).toBeVisible();

    // Valid submission
    await page.getByLabel("Description").fill("Valid description");
    await page.getByLabel("Name", { exact: true }).fill("Valid Group Name");
    await page.getByLabel("Submission window").fill("1");
    await page.getByLabel("Voting window").fill("1");
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL(/\/groups\/\d+$/)
    await page.goto('/dashboard')
    await expect(page.getByRole('link', {
      name: 'Valid Group Name',
      exact: true,
    })).toBeVisible()
  });
});

test.describe("view group journey", () => {
  test("a visitor can view group details on the group page", async ({
    page,
  }) => {
    const [user] = await createTestUsers(1);
    const [group] = await createTestGroups(1, user.userId);
    await createMembership({
      userId: user.userId,
      groupId: group.groupId,
    })

    await page.goto("/login");
    await page.getByLabel("Username").fill(`${user.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();

    await page.getByRole('link', { name: group.name }).click();
    await expect(page).toHaveURL(/\/groups\/\d+/);
    await expect(page.getByRole('main')).toContainText(`${group.name}`)
    await expect(page.getByRole('main')).toContainText(`${group.description}`)
  });
});
