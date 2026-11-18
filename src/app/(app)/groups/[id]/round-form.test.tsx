// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateRoundForm from "./round-form";
import { createRoundAction } from "@/app/actions/rounds";

vi.mock("@/app/actions/rounds", () => ({ createRoundAction: vi.fn() }));

it("submits the group ID with the visible form fields", async () => {
  const event = userEvent.setup();
  render(
    <CreateRoundForm
      group={{
        groupId: "a825e838-94ab-4b52-bf4a-abdd267d405b",
        name: "Music",
        description: "Our music",
        createdBy: "owner",
        submissionWindowDays: 2,
        votingWindowDays: 3,
        createdAt: "today",
      }}
    />,
  );
  await event.type(screen.getByRole("textbox", { name: "Name" }), "Round one");
  await event.type(
    screen.getByRole("textbox", { name: "Description" }),
    "Favourite tracks",
  );
  await event.click(screen.getByRole("button", { name: "Confirm" }));

  await waitFor(() => expect(createRoundAction).toHaveBeenCalledOnce());
  const data = vi.mocked(createRoundAction).mock.calls[0][1];
  expect(data.get("groupId")).toBe("a825e838-94ab-4b52-bf4a-abdd267d405b");
  expect(data.get("name")).toBe("Round one");
  expect(data.get("roundNumber")).toBeNull();
});
