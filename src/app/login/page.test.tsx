// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import SignUp from "./page";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => createElement("img", props),
}));

describe("SignUp page", () => {
  it("renders the signup form", () => {
    render(<SignUp />);
    expect(
      screen.getByRole('form', { name: /login/i })
    ).toBeInTheDocument()
  });
});
