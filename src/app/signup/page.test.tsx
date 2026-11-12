// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import Home from "./page";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => createElement("img", props),
}));

describe("Home page", () => {
  it("renders the signup form", () => {
    render(<Home />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
