import { beforeEach, describe, expect, it } from "vitest";

import { createMembership, getMembershipsByGroupId, getMembershipsByUserId } from "@/app/lib/memberships";
import { resetDb } from "@/test/helpers";
import { createTestUsers, createTestGroups } from "@/test/fixtures";

describe("groups queries", () => {
  beforeEach(resetDb);

  it("retrieves an empty list when no memberships exist", async () => {
    const [user] = await createTestUsers(1);
    const [group] = await createTestGroups(1, user.userId);

    const membershipsByGroup = await getMembershipsByGroupId(group.groupId);
    const membershipsByUser = await getMembershipsByUserId(user.userId);

    expect(membershipsByGroup).toEqual([]);
    expect(membershipsByUser).toEqual([]);
  });

  it("retrieves memberships for a user in multiple groups", async () => {
    const [user] = await createTestUsers(1);
    const [group1, group2] = await createTestGroups(2, user.userId);

    const membership1 = await createMembership({ groupId: group1.groupId, userId: user.userId });
    const membership2 = await createMembership({ groupId: group2.groupId, userId: user.userId });

    const membershipsByUser = await getMembershipsByUserId(user.userId);

    expect(membershipsByUser).toContainEqual(membership1);
    expect(membershipsByUser).toContainEqual(membership2);
  });

  it("retrieves memberships for a group with multiple users", async () => {
    const [user1, user2] = await createTestUsers(2);
    const [group] = await createTestGroups(1, user1.userId);

    const membership1 = await createMembership({ groupId: group.groupId, userId: user1.userId });
    const membership2 = await createMembership({ groupId: group.groupId, userId: user2.userId });

    const membershipsByGroup = await getMembershipsByGroupId(group.groupId);

    expect(membershipsByGroup).toContainEqual(membership1);
    expect(membershipsByGroup).toContainEqual(membership2);
  });

  it("enforces one membership per user per group", async () => {
    const [user] = await createTestUsers(1);
    const [group] = await createTestGroups(1, user.userId);

    await createMembership({ groupId: group.groupId, userId: user.userId });

    await expect(createMembership({ groupId: group.groupId, userId: user.userId })).rejects.toThrow();
  });
});
