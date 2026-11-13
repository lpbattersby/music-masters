import { beforeEach, describe, expect, it, vi } from "vitest";
import { LibsqlError } from "@libsql/client";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { signup, login, logout } from "./auth";
import { createGroupAction, joinGroupAction } from "./groups";
import { createUser, getUserByUsername } from "@/app/lib/users";
import { createGroup, getGroupById } from "@/app/lib/groups";
import { createMembership } from "@/app/lib/memberships";
import { verifySession } from "@/app/lib/auth/dal";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

const { session } = vi.hoisted(() => ({
  session: { username: "", isLoggedIn: false, save: vi.fn(), destroy: vi.fn() },
}));
vi.mock("@/app/lib/users", () => ({ createUser: vi.fn(), getUserByUsername: vi.fn() }));
vi.mock("@/app/lib/groups", () => ({ createGroup: vi.fn(), getGroupById: vi.fn() }));
vi.mock("@/app/lib/memberships", () => ({ createMembership: vi.fn() }));
vi.mock("@/app/lib/auth/dal", () => ({ verifySession: vi.fn() }));
vi.mock("bcrypt", () => ({ default: { compare: vi.fn() } }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("iron-session", () => ({ getIronSession: vi.fn(async () => session) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => { throw new Error(`redirect:${path}`); },
  notFound: () => { throw new Error("not-found"); },
}));

const user = { userId: "1", username: "alice", displayName: "Alice", passwordHash: "hash", createdAt: "today" };
const group = { groupId: "2", name: "Music", description: "Our music", submissionWindowDays: 2, votingWindowDays: 3, createdBy: "1", createdAt: "today" };
const form = (values: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
};
const credentials = { username: "alice", displayName: "Alice", password: "Password1!" };

beforeEach(() => {
  vi.resetAllMocks();
  session.username = "";
  session.isLoggedIn = false;
  vi.mocked(getUserByUsername).mockResolvedValue(user);
  vi.mocked(createUser).mockResolvedValue(user);
  vi.mocked(verifySession).mockResolvedValue({ username: "alice" });
  vi.mocked(createGroup).mockResolvedValue(group);
  vi.mocked(getGroupById).mockResolvedValue(group);
});

describe("authentication actions", () => {
  it("rejects invalid signup and login fields without querying users", async () => {
    expect(await signup(undefined, new FormData())).toHaveProperty("errors.password");
    expect(await login(undefined, new FormData())).toHaveProperty("errors.username");
    expect(createUser).not.toHaveBeenCalled();
    expect(getUserByUsername).not.toHaveBeenCalled();
  });

  it("creates an account and saves its session before redirecting", async () => {
    await expect(signup(undefined, form(credentials))).rejects.toThrow("redirect:/dashboard");
    expect(createUser).toHaveBeenCalledWith(credentials);
    expect(session).toMatchObject({ username: "alice", isLoggedIn: true });
    expect(session.save).toHaveBeenCalledOnce();
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it.each([false, true])("reports duplicate usernames (wrapped: %s)", async (wrapped) => {
    const cause = new LibsqlError("duplicate", "SQLITE_CONSTRAINT", "SQLITE_CONSTRAINT_UNIQUE");
    vi.mocked(createUser).mockRejectedValue(wrapped ? new DrizzleQueryError("insert", [], cause) : cause);
    expect(await signup(undefined, form(credentials))).toEqual({
      errors: { username: ["That username is already taken."] },
    });
    expect(session.save).not.toHaveBeenCalled();
  });

  it("propagates unexpected signup failures", async () => {
    const error = new Error("database unavailable");
    vi.mocked(createUser).mockRejectedValue(error);
    await expect(signup(undefined, form(credentials))).rejects.toBe(error);
  });

  it("does not save a session for an unknown user or incorrect password", async () => {
    vi.mocked(getUserByUsername).mockResolvedValueOnce(undefined);
    expect(await login(undefined, form(credentials))).toEqual({ errors: { username: ["User not found."] } });
    vi.mocked(bcrypt.compare).mockImplementation(async () => false);
    expect(await login(undefined, form(credentials))).toEqual({ errors: { password: ["Incorrect password."] } });
    expect(session.save).not.toHaveBeenCalled();
  });

  it("logs in and preserves an existing session until credentials are verified", async () => {
    session.isLoggedIn = true;
    session.username = "previous";
    vi.mocked(bcrypt.compare).mockImplementation(async () => true);
    await expect(login(undefined, form(credentials))).rejects.toThrow("redirect:/dashboard");
    expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, "hash");
    expect(session.username).toBe("alice");
    expect(session.save).toHaveBeenCalledOnce();
  });

  it("destroys the session on logout", async () => {
    await expect(logout()).rejects.toThrow("redirect:/");
    expect(session.destroy).toHaveBeenCalledOnce();
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});

describe("group actions", () => {
  const input = { name: "Music", description: "Our music", submissionWindowDays: "2", votingWindowDays: "3" };

  it("validates before creating a group", async () => {
    expect(await createGroupAction(undefined, new FormData())).toHaveProperty("errors.name");
    expect(createGroup).not.toHaveBeenCalled();
  });

  it("creates the group and the creator's membership", async () => {
    await expect(createGroupAction(undefined, form(input))).rejects.toThrow("redirect:/groups/2");
    expect(createGroup).toHaveBeenCalledWith({ ...input, submissionWindowDays: 2, votingWindowDays: 3, createdBy: user.userId });
    expect(createMembership).toHaveBeenCalledWith({ groupId: group.groupId, userId: user.userId });
  });

  it("redirects missing users for both actions without writing", async () => {
    vi.mocked(getUserByUsername).mockResolvedValue(undefined);
    await expect(createGroupAction(undefined, form(input))).rejects.toThrow("redirect:/login");
    await expect(joinGroupAction(form({ groupId: "2" }))).rejects.toThrow("redirect:/login");
    expect(createMembership).not.toHaveBeenCalled();
    expect(createGroup).not.toHaveBeenCalled();
  });

  it.each([new FormData(), form({ groupId: "" }), (() => {
    const data = new FormData();
    data.set("groupId", new Blob(["invalid"]), "group.txt");
    return data;
  })()])("rejects missing or non-text group IDs", async (data) => {
    await expect(joinGroupAction(data)).rejects.toThrow("not-found");
    expect(getGroupById).not.toHaveBeenCalled();
    expect(createMembership).not.toHaveBeenCalled();
  });

  it("rejects missing groups", async () => {
    vi.mocked(getGroupById).mockResolvedValue(undefined);
    await expect(joinGroupAction(form({ groupId: "2" }))).rejects.toThrow("not-found");
    expect(createMembership).not.toHaveBeenCalled();
  });

  it("joins an existing group as the authenticated user", async () => {
    await expect(joinGroupAction(form({ groupId: "2" }))).rejects.toThrow("redirect:/groups/2");
    expect(createMembership).toHaveBeenCalledWith({ groupId: group.groupId, userId: user.userId });
  });

  it("does not redirect successfully when membership creation fails", async () => {
    const error = new Error("write failed");
    vi.mocked(createMembership).mockRejectedValue(error);
    await expect(joinGroupAction(form({ groupId: "2" }))).rejects.toBe(error);
  });
});
