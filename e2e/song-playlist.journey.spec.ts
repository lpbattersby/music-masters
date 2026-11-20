import { createMembership } from "@/app/lib/memberships";
import { createRound } from "@/app/lib/rounds";
import { upsertSongSubmission } from "@/app/lib/submissions";
import {
  expect,
  test,
  createTestUsers,
  createTestGroups,
  testUser,
} from "@/test/fixtures";

const dayOffset = (days: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

test.describe("song playlist", () => {
  test("hides names during voting", async ({ page }) => {
    const [user] = await createTestUsers(1);
    const [group] = await createTestGroups(1, user.userId);
    await createMembership({ userId: user.userId, groupId: group.groupId });

    const round = await createRound({
      name: "Voting round",
      groupId: group.groupId,
      description: "Test",
      submissionDeadline: dayOffset(-1),
      votingDeadline: dayOffset(3),
    });

    await upsertSongSubmission({
      roundId: round.roundId,
      userId: user.userId,
      songUrl: "https://soundcloud.com/artist/song",
    });

    await page.goto("/login");
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill(testUser.password);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto(`/groups/${group.groupId}`);

    const songsList = page
      .getByRole("heading", { name: "Songs" })
      .locator("xpath=following-sibling::ul");
    await expect(songsList).toBeVisible();
    await expect(
      songsList.getByText(user.displayName, { exact: true }),
    ).not.toBeVisible();
  });

  test("reveals names when round is finished", async ({ page }) => {
    const [user] = await createTestUsers(1);
    const [group] = await createTestGroups(1, user.userId);
    await createMembership({ userId: user.userId, groupId: group.groupId });

    const round = await createRound({
      name: "Finished round",
      groupId: group.groupId,
      description: "Test",
      submissionDeadline: dayOffset(-3),
      votingDeadline: dayOffset(-1),
    });

    await upsertSongSubmission({
      roundId: round.roundId,
      userId: user.userId,
      songUrl: "https://soundcloud.com/artist/song",
    });

    await page.goto("/login");
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill(testUser.password);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto(`/groups/${group.groupId}`);

    const songsList = page
      .getByRole("heading", { name: "Songs" })
      .locator("xpath=following-sibling::ul");
    await expect(songsList).toBeVisible();
    await expect(
      songsList.getByText(user.displayName, { exact: true }),
    ).toBeVisible();
  });
});
