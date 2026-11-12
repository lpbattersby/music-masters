// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InviteButton from "./invite-button";

it("copies the current URL and allows dismissing the confirmation", async () => {
  const event = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  render(<InviteButton />);
  await event.click(screen.getByRole("button", { name: "Copy invite link" }));
  expect(write).toHaveBeenCalledWith(window.location.href);
  expect(await screen.findByRole("alert")).toHaveTextContent("Invite link copied");
  await event.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
});

it("reports clipboard failures with a manual fallback", async () => {
  const event = userEvent.setup();
  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
  render(<InviteButton />);
  await event.click(screen.getByRole("button", { name: "Copy invite link" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't copy link. Please copy the page URL manually.");
});
