import { beforeEach, expect, it } from "vitest";
import { resetDb } from "@/test/helpers";
import { createTestGroups, createTestUsers } from "@/test/fixtures";
import { createMembership } from "./memberships";
import { getGroupsByUserId, isUserMemberOfGroup } from "./groups";
import { getMembersByGroupId } from "./users";

beforeEach(resetDb);

it("filters dashboard groups and group members by membership", async () => {
  const [owner, member, outsider] = await createTestUsers(3);
  const [first, second] = await createTestGroups(2, owner.userId);
  await createMembership({ groupId: first.groupId, userId: owner.userId });
  await createMembership({ groupId: first.groupId, userId: member.userId });
  await createMembership({ groupId: second.groupId, userId: owner.userId });

  expect(await getGroupsByUserId(member.userId)).toEqual([first]);
  expect(await getGroupsByUserId(owner.userId)).toHaveLength(2);
  expect(await getGroupsByUserId(outsider.userId)).toEqual([]);
  expect(await isUserMemberOfGroup(first.groupId, member.userId)).toBe(true);
  expect(await isUserMemberOfGroup(second.groupId, member.userId)).toBe(false);
  const members = await getMembersByGroupId(first.groupId);
  expect(members.map(({ userId }) => userId).sort()).toEqual([owner.userId, member.userId].sort());
  expect(await getMembersByGroupId("non-existent-id")).toEqual([]);
});
