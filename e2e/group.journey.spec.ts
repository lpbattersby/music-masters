import AxeBuilder from '@axe-core/playwright';
import { createMembership } from "@/app/lib/memberships";
import { createGroup } from "@/app/lib/groups";
import { expect, test, createTestUsers, createTestGroups, testUser } from "@/test/fixtures";

test("group names stay readable over the artwork at mobile and desktop widths", async ({ page }) => {
  const [user] = await createTestUsers(1);
  const names = [
    "Music club",
    "A group with a much longer name that wraps over several lines",
    "Supercalifragilisticexpialidocious".repeat(4),
  ];
  for (const name of names) {
    const group = await createGroup({
      name, description: "Our music", submissionWindowDays: 2, votingWindowDays: 2, createdBy: user.userId,
    });
    await createMembership({ userId: user.userId, groupId: group.groupId });
  }

  await page.goto("/login");
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Password").fill(testUser.password);
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  for (const width of [375, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    const colours = new Set<string>();
    for (const name of names) {
      const card = page.getByRole("link", { name, exact: true });
      await expect(card).toBeVisible();
      const layout = await card.locator("h2").evaluate((heading) => {
        const artwork = heading.parentElement!;
        const description = artwork.lastElementChild!;
        const headingRect = heading.getBoundingClientRect();
        const artworkRect = artwork.getBoundingClientRect();
        const descriptionRect = description.getBoundingClientRect();
        return {
          background: getComputedStyle(heading).backgroundColor,
          artworkBackground: getComputedStyle(artwork).backgroundColor,
          zIndex: getComputedStyle(heading).zIndex,
          headingRect: { left: headingRect.left, right: headingRect.right, bottom: headingRect.bottom },
          artworkRect: { left: artworkRect.left, right: artworkRect.right, bottom: artworkRect.bottom },
          descriptionTop: descriptionRect.top,
        };
      });
      expect(layout.background).toBe(layout.artworkBackground);
      expect(layout.background).not.toBe("rgba(0, 0, 0, 0)");
      expect(Number(layout.zIndex)).toBeGreaterThan(0);
      expect(layout.headingRect.left).toBeGreaterThanOrEqual(layout.artworkRect.left);
      expect(layout.headingRect.right).toBeLessThanOrEqual(layout.artworkRect.right);
      expect(layout.headingRect.bottom).toBeLessThanOrEqual(layout.descriptionTop);
      expect(layout.descriptionTop).toBeLessThan(layout.artworkRect.bottom);
      colours.add(layout.background);
    }
    expect(colours.size).toBe(3);
  }
});

test.describe("create group journey", () => {
  test("a visitor can create a group and get redirected to the group page", async ({
    page,
  }) => {
    const [user] = await createTestUsers(1);
    await page.goto("/login");

    await page.getByLabel("Username").fill(`${user.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Profile", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Activity", exact: true })).toBeDisabled();

    // Run accessibility check on the dashboard page
    const accessibilityScanResultsDashboard = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResultsDashboard.violations).toHaveLength(0);

    await page.getByRole("button", { name: "Create Group" }).click();

    const dialog = page.getByRole("dialog", { name: "Create Group" });

    await expect(dialog).toBeVisible();
    const container = page.locator(".MuiDialog-container").filter({
      has: dialog,
    });
    await expect(container).toHaveCSS("opacity", "1");

    // Run accessibility check on the create group page
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);

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

    await expect(page).toHaveURL(/\/groups\/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i)
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Current round" })).toBeVisible();
    await expect(page.getByText("No round yet.", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create round", exact: true })).toBeDisabled();

    // Run accessibility check on the group page
    const accessibilityScanResultsGroup = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResultsGroup.violations).toHaveLength(0);

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
    await expect(page).toHaveURL(`/groups/${group.groupId}`);
    await expect(page.getByRole('main')).toContainText(`${group.name}`)
    await expect(page.getByRole('main')).toContainText(`${group.description}`)
  });
});

test.describe("join group journey", () => {
  test("a user can join a group using the invite link", async ({ page }) => {
    const [user1, user2] = await createTestUsers(2);
    const [group] = await createTestGroups(1, user1.userId);
      await createMembership({
      userId: user1.userId,
      groupId: group.groupId,
    })

    await page.goto("/login");
    await page.getByLabel("Username").fill(`${user1.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto(`/groups/${group.groupId}`);
    await page.getByRole("button", {
      name: "Copy invite link",
      exact: true,
    }).click();

    await page.getByRole("button", { name: "Profile", exact: true }).click();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/");

    // Log in as the second user to join the group
    await page.goto("/login");
    await page.getByLabel("Username").fill(`${user2.username}`);
    await page.getByLabel("Password").fill(`${testUser.password}`);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    // Simulate joining the group using the copied link
    await page.goto(`/groups/${group.groupId}`);
    await expect(page.getByRole("heading", { name: group.name, exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Join", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create round", exact: true })).toHaveCount(0);

    // Run accessibility check on the group page before joining
    const accessibilityScanResultsGroupBeforeJoin = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResultsGroupBeforeJoin.violations).toHaveLength(0);

    await page.getByRole("button", { name: "Join" }).click();
    await expect(page.getByRole("button", {
      name: "Copy invite link",
      exact: true,
    })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create round", exact: true })).toHaveCount(0);

    await page.goto("/dashboard");
    await expect(page.getByRole("link", {
      name: group.name,
      exact: true,
    })).toBeVisible();
  });
});