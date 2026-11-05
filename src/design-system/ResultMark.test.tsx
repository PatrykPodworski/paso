import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultMark } from "./ResultMark";

describe("result mark", () => {
  it.each([
    ["correct", "/icons/result-correct.svg"],
    ["wrong", "/icons/result-wrong.svg"],
  ] as const)("shows the %s papercut asset", (result, src) => {
    render(<ResultMark result={result} label="Result" />);

    expect(screen.getByRole("img", { name: "Result" })).toHaveAttribute("src", src);
  });

  it("is decorative without a label", () => {
    const { container } = render(<ResultMark result="correct" />);

    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("renders at the requested size", () => {
    render(<ResultMark result="wrong" size={36} label="Incorrect" />);

    const mark = screen.getByRole("img", { name: "Incorrect" });

    expect(mark).toHaveAttribute("width", "36");
    expect(mark).toHaveAttribute("height", "36");
  });
});
