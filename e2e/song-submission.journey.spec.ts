import { createMembership } from "@/app/lib/memberships";
import {
  expect,
  test,
  createTestUsers,
  createTestGroups,
  createTestRounds,
  testUser,
} from "@/test/fixtures";

test.describe("song submission journey", () => {
  test("a user can submit a song and see it reflected", async ({ page }) => {
    const [user] = await createTestUsers(1);
    const [group] = await createTestGroups(1, user.userId);
    await createMembership({ userId: user.userId, groupId: group.groupId });
    await createTestRounds(1, group.groupId);
    await page.goto("/login");
    await page.getByLabel("Username").fill(`${user.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto(`/groups/${group.groupId}`);
    await expect(
      page.getByRole("heading", { name: group.name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit Song", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Submit Song" }).click();
    await expect(
      page.getByRole("dialog", { name: "Submit Song" }),
    ).toBeVisible();
    await page
      .getByLabel("SoundCloud URL")
      .fill("https://soundcloud.com/example");
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
      page.getByRole("button", { name: "Replace Song", exact: true }),
    ).toBeVisible();
  });
});
