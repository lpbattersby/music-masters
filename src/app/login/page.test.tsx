// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import Login from "./page";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => createElement("img", props),
}));

describe("Login page", () => {
  it("renders the login form", () => {
    render(<Login />);
    expect(
      screen.getByRole('form', { name: /login/i })
    ).toBeInTheDocument()
  });
});
