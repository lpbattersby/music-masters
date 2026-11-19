import { expect, it } from "vitest";
import { getRoundState, RoundState } from "./helpers";

const round = {
  roundId: "round-1",
  groupId: "group-1",
  name: "Round one",
  description: "Favourite tracks",
  roundNumber: 1,
  submissionDeadline: "2025-01-01",
  votingDeadline: "2025-01-03",
  createdAt: "today",
};

it.each([
  ["2025-01-01T23:59:59.000Z", RoundState.Submitting],
  ["2025-01-02T00:00:00.000Z", RoundState.Voting],
  ["2025-01-03T23:59:59.000Z", RoundState.Voting],
  ["2025-01-04T00:00:00.000Z", RoundState.Finished],
])("treats the selected deadline date as inclusive at %s", (now, state) => {
  expect(getRoundState(round, new Date(now))).toBe(state);
});
