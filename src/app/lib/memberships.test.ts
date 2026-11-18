import { beforeEach, expect, it } from "vitest";

import { createMembership } from "@/app/lib/memberships";
import { resetDb } from "@/test/helpers";
import { createTestGroups, createTestUsers } from "@/test/fixtures";

beforeEach(resetDb);

it("enforces one membership per user per group", async () => {
  const [user] = await createTestUsers(1);
  const [group] = await createTestGroups(1, user.userId);

  await createMembership({ groupId: group.groupId, userId: user.userId });

  await expect(createMembership({ groupId: group.groupId, userId: user.userId })).rejects.toThrow();
});
