import { beforeEach, expect, it, vi } from "vitest";
import { createRoundAction } from "./rounds";
import { getCurrentUser } from "@/app/lib/auth/dal";
import { getGroupById } from "@/app/lib/groups";
import { createRound } from "@/app/lib/rounds";

vi.mock("@/app/lib/auth/dal", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/app/lib/groups", () => ({ getGroupById: vi.fn() }));
vi.mock("@/app/lib/rounds", () => ({ createRound: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error("not-found");
  },
}));

const user = {
  userId: "owner",
  username: "alice",
  displayName: "Alice",
  passwordHash: "hash",
  createdAt: "today",
};
const group = {
  groupId: "a825e838-94ab-4b52-bf4a-abdd267d405b",
  name: "Music",
  description: "Our music",
  createdBy: user.userId,
  submissionWindowDays: 2,
  votingWindowDays: 3,
  createdAt: "today",
};
const input = {
  groupId: group.groupId,
  name: "Round one",
  description: "Favourite tracks",
  submissionDeadline: "2099-01-01",
  votingDeadline: "2099-01-03",
};
const form = () => {
  const data = new FormData();
  for (const [key, value] of Object.entries(input)) data.set(key, value);
  return data;
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getGroupById).mockResolvedValue(group);
  vi.mocked(createRound).mockResolvedValue({
    ...input,
    roundId: "round-1",
    roundNumber: 1,
    createdAt: "today",
  });
});

it.each([null, "", "invalid"])(
  "rejects invalid group ID %s before inserting",
  async (id) => {
    const data = form();
    if (id === null) data.delete("groupId");
    else data.set("groupId", id);
    expect(await createRoundAction(undefined, data)).toHaveProperty(
      "errors.groupId",
    );
    expect(createRound).not.toHaveBeenCalled();
  },
);

it("passes the validated group ID and leaves numbering to the database", async () => {
  const data = form();
  data.set("roundNumber", "999");
  await expect(createRoundAction(undefined, data)).rejects.toThrow(
    `redirect:/groups/${group.groupId}`,
  );
  expect(createRound).toHaveBeenCalledWith(input);
});

it.each(["missing", "not-owner"])("rejects a %s group", async (kind) => {
  vi.mocked(getGroupById).mockResolvedValue(
    kind === "missing" ? undefined : { ...group, createdBy: "someone-else" },
  );
  await expect(createRoundAction(undefined, form())).rejects.toThrow(
    "not-found",
  );
  expect(createRound).not.toHaveBeenCalled();
});

it("does not insert when current-user lookup redirects", async () => {
  const error = new Error("redirect:/login");
  vi.mocked(getCurrentUser).mockRejectedValue(error);
  await expect(createRoundAction(undefined, form())).rejects.toBe(error);
  expect(createRound).not.toHaveBeenCalled();
});

it.each([
  ["submissionDeadline", "not-a-date"],
  ["submissionDeadline", "2000-01-01"],
  ["votingDeadline", "2098-12-31"],
])("rejects invalid %s: %s", async (field, value) => {
  const data = form();
  data.set(field, value);
  expect(await createRoundAction(undefined, data)).toHaveProperty(
    `errors.${field}`,
  );
  expect(createRound).not.toHaveBeenCalled();
});
