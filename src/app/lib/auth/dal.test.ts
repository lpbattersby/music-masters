import { beforeEach, expect, it, vi } from "vitest";
import { getIronSession } from "iron-session";
import { getUserByUsername } from "../users";
import { getGroupById, isUserMemberOfGroup } from "../groups";
import { getCurrentUser, getCurrentUserGroup, verifySession } from "./dal";
import { defaultSession, sessionOptions, sleep } from "./session";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next/server", () => ({ connection: vi.fn() }));
vi.mock("iron-session", () => ({ getIronSession: vi.fn() }));
vi.mock("../users", () => ({ getUserByUsername: vi.fn() }));
vi.mock("../groups", () => ({ getGroupById: vi.fn(), isUserMemberOfGroup: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => { throw new Error(`redirect:${path}`); },
  notFound: () => { throw new Error("not-found"); },
}));

const user = { userId: 1, username: "alice", displayName: "Alice", passwordHash: "secret", createdAt: "today" };
const group = { groupId: 2, name: "Music", description: "Music", submissionWindowDays: 1, votingWindowDays: 1, createdBy: 1, createdAt: "today" };

beforeEach(() => {
  vi.resetAllMocks();
  const session = {
    username: "alice", isLoggedIn: true, save: vi.fn(), destroy: vi.fn(), updateConfig: vi.fn(),
  };
  vi.mocked(getIronSession).mockResolvedValue(session);
  vi.mocked(getUserByUsername).mockResolvedValue(user);
  vi.mocked(getGroupById).mockResolvedValue(group);
});

it.each([
  { username: "", isLoggedIn: false },
  { username: "alice", isLoggedIn: false },
  { username: "", isLoggedIn: true },
])("redirects unauthenticated or incomplete sessions: %j", async (session) => {
  vi.mocked(getIronSession).mockResolvedValue({
    ...session, save: vi.fn(), destroy: vi.fn(), updateConfig: vi.fn(),
  });
  await expect(verifySession()).rejects.toThrow("redirect:/");
});

it("returns only public current-user fields", async () => {
  expect(await verifySession()).toEqual({ username: "alice" });
  expect(await getCurrentUser()).toEqual({ userId: 1, username: "alice", displayName: "Alice" });
});

it("redirects sessions whose user no longer exists", async () => {
  vi.mocked(getUserByUsername).mockResolvedValue(undefined);
  await expect(getCurrentUser()).rejects.toThrow("redirect:/login");
});

it.each([0, -1, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1])("rejects invalid group id %s", async (id) => {
  await expect(getCurrentUserGroup(id)).rejects.toThrow("not-found");
  expect(getGroupById).not.toHaveBeenCalled();
});

it("returns not-found for missing groups", async () => {
  vi.mocked(getGroupById).mockResolvedValue(undefined);
  await expect(getCurrentUserGroup(2)).rejects.toThrow("not-found");
});

it.each([false, true])("allows authenticated group access with membership %s", async (isMember) => {
  vi.mocked(isUserMemberOfGroup).mockResolvedValue(isMember);
  expect(await getCurrentUserGroup(2)).toEqual({ group, isMember });
  expect(isUserMemberOfGroup).toHaveBeenCalledWith(2, 1);
});

it("reads session secrets at access time and defaults to signed out", () => {
  try {
    vi.stubEnv("SESSION_PASSWORD", undefined);
    expect(sessionOptions.password).toBe("");
    vi.stubEnv("SESSION_PASSWORD", "test-secret");
    expect(sessionOptions.password).toBe("test-secret");
    expect(defaultSession).toEqual({ username: "", isLoggedIn: false });
    expect(sessionOptions.cookieOptions?.secure).toBe(true);
  } finally {
    vi.unstubAllEnvs();
  }
});

it("sleeps for the requested interval", async () => {
  vi.useFakeTimers();
  try {
    const complete = vi.fn();
    const pending = sleep(100).then(complete);
    await vi.advanceTimersByTimeAsync(99);
    expect(complete).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(complete).toHaveBeenCalledOnce();
  } finally {
    vi.useRealTimers();
  }
});
