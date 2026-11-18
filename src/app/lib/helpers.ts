import { Round } from "@/app/lib/schema";

export function findDeadline(days: number, from = new Date()): string {
  if (!Number.isInteger(days) || days <= 0) {
    throw new Error("Days must be a positive integer");
  }

  const date = new Date(from);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export enum RoundState {
  Submitting = "Submitting",
  Voting = "Voting",
  Finished = "Finished",
}

export function getRoundState(round: Round): RoundState {
  const now = new Date();
  const submissionDeadline = new Date(round.submissionDeadline);
  const votingDeadline = new Date(round.votingDeadline);

  if (now < submissionDeadline) {
    return RoundState.Submitting;
  }

  if (submissionDeadline < now && now < votingDeadline) {
    return RoundState.Voting;
  } else {
    return RoundState.Finished;
  }
}
