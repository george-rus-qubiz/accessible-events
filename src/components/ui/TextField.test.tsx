import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("is labelled and valid when there is no error", () => {
    render(<TextField label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("links the error message to the input", () => {
    render(<TextField label="Email" error="Email is required." />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Error: Email is required.");
  });

  it("keeps an existing description alongside the error", () => {
    render(
      <>
        <p id="hint">We never share it.</p>
        <TextField
          label="Email"
          aria-describedby="hint"
          error="Email is required."
        />
      </>,
    );
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
      "We never share it. Error: Email is required.",
    );
  });
});
