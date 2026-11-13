// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./login/login-form";
import SignupForm from "./signup/signup-form";
import { login, signup } from "./actions/auth";

vi.mock("./actions/auth", () => ({ login: vi.fn(), signup: vi.fn() }));

beforeEach(() => vi.resetAllMocks());

it("submits login fields and displays server validation errors", async () => {
  const event = userEvent.setup();
  vi.mocked(login).mockResolvedValue({
    errors: { username: ["Unknown username"], password: ["Incorrect password"] },
  });
  render(<LoginForm />);
  await event.type(screen.getByLabelText("Username"), "alice");
  await event.type(screen.getByLabelText("Password"), "incorrect");
  await event.click(screen.getByRole("button", { name: "Confirm" }));
  expect(await screen.findByText("- Incorrect password")).toBeVisible();
  expect(screen.getByText("Unknown username")).toBeVisible();
  const submitted = vi.mocked(login).mock.calls[0][1];
  expect(submitted.get("username")).toBe("alice");
  expect(submitted.get("password")).toBe("incorrect");
  expect(screen.getByLabelText("Username")).toHaveAttribute("aria-invalid", "true");
});

it("submits signup fields and displays field and password validation errors", async () => {
  const event = userEvent.setup();
  vi.mocked(signup).mockResolvedValue({
    errors: {
      username: ["Username taken"],
      displayName: ["Name too short"],
      password: ["Add a number", "Add a special character"],
    },
  });
  render(<SignupForm />);
  await event.type(screen.getByLabelText("Username"), "alice");
  await event.type(screen.getByLabelText("Display Name"), "A");
  await event.type(screen.getByLabelText("Password"), "password");
  await event.click(screen.getByRole("button", { name: "Confirm" }));
  expect(await screen.findByText("Username taken")).toBeVisible();
  expect(screen.getByText("Name too short")).toBeVisible();
  expect(screen.getByText("- Add a number")).toBeVisible();
  expect(screen.getByText("- Add a special character")).toBeVisible();
  const submitted = vi.mocked(signup).mock.calls[0][1];
  expect(Object.fromEntries(submitted)).toEqual({ username: "alice", displayName: "A", password: "password" });
});
