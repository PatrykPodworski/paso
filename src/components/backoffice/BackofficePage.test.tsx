import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { allLessons, units } from "../../data/curriculum";
import { mockSections } from "../../data/mock";
import type { Lesson } from "../../data/types";
import { BackofficePage } from "./BackofficePage";

it("lists every question of every unit and of the mock exam, grouped by unit", () => {
  render(<BackofficePage setSession={() => {}} />);
  const groups = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);

  expect(groups.slice(0, 2)).toEqual(["Unit 1 · ¡Hola, mundo!", "Unit 2 · This is me"]);
  expect(groups).toHaveLength(units.length + 1);
  expect(groups.at(-1)).toBe("Mock exam");

  expect(screen.getAllByRole("button")).toHaveLength(
    units.flatMap((u) => u.lessons.flatMap((l) => l.questions)).length +
      mockSections.flatMap((s) => s.questions).length,
  );

  const mock = within(screen.getByRole("region", { name: "Mock exam" }));

  expect(
    mock.getByRole("button", { name: /Task 1 · Personal presentation · 1–2 min/ }),
  ).toHaveTextContent("SpeakingTask 1 · Personal presentation · 1–2 minSpeaking");
});

it("labels unit 1's live talk and opens it alone, off the learning path", () => {
  let lesson: Lesson | undefined;

  render(<BackofficePage setSession={(l) => (lesson = l)} />);
  const unit = within(screen.getByRole("region", { name: "Unit 1 · ¡Hola, mundo!" }));
  const row = unit.getByRole("button", { name: /Talk to Lucía/ });

  expect(within(row).getByText("Live talk")).toBeInTheDocument();
  expect(within(row).getByText("Make it your own")).toBeInTheDocument();
  fireEvent.click(row);
  expect(lesson?.questions.map((q) => q.id)).toEqual(["u1-o3"]);
  expect(lesson?.title).toBe("Make it your own");
  expect(allLessons.some((l) => l.id === lesson?.id)).toBe(false);
});
