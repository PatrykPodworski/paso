import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { units } from "../../data/curriculum";
import { mockQuestions } from "../../data/mock";
import { BackofficePage } from "./BackofficePage";

const writeText = vi.fn((_text: string) => Promise.resolve());

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

afterEach(() => {
  localStorage.clear();
  writeText.mockClear();
});

const openTab = (name: RegExp) => {
  render(<BackofficePage setSession={() => {}} />);
  fireEvent.click(screen.getByRole("tab", { name }));
};

const filter = (unit: string, search: string) => {
  fireEvent.change(screen.getByRole("combobox", { name: "Unit" }), { target: { value: unit } });

  fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), {
    target: { value: search },
  });
};

it("counts the assets of each kind on its tab", () => {
  render(<BackofficePage setSession={() => {}} />);

  const exercises =
    units.flatMap((u) => u.lessons.flatMap((l) => l.questions)).length + mockQuestions.length;

  expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual([
    `Exercises${exercises}`,
    "Audio2055",
    "Images39",
  ]);
});

it("filters the audio by unit and by text or key, accent-blind, with the clip's key and file", () => {
  openTab(/Audio/);
  expect(screen.getByRole("combobox", { name: "Unit" })).toHaveValue("Unit 1");
  expect(screen.getByText("24 of 2055 shown · 0 flagged")).toBeInTheDocument();

  filter("Unit 4", "v6yukl");
  const rows = screen.getAllByRole("listitem");

  expect(rows.map((r) => within(r).getByRole("checkbox").getAttribute("aria-label"))).toEqual([
    "Flawed: la cocina",
  ]);

  expect(rows[0]).toHaveTextContent(
    "Unit 4 · audio:v6yukl · /audio/voxcpm/401bff33039f205fe74afd37.mp3",
  );

  expect(screen.getByText("1 of 2055 shown · 0 flagged")).toBeInTheDocument();

  filter("Unit 1", "adios");
  expect(screen.getByRole("listitem")).toHaveTextContent("adiós");

  filter("Unit 2", "adios");
  expect(screen.getByText("No clip matches these filters.")).toBeInTheDocument();
});

it("copies the flagged ids of both kinds as plain lines, and keeps them after a reload", async () => {
  openTab(/Audio/);
  filter("Unit 4", "v6yukl");
  fireEvent.click(screen.getByRole("checkbox", { name: "Flawed: la cocina" }));

  fireEvent.click(screen.getByRole("tab", { name: /Images/ }));
  filter("Unit 1", "hola");
  fireEvent.click(screen.getByRole("checkbox", { name: "Flawed: hola" }));
  fireEvent.click(screen.getByRole("button", { name: "Copy 2 IDs" }));

  expect(writeText.mock.calls).toEqual([["audio:v6yukl\nimage:hola.webp"]]);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied 2 IDs."));

  cleanup();
  openTab(/Images/);

  expect(screen.getByRole("button", { name: "Copy 2 IDs" })).toBeEnabled();
});

it("flags every visible asset at once, then clears them", () => {
  openTab(/Images/);
  filter("Unit 1", "");
  const all = screen.getByRole("checkbox", { name: /Select all visible/ });

  fireEvent.click(screen.getByRole("checkbox", { name: "Flawed: hola" }));
  expect(all).toHaveAttribute("aria-checked", "mixed");

  fireEvent.click(all);
  expect(screen.getByText("8 of 39 shown · 8 flagged")).toBeInTheDocument();
  expect(all).toHaveAttribute("aria-checked", "true");

  fireEvent.click(all);
  expect(screen.getByRole("button", { name: "Copy 0 IDs" })).toBeDisabled();
});

it("shows each picture at card size and at 96 px, and the words still on an emoji", () => {
  openTab(/Images/);
  filter("All units", "hola");
  const hola = screen.getByRole("listitem");

  expect(
    within(hola)
      .getAllByRole("img")
      .map((i) => i.getAttribute("src")),
  ).toEqual(["/illustrations/words/hola.webp", "/illustrations/words/hola.webp"]);

  expect(hola).toHaveTextContent("Unit 1 · image:hola.webp · /illustrations/words/hola.webp");

  filter("All units", "");
  expect(screen.getAllByText("Emoji fallback")).toHaveLength(57);
  expect(screen.getAllByRole("checkbox", { name: /^Flawed/ })).toHaveLength(39);
});

it("plays the exact file a row lists, even a clip saved without its text", () => {
  const played: string[] = [];

  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(
    function (this: HTMLMediaElement) {
      played.push(new URL(this.src).pathname);

      return Promise.resolve();
    },
  );

  openTab(/Audio/);
  filter("Other", "1r7h0dt");
  fireEvent.click(screen.getByRole("button", { name: "Play “No text recorded”" }));

  expect(played).toEqual(["/audio/elevenlabs/8400afd6a427915cd24228e7.mp3"]);
});
