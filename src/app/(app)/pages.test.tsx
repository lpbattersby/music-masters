// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./dashboard/page";
import GroupPage from "./groups/[id]/page";
import AppLayout from "./layout";
import { getCurrentUser, getCurrentUserGroup } from "../lib/auth/dal";
import { getGroupsByUserId } from "../lib/groups";
import { getMembersByGroupId } from "../lib/users";

vi.mock("../lib/auth/dal", () => ({ getCurrentUser: vi.fn(), getCurrentUserGroup: vi.fn() }));
vi.mock("../lib/groups", () => ({ getGroupsByUserId: vi.fn() }));
vi.mock("../lib/users", () => ({ getMembersByGroupId: vi.fn() }));
vi.mock("../actions/auth", () => ({ logout: vi.fn() }));
vi.mock("../actions/groups", () => ({ createGroupAction: vi.fn(), joinGroupAction: vi.fn() }));

const user = { userId: "1", username: "alice", displayName: "Alice" };
const group = { groupId: "2", name: "Music club", description: "Our favourite tracks", submissionWindowDays: 2, votingWindowDays: 3, createdBy: "1", createdAt: "today" };

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getGroupsByUserId).mockResolvedValue([group]);
  vi.mocked(getCurrentUserGroup).mockResolvedValue({ group, isMember: true });
  vi.mocked(getMembersByGroupId).mockResolvedValue([{ ...user, passwordHash: "hash", createdAt: "today" }]);
});

it("shows an empty dashboard instead of group links", async () => {
  vi.mocked(getGroupsByUserId).mockResolvedValue([]);
  render(await Dashboard());
  expect(screen.getByRole("heading", { name: "No groups yet." })).toBeVisible();
});

it("shows members, invite and an enabled round control to the creator", async () => {
  render(await GroupPage({ params: Promise.resolve({ id: "2" }) }));
  expect(screen.getByRole("heading", { name: "Music club", level: 1 })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Current round", level: 2 })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Members", level: 2 })).toBeVisible();
  expect(screen.getByRole("button", { name: "Copy invite link" })).toBeVisible();
  expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create round" })).toBeEnabled();
  expect(within(screen.getByRole("region", { name: "Members" })).getByText("Alice")).toBeVisible();
});

it("renders the app header and opens and dismisses its profile menu", async () => {
  const event = userEvent.setup();
  render(<AppLayout><main>Page content</main></AppLayout>);
  expect(screen.getByRole("link", { name: "Music Masters Dashboard" })).toHaveAttribute("href", "/dashboard");
  const profile = screen.getByRole("button", { name: "Profile" });
  expect(profile).toHaveAttribute("aria-expanded", "false");
  await event.click(profile);
  expect(await screen.findByRole("button", { name: "Logout" })).toBeVisible();
  expect(profile).toHaveAttribute("aria-expanded", "true");
  await event.keyboard("{Escape}");
  await waitFor(() => expect(profile).toHaveAttribute("aria-expanded", "false"));
});
