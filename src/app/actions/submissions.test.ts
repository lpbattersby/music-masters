import { beforeEach, expect, it, vi } from "vitest";
import { submitSongAction } from "./submissions";
import { getCurrentUser } from "@/app/lib/auth/dal";
import { isUserMemberOfGroup } from "@/app/lib/groups";
import { getRoundById } from "@/app/lib/rounds";
import { upsertSongSubmission } from "@/app/lib/submissions";

vi.mock("@/app/lib/auth/dal", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/app/lib/groups", () => ({ isUserMemberOfGroup: vi.fn() }));
vi.mock("@/app/lib/rounds", () => ({ getRoundById: vi.fn() }));
vi.mock("@/app/lib/submissions", () => ({
  upsertSongSubmission: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error("not-found");
  },
}));

const user = {
  userId: "user-1",
  username: "alice",
  displayName: "Alice",
};
const round = {
  roundId: "a825e838-94ab-4b52-bf4a-abdd267d405b",
  groupId: "3a982625-7b6e-4bf1-93b0-f12656c7ad13",
  name: "Round one",
  description: "Favourite tracks",
  roundNumber: 1,
  submissionDeadline: "2099-01-01",
  votingDeadline: "2099-01-03",
  createdAt: "today",
};
const form = (songUrl = "https://soundcloud.com/artist/song") => {
  const data = new FormData();
  data.set("roundId", round.roundId);
  data.set("songUrl", songUrl);
  return data;
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getRoundById).mockResolvedValue(round);
  vi.mocked(isUserMemberOfGroup).mockResolvedValue(true);
});

it("saves the signed-in member's song and redirects to the group", async () => {
  await expect(submitSongAction(undefined, form())).rejects.toThrow(
    `redirect:/groups/${round.groupId}`,
  );
  expect(upsertSongSubmission).toHaveBeenCalledWith({
    roundId: round.roundId,
    userId: user.userId,
    songUrl: "https://soundcloud.com/artist/song",
  });
});

it.each([
  "not a URL",
  "https://example.com/song",
  "http://soundcloud.com/artist/song",
])("rejects an invalid SoundCloud URL: %s", async (songUrl) => {
  expect(await submitSongAction(undefined, form(songUrl))).toHaveProperty(
    "errors.songUrl",
  );
  expect(upsertSongSubmission).not.toHaveBeenCalled();
});

it("rejects submissions after the deadline", async () => {
  vi.mocked(getRoundById).mockResolvedValue({
    ...round,
    submissionDeadline: "2000-01-01",
  });

  expect(await submitSongAction(undefined, form())).toHaveProperty(
    "errors.songUrl",
  );
  expect(upsertSongSubmission).not.toHaveBeenCalled();
});

it.each(["missing-round", "non-member"])(
  "does not save a %s submission",
  async (kind) => {
    if (kind === "missing-round") {
      vi.mocked(getRoundById).mockResolvedValue(undefined);
    } else {
      vi.mocked(isUserMemberOfGroup).mockResolvedValue(false);
    }

    await expect(submitSongAction(undefined, form())).rejects.toThrow(
      "not-found",
    );
    expect(upsertSongSubmission).not.toHaveBeenCalled();
  },
);
