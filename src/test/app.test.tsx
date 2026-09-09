import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { allLessons, allQuestions, foundations, visualQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import { emptyProgress, STORAGE_KEY } from "../data/progress";
import type { Attempt, Lesson, Progress } from "../data/types";
import { Blob as NodeBlob } from "node:buffer";
let session: {
  lesson: Lesson;
  onComplete: (score: number, total: number) => void;
  onAttempt: (a: Attempt) => void;
  onClose: () => void;
  onDraft: (id: string, text: string) => void;
};
vi.mock("../components/LessonSession", () => ({
  LessonSession: (props: typeof session) => {
    session = props;
    return (
      <section aria-label="Active lesson">
        <h2>{props.lesson.title}</h2>
        <button onClick={props.onClose}>Test close session</button>
      </section>
    );
  },
}));
const saved = (): Progress => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const mount = (hash = "today", p = emptyProgress()) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  window.location.hash = hash;
  return render(<App />);
};
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("app business orchestration", () => {
  it("reviews eight mistakes in queue order without shuffling them by practice recency", () => {
    const p = emptyProgress();
    p.mistakes = allQuestions
      .slice(0, 10)
      .map((q) => q.id)
      .reverse();
    mount("practice", p);
    click("My mistakes (10)");
    click("Review my mistakes");
    expect(session.lesson.questions.map((q) => q.id)).toEqual(p.mistakes.slice(0, 8));
    expect(session.lesson.title).toBe("A fresh look at your mistakes");
  });
  it("appends exam results without erasing an earlier rehearsal", () => {
    vi.useFakeTimers();
    const now = new Date("2026-09-09T12:00:00Z");
    vi.setSystemTime(now);
    const p = emptyProgress();
    p.mockResults = [{ at: "2026-09-08T12:00:00Z", reading: 10, listening: 12 }];
    localStorage.setItem(
      "paso-mock-v1",
      JSON.stringify({
        section: 3,
        index: 0,
        stage: "review",
        answers: {},
        drafts: {},
        deadline: 0,
        started: now.toISOString(),
      }),
    );
    mount("exam", p);
    click("See my results");
    expect(saved().mockResults).toEqual([
      ...p.mockResults,
      { at: now.toISOString(), reading: 0, listening: 0 },
    ]);
    click("Return to exam overview");
    expect(saved().mockResults).toHaveLength(2);
  });
  it("falls back from unknown links and handles external hash changes", () => {
    mount("unknown");
    expect(
      screen.getByRole("heading", { name: "A good day to learn Spanish." }),
    ).toBeInTheDocument();
    act(() => {
      window.location.hash = "guide";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByRole("heading", { name: "Your guide to DELE A1." })).toBeInTheDocument();
  });
  it("opens and closes mobile navigation via both overlay and links", () => {
    mount();
    click("Open navigation");
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeInTheDocument();
    click("Close navigation");
    expect(screen.queryByRole("button", { name: "Close navigation" })).not.toBeInTheDocument();
    click("Open navigation");
    click("Learning path");
    expect(window.location.hash).toBe("#path");
    expect(screen.queryByRole("button", { name: "Close navigation" })).not.toBeInTheDocument();
  });
  it("chooses the first unfinished lesson, records attempts/drafts, and persists completion", () => {
    const p = emptyProgress();
    p.completed[allLessons[0].id] = { score: 8, total: 8, at: "date" };
    mount("today", p);
    fireEvent.click(
      screen.getByRole("button", {
        name: /Keep the little steps going|Continue my journey|Let’s take the first step|Continue learning|Take the next step/,
      }),
    );
    expect(session.lesson.id).toBe(allLessons[1].id);
    act(() => session.onDraft("write", "Hola"));
    expect(saved().drafts.write).toBe("Hola");
    act(() =>
      session.onAttempt({
        id: "1",
        questionId: "u1-v0",
        skill: "reading",
        answer: "wrong",
        correct: false,
        at: new Date().toISOString(),
      }),
    );
    expect(saved().mistakes).toEqual(["u1-v0"]);
    act(() => session.onComplete(2, 3));
    expect(saved().completed[allLessons[1].id]).toMatchObject({ score: 2, total: 3 });
    click("Test close session");
    expect(screen.queryByRole("region", { name: "Active lesson" })).not.toBeInTheDocument();
  });
  it("allows reopening completed units and reaches exam after the entire path", () => {
    const p = emptyProgress();
    for (const l of allLessons) {
      p.completed[l.id] = { score: 1, total: 1, at: "date" };
    }
    mount("path", p);
    expect(screen.getByRole("heading", { name: "The next chapter is yours." })).toBeInTheDocument();
    expect(screen.getAllByText("Complete")).toHaveLength(12);
    click("Meet the exam");
    expect(screen.getByRole("heading", { name: "Meet the exam." })).toBeInTheDocument();
  });
  it.each(["reading", "listening", "writing", "speaking"] as const)(
    "selects %s questions with unpractised first and the correct session length",
    (skill) => {
      const p = emptyProgress();
      const bank = [...allQuestions, ...foundations, formPractice, ...visualQuestions].filter(
        (q) => q.skill === skill,
      );
      p.attempts = [
        {
          id: "one",
          questionId: bank[0].id,
          answer: "old",
          correct: true,
          skill,
          at: "2026-09-08T12:00:00Z",
        },
      ];
      mount("practice", p);
      click(skill[0].toUpperCase() + skill.slice(1));
      click(`Start ${skill} practice`);
      expect(session.lesson.questions).toHaveLength(
        skill === "writing" || skill === "speaking" ? 4 : 8,
      );
      expect(session.lesson.questions.every((q) => q.skill === skill)).toBe(true);
      expect(session.lesson.questions[0].id).toBe(bank[1].id);
      act(() => session.onComplete(4, 4));
      expect(saved().completed).toEqual({});
    },
  );
  it("revisits the least recently practised questions after all have been seen", () => {
    const p = emptyProgress();
    const bank = [...allQuestions, ...foundations, formPractice, ...visualQuestions].filter(
      (q) => q.skill === "reading",
    );
    p.attempts = bank.map((q, i) => ({
      id: String(i),
      questionId: q.id,
      answer: "old",
      correct: true,
      skill: "reading",
      at: i === 3 ? "2026-09-01T00:00:00Z" : "2026-09-08T00:00:00Z",
    }));
    mount("practice", p);
    click("Reading");
    click("Start reading practice");
    expect(session.lesson.questions[0].id).toBe(bank[3].id);
  });
  it("resolves mistake IDs safely, explains each one and opens an individual retry", () => {
    const p = emptyProgress();
    p.mistakes = ["not-in-course", allQuestions[0].id];
    mount("practice", p);
    click("My mistakes (1)");
    expect(screen.getByText(/1 questions are ready/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(allQuestions[0].prompt));
    expect(screen.getByText(allQuestions[0].explanation)).toBeInTheDocument();
    click("Try again");
    expect(session.lesson.questions).toEqual([allQuestions[0]]);
  });
  it("offers daily practice when the mistake queue is empty", () => {
    mount("practice");
    click("My mistakes (0)");
    expect(
      screen.getByRole("heading", { name: "A fresh page. A fresh start." }),
    ).toBeInTheDocument();
    click("Try a daily mix");
    expect(session.lesson.questions).toHaveLength(8);
    expect(session.lesson.title).toBe("Your daily mix");
  });
  it("launches each focused practice bank", () => {
    mount("practice");
    for (const [title, questions] of [
      ["Picture this", visualQuestions],
      ["The foundation lab", foundations],
      ["Fill in your story", [formPractice]],
    ] as const) {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(title) }));
      expect(session.lesson.questions).toEqual(questions);
      click("Test close session");
    }
  });
  it("searches unlocked vocabulary in either language and clears an empty result", () => {
    const p = emptyProgress();
    p.completed["u6-words"] = { score: 1, total: 1, at: "2026-01-01T00:00:00Z" };
    mount("practice", p);
    fireEvent.change(screen.getByRole("textbox", { name: "Search vocabulary" }), {
      target: { value: "COFFEE" },
    });
    expect(screen.getByText("el café")).toBeInTheDocument();
    expect(screen.getByText("coffee")).toBeInTheDocument();
    expect(saved().vocabularyReviews).toEqual({});
    fireEvent.change(screen.getByRole("textbox", { name: "Search vocabulary" }), {
      target: { value: "zzzzzz" },
    });
    expect(screen.getByRole("heading", { name: "No word found yet." })).toBeInTheDocument();
    click("Clear search");
    expect(document.querySelectorAll(".vocabulary-list li")).toHaveLength(8);
  });
  it("saves trimmed preferences and resets only after confirmation", () => {
    mount();
    click("Open your learning preferences");
    fireEvent.change(screen.getByRole("textbox", { name: "What should we call you?" }), {
      target: { value: " Ana " },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Your daily practice goal" }), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText(/Exam date/), { target: { value: "2026-10-09" } });
    click("Save preferences");
    expect(saved()).toMatchObject({ name: "Ana", goal: 20, examDate: "2026-10-09" });
    expect(screen.getByRole("heading", { name: "Hola, Ana." })).toBeInTheDocument();
    click("Open your learning preferences");
    fireEvent.click(screen.getByText("Start over"));
    click("Reset my progress");
    click("Cancel");
    expect(saved().name).toBe("Ana");
    localStorage.setItem("paso-mock-v1", "saved mock");
    click("Reset my progress");
    click("Clear my practice data");
    expect(saved()).toEqual(emptyProgress());
    expect(localStorage.getItem("paso-mock-v1")).toBeNull();
  });
  it("exports real progress and revokes the temporary URL", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T12:00:00Z"));
    vi.stubGlobal("Blob", NodeBlob);
    const p = emptyProgress();
    p.name = "Ana";
    const create = vi.fn((_blob: Blob) => "blob:export");
    vi.stubGlobal(
      "URL",
      Object.assign(class extends URL {}, { createObjectURL: create, revokeObjectURL: vi.fn() }),
    );
    const clicked = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    mount("today", p);
    click("Open your learning preferences");
    click("Export progress");
    expect(create.mock.calls[0][0]).toBeInstanceOf(Blob);
    expect(create.mock.calls[0][0].type).toBe("application/json");
    expect(JSON.parse(await create.mock.calls[0][0].text())).toEqual(p);
    expect((clicked.mock.instances[0] as HTMLAnchorElement).download).toBe(
      "paso-progress-2026-09-09.json",
    );
    expect(clicked).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(1000));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:export");
  });
  it("reports persistence failures and keeps the current session usable", () => {
    mount();
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("full");
    });
    click("Open your learning preferences");
    fireEvent.change(screen.getByRole("textbox", { name: "What should we call you?" }), {
      target: { value: "Ana" },
    });
    click("Save preferences");
    expect(screen.getByText(/Browser storage is unavailable/)).toBeInTheDocument();
  });
  it("persists guide checks, toggles them off, and updates all four passing scores", () => {
    mount("guide");
    const first = screen.getAllByRole("checkbox")[0];
    fireEvent.click(first);
    expect(saved().checks).toHaveLength(1);
    fireEvent.click(first);
    expect(saved().checks).toEqual([]);
    const sliders = screen.getAllByRole("slider");
    [25, 25, 0, 0].forEach((score, i) =>
      fireEvent.change(sliders[i], { target: { value: String(score) } }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("do not meet the passing rule");
    [15, 15, 15, 15].forEach((score, i) =>
      fireEvent.change(sliders[i], { target: { value: String(score) } }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "These example scores meet the passing rule.",
    );
  });
});

it("dashboard shortcuts select the promised skills and open preferences", () => {
  mount();
  for (const [name, skill] of [
    ["Tune your ear", "listening"],
    ["Find your voice", "speaking"],
    ["Make it stick", "all"],
  ]) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
    expect(session.lesson.id).toBe(`practice-${skill}`);
    click("Test close session");
  }
  for (const skill of ["Reading", "Listening", "Writing", "Speaking"]) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${skill}0 practised$`) }));
    expect(session.lesson.questions.every((q) => q.skill === skill.toLowerCase())).toBe(true);
    click("Test close session");
  }
  for (const name of ["Adjust your daily goal", "At your own pace", "Your Spanish journey"]) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
    expect(screen.getByRole("dialog", { name: "Your learning preferences" })).toBeInTheDocument();
    click("Close preferences");
  }
});
it("opens individual path lessons and toggles unit expansion", () => {
  mount("path");
  const first = screen.getByRole("button", { name: new RegExp(allLessons[0].title) });
  fireEvent.click(first);
  expect(session.lesson.id).toBe(allLessons[0].id);
  click("Test close session");
  click("Continue learning");
  expect(session.lesson.id).toBe(allLessons[0].id);
  click("Test close session");
  const summary = screen.getAllByRole("button", { expanded: true })[0];
  fireEvent.click(summary);
  expect(summary).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(summary);
  expect(summary).toHaveAttribute("aria-expanded", "true");
});
it("keeps old unknown mistake references safe and dismisses the notice", () => {
  vi.useFakeTimers();
  const p = emptyProgress();
  p.mistakes = ["deleted-question"];
  mount("practice", p);
  fireEvent.click(screen.getByRole("button", { name: "My mistakes (0)" }));
  expect(screen.getByRole("heading", { name: "A fresh page. A fresh start." })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Try a daily mix/ }));
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
it("routes help, footer, path links and the brand consistently", () => {
  mount();
  for (const name of [
    "How the exam works",
    "Your exam, explained",
    "Independent practice · Official sources inside",
  ]) {
    click(name);
    expect(screen.getByRole("heading", { name: "Your guide to DELE A1." })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Paso home" }));
  }
  for (const name of ["View full path", "Home, cafés, adventures & 6 more chapters"]) {
    click(name);
    expect(screen.getByRole("heading", { name: "Every step has a story." })).toBeInTheDocument();
    click("My learning space");
  }
});

it.each([
  [0, 5, "0%", "A few minutes. A little more confidence."],
  [1, 5, "20%", "You’re building a lovely habit."],
  [5, 5, "100%", "Daily goal reached. ¡Muy bien!"],
  [6, 5, "100%", "Daily goal reached. ¡Muy bien!"],
])("renders the bounded daily goal for %s of %s answers", (count, goal, width, message) => {
  const p = emptyProgress();
  p.goal = goal as number;
  p.attempts = allQuestions.slice(0, count as number).map((q, i) => ({
    id: String(i),
    questionId: q.id,
    skill: q.skill,
    answer: q.answer,
    correct: true,
    at: new Date().toISOString(),
  }));
  const { container } = mount("today", p);
  expect(screen.getByText(message as string)).toBeInTheDocument();
  expect(
    (container.querySelector(".goal-ring") as HTMLElement).style.getPropertyValue("--goal"),
  ).toBe(width);
});
it.each([
  ["2026-09-08", "Keep your Spanish growing"],
  ["2026-09-09", "Your exam day"],
  ["2026-09-10", "1 days to your exam"],
])("calculates the local exam countdown for %s", (date, label) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 9, 12));
  const p = emptyProgress();
  p.examDate = date;
  mount("today", p);
  expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
});
it.each([
  [11, "BUENOS DÍAS"],
  [12, "BUENAS TARDES"],
  [19, "BUENAS TARDES"],
  [20, "BUENAS NOCHES"],
])("uses the appropriate local greeting at %s", (hour, label) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 9, hour as number));
  mount();
  expect(screen.getByText(new RegExp(label as string))).toBeInTheDocument();
});

it.each([
  ["today", "A good day to learn Spanish."],
  ["path", "Every step has a story."],
  ["practice", "Your practice studio."],
  ["exam", "Meet the exam."],
  ["guide", "Your guide to DELE A1."],
])("shows exactly one main view for #%s", (page, title) => {
  const { container } = mount(page);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
  expect(container.querySelectorAll('nav [aria-current="page"]')).toHaveLength(1);
});
it("switches pages without retaining a previous main view", () => {
  mount();
  const steps = [
    ["Learning path", "Every step has a story."],
    ["Practice studio", "Your practice studio."],
    ["Exam rehearsal", "Meet the exam."],
    ["The A1 guide", "Your guide to DELE A1."],
    ["My learning space", "A good day to learn Spanish."],
  ];
  for (const [button, title] of steps) {
    click(button);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
  }
});

it("keeps other readiness points when one is unchecked", () => {
  mount("guide");
  const boxes = screen.getAllByRole("checkbox");
  fireEvent.click(boxes[0]);
  fireEvent.click(boxes[1]);
  const secondId = saved().checks[1];
  fireEvent.click(boxes[0]);
  expect(saved().checks).toEqual([secondId]);
  expect(boxes[1]).toBeChecked();
});
it("only unlocks flashcards after completing their vocabulary lesson", () => {
  const p = emptyProgress();
  p.completed["u1-grammar"] = { score: 1, total: 1, at: "2026-01-01T00:00:00Z" };
  mount("practice", p);
  expect(screen.getByText("Your collection starts with a lesson.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Review flashcards" })).not.toBeInTheDocument();
  click("Explore lessons");
  expect(screen.getByRole("heading", { name: "Every step has a story." })).toBeInTheDocument();
});
it("preferences start closed and close after either Save or Close", () => {
  mount();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Close navigation" })).not.toBeInTheDocument();
  click("Open your learning preferences");
  click("Save preferences");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  click("Open your learning preferences");
  click("Close preferences");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
it("dashboard units expand independently and can collapse again", () => {
  mount();
  const second = screen.getByRole("button", { name: /UNIT 02/ });
  expect(second).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(second);
  expect(second).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(second);
  expect(second).toHaveAttribute("aria-expanded", "false");
});
it("counts partial unit completion and path percentage separately", () => {
  const p = emptyProgress();
  p.completed[allLessons[0].id] = { score: 4, total: 8, at: "date" };
  mount("path", p);
  expect(screen.getByText("1/4 lessons")).toBeInTheDocument();
  expect(screen.getByText("1/48 complete · 2% of your path")).toBeInTheDocument();
});
it("renders the week from Monday through Sunday with per-day unique answers", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 9, 12));
  const p = emptyProgress();
  p.attempts = [
    {
      id: "one",
      questionId: "one",
      skill: "reading",
      answer: "hola",
      correct: true,
      at: new Date(2026, 8, 7, 12).toISOString(),
    },
    {
      id: "again",
      questionId: "one",
      skill: "reading",
      answer: "hola",
      correct: true,
      at: new Date(2026, 8, 7, 13).toISOString(),
    },
  ];
  const { container } = mount("today", p);
  const days = [...container.querySelectorAll(".week-dots > div")];
  expect(days.map((day) => day.querySelector("span")?.textContent)).toEqual([
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S",
  ]);
  expect(days[0].querySelector("i")?.title).toContain("1 exercises");
  expect(days.slice(1).every((day) => day.querySelector("i")?.title.includes("0 exercises"))).toBe(
    true,
  );
});
