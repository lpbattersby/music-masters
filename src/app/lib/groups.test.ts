import { beforeEach, describe, expect, it } from "vitest";

import { createGroup, getGroupById, listGroups, getGroupByName } from "@/app/lib/groups";
import { resetDb } from "@/test/helpers";
import { createTestUser } from "@/test/fixtures";

describe("groups queries", () => {
  beforeEach(resetDb);

  it("creates and reads back a group", async () => {
    const created_user = await createTestUser();
    const created = await createGroup({
        name: "new_group",
        description: "test description",
        submissionWindowDays: 2,
        votingWindowDays: 2,
        createdBy: created_user.userId
    });

    expect(created.groupId).toBeGreaterThan(0);
    expect(created.createdAt).toBeTruthy();

    const found = await getGroupById(created.groupId);
    expect(found).toMatchObject({ name: "new_group", description: "test description" });
  });

  it("returns undefined for a missing id", async () => {
    expect(await getGroupById(999)).toBeUndefined();
  });

  it("lists all groups", async () => {
    const created_user = await createTestUser();
    await createGroup({ name: "group_a", description: "A", submissionWindowDays: 2, votingWindowDays: 2, createdBy: created_user.userId });
    await createGroup({ name: "group_b", description: "B", submissionWindowDays: 2, votingWindowDays: 2, createdBy: created_user.userId });

    const all = await listGroups();
    expect(all).toHaveLength(2);

    const foundByName = await getGroupByName("group_a");
    expect(foundByName).toMatchObject({ name: "group_a", description: "A" });
  });

  it("returns undefined for a missing name", async () => {
    expect(await getGroupByName("non_existent_group")).toBeUndefined();
  });

  it("enforces unique group names", async () => {
    const created_user = await createTestUser();
    await createGroup({ name: "dup_group", description: "One", submissionWindowDays: 2, votingWindowDays: 2, createdBy: created_user.userId });
    await expect(
      createGroup({ name: "dup_group", description: "Two", submissionWindowDays: 2, votingWindowDays: 2, createdBy: created_user.userId }),
    ).rejects.toThrow();
  });

  it("enforces greater than 0 for windows", async () => {
    const created_user = await createTestUser();
    await expect(
      createGroup({ name: "invalid_group", description: "Invalid", submissionWindowDays: 0, votingWindowDays: 2, createdBy: created_user.userId }),
    ).rejects.toThrow();
    await expect(
      createGroup({ name: "invalid_group_2", description: "Invalid", submissionWindowDays: 2, votingWindowDays: 0, createdBy: created_user.userId }),
    ).rejects.toThrow();
  });

  it("enforces created by real user", async () => {
    await expect(
      createGroup({ name: "invalid_user_group", description: "Invalid", submissionWindowDays: 2, votingWindowDays: 2, createdBy: 999 }),
    ).rejects.toThrow();
  });
});
