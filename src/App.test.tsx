import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { changeUrl, renderApp } from "./test/renderApp";
import { allLessons, allQuestions, foundations, visualQuestions } from "./data/curriculum";
import { formPractice } from "./data/mock";
import type { Attempt, Lesson, MockRunPatch } from "./data/types";
import { type ProgressSeed, progressSeed } from "../tests/fixtures/progressSeed";
import { emptySnapshot } from "./test/progress";
import { savedProgress as saved, seedProgress, settle, setupProgressApi } from "./test/progressApi";

let session: {
  lesson: Lesson;
  onComplete: (score: number, total: number) => void;
  onAttempt: (a: Attempt) => void;
  onClose: () => void;
  onDraft: (id: string, text: string) => void;
  onNext?: () => void;
};

vi.mock("./components/LessonSession", () => ({
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

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

const keptRun: MockRunPatch = {
  section: 0,
  index: 0,
  stage: "run",
  answers: {},
  deadline: Date.parse("2999-01-01T00:00:00Z"),
  started: "2026-09-09T08:00:00Z",
  drafts: {},
};

const mount = async (path = "today", p?: Partial<ProgressSeed>) => {
  if (p) {
    await seedProgress(p);
  }

  const view = await renderApp(`/${path}`);

  await settle();

  return view;
};

// The server keeps a question's mistake and review state only with an answer to it.
const withAnswers = (p: ProgressSeed, ids: string[], correct: boolean) => {
  ids.forEach((questionId) => {
    p.attempts.push({
      id: `answer-${p.attempts.length}`,
      questionId,
      skill: "reading",
      answer: "",
      correct,
      at: new Date(Date.parse("2026-09-01T08:00:00Z") + p.attempts.length * 60_000).toISOString(),
    });
  });

  return p;
};

const withMistakes = (p: ProgressSeed, ids: string[]) => {
  p.mistakes.push(...ids);

  return withAnswers(p, ids, false);
};

setupProgressApi();

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
  it("reviews eight mistakes in queue order without shuffling them by practice recency", async () => {
    const mistakes = allQuestions
      .slice(0, 10)
      .map((q) => q.id)
      .reverse();

    await mount("practice", withMistakes(progressSeed(), mistakes));
    click("My mistakes (10)");
    click("Review my mistakes");
    expect(session.lesson.questions.map((q) => q.id)).toEqual(mistakes.slice(0, 8));
    expect(session.lesson.title).toBe("A fresh look at your mistakes");
  });

  it("appends exam results without erasing an earlier rehearsal", async () => {
    vi.useFakeTimers();
    const now = new Date("2026-09-09T12:00:00Z");

    vi.setSystemTime(now);
    const p: ProgressSeed = progressSeed();

    p.mockResults = [{ at: "2026-09-08T12:00:00Z", reading: 10, listening: 12 }];

    p.mockRun = {
      section: 3,
      index: 0,
      stage: "review",
      answers: {},
      drafts: {},
      deadline: 0,
      started: now.toISOString(),
    };

    await mount("exam", p);
    click("See my results");
    await settle();

    expect((await saved()).mockResults.map(({ id: _, ...result }) => result)).toEqual([
      { at: "2026-09-08T12:00:00.000Z", reading: 10, listening: 12 },
      { at: "2026-09-09T12:00:00.000Z", reading: 0, listening: 0 },
    ]);

    click("Return to exam overview");
    await settle();
    expect((await saved()).mockResults).toHaveLength(2);
  });

  it("falls back from unknown links and handles external URL changes", async () => {
    await mount("unknown");

    expect(
      screen.getByRole("heading", { name: "A good day to learn Spanish." }),
    ).toBeInTheDocument();

    changeUrl("/guide");
    await settle();

    expect(screen.getByRole("heading", { name: "Your guide to DELE A1." })).toBeInTheDocument();
  });

  it("opens and closes mobile navigation via both overlay and links", async () => {
    await mount();
    click("Open navigation");
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeInTheDocument();
    click("Close navigation");
    expect(screen.queryByRole("button", { name: "Close navigation" })).not.toBeInTheDocument();
    click("Open navigation");
    click("Learning path");
    await settle();
    expect(window.location.pathname).toBe("/path");
    expect(screen.queryByRole("button", { name: "Close navigation" })).not.toBeInTheDocument();
  });

  it("chooses the first unfinished lesson, records attempts/drafts, and persists completion", async () => {
    const p = progressSeed();

    p.completed[allLessons[0].id] = { score: 8, total: 8, at: "2026-09-08T12:00:00Z" };
    await mount("today", p);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Keep the little steps going|Continue my journey|Let’s take the first step|Continue learning|Take the next step/,
      }),
    );

    expect(session.lesson.id).toBe(allLessons[1].id);
    act(() => session.onDraft("write", "Hola"));

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

    await settle();
    expect((await saved()).questions["u1-v0"]).toMatchObject({ correct: false, inMistakes: true });
    act(() => session.onComplete(2, 3));
    await settle();
    expect((await saved()).completed[allLessons[1].id]).toMatchObject({ score: 2, total: 3 });
    expect((await saved()).drafts).toEqual({});
    click("Test close session");
    expect(screen.queryByRole("region", { name: "Active lesson" })).not.toBeInTheDocument();
    await settle();
    expect((await saved()).drafts.write).toBe("Hola");
  });

  it("allows reopening completed units and reaches exam after the entire path", async () => {
    const p = progressSeed();

    for (const l of allLessons) {
      p.completed[l.id] = { score: 1, total: 1, at: "2026-09-08T12:00:00Z" };
    }

    await mount("path", p);
    expect(screen.getByRole("heading", { name: "The next chapter is yours." })).toBeInTheDocument();
    expect(screen.getAllByText("Complete")).toHaveLength(12);
    click("Meet the exam");
    await settle();
    expect(screen.getByRole("heading", { name: "Meet the exam." })).toBeInTheDocument();
  });

  it.each(["reading", "listening", "writing"] as const)(
    "selects %s questions with unpractised first and the correct session length",
    async (skill) => {
      const p = progressSeed();

      const bank = [...allQuestions, ...foundations, formPractice, ...visualQuestions].filter(
        (q) => q.skill === skill && q.kind !== "live",
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

      await mount("practice", p);
      click(skill[0].toUpperCase() + skill.slice(1));
      click(`Start ${skill} practice`);

      expect(session.lesson.questions).toHaveLength(skill === "writing" ? 4 : 8);

      expect(session.lesson.questions.every((q) => q.skill === skill)).toBe(true);
      expect(session.lesson.questions[0].id).toBe(bank[1].id);
      act(() => session.onComplete(4, 4));
      expect((await saved()).completed).toEqual({});
    },
  );

  it("revisits the least recently practised questions after all have been seen", async () => {
    const p = progressSeed();

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

    await mount("practice", p);
    click("Reading");
    click("Start reading practice");
    expect(session.lesson.questions[0].id).toBe(bank[3].id);
  });

  it("offers daily practice when the mistake queue is empty", async () => {
    await mount("practice");
    click("My mistakes (0)");

    expect(
      screen.getByRole("heading", { name: "A fresh page. A fresh start." }),
    ).toBeInTheDocument();

    click("Try a daily mix");
    expect(session.lesson.questions).toHaveLength(8);
    expect(session.lesson.title).toBe("Your daily mix");
  });

  it("saves trimmed preferences and resets only after confirmation", async () => {
    await mount("today", { mockRun: keptRun });
    click("Open your learning preferences");

    fireEvent.change(screen.getByRole("textbox", { name: "What should we call you?" }), {
      target: { value: " Ana " },
    });

    fireEvent.change(screen.getByRole("combobox", { name: "Your daily practice goal" }), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByLabelText(/Exam date/), { target: { value: "2026-10-09" } });
    click("Save preferences");
    await settle();
    expect(await saved()).toMatchObject({ name: "Ana", goal: 20, examDate: "2026-10-09" });
    expect(screen.getByRole("heading", { name: "Hola, Ana." })).toBeInTheDocument();
    click("Open your learning preferences");
    fireEvent.click(screen.getByText("Start over"));
    click("Reset my progress");
    click("Cancel");
    expect(await saved()).toMatchObject({ name: "Ana", mockRun: { stage: "run" } });
    click("Reset my progress");
    click("Clear my practice data");
    await settle();
    expect(await saved()).toEqual(emptySnapshot());
  });

  it("opens the exam overview after a reset made during a rehearsal", async () => {
    await mount("exam", { mockRun: keptRun });
    expect(screen.getByRole("timer")).toBeInTheDocument();
    click("Open your learning preferences");
    fireEvent.click(screen.getByText("Start over"));
    click("Reset my progress");
    click("Clear my practice data");
    await settle();

    changeUrl("/exam");
    await settle();

    expect(screen.getByRole("button", { name: "Start exam rehearsal" })).toBeInTheDocument();
    expect((await saved()).mockRun).toBeNull();
  });

  it("says when browser storage is unavailable and keeps saving online", async () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("full");
    });

    await mount();
    expect(screen.getByText(/Browser storage is unavailable/)).toBeInTheDocument();
    click("Open your learning preferences");

    fireEvent.change(screen.getByRole("textbox", { name: "What should we call you?" }), {
      target: { value: "Ana" },
    });

    click("Save preferences");
    await settle();
    expect(screen.getByRole("heading", { name: "Hola, Ana." })).toBeInTheDocument();
  });

  it("persists guide checks, toggles them off, and updates all four passing scores", async () => {
    await mount("guide");
    const first = screen.getAllByRole("checkbox")[0];

    fireEvent.click(first);
    await settle();
    expect((await saved()).checks).toHaveLength(1);
    fireEvent.click(first);
    await settle();
    expect((await saved()).checks).toEqual([]);
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

it("dashboard shortcuts select the promised skills and open preferences", async () => {
  await mount();

  for (const [name, skill] of [
    ["Tune your ear", "listening"],
    ["Make it stick", "all"],
  ]) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
    expect(session.lesson.id).toBe(`practice-${skill}`);
    click("Test close session");
  }

  for (const skill of ["Reading", "Listening", "Writing"]) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${skill}0 practised$`) }));
    expect(session.lesson.questions.every((q) => q.skill === skill.toLowerCase())).toBe(true);
    click("Test close session");
  }

  for (const name of [/Find your voice/, /^Speaking0 practised$/]) {
    fireEvent.click(screen.getByRole("button", { name }));
    expect(session.lesson.questions.map((q) => q.kind)).toEqual(["live"]);
    click("Test close session");
  }

  for (const name of ["Adjust your daily goal", "At your own pace", "Your Spanish journey"]) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
    expect(screen.getByRole("dialog", { name: "Your learning preferences" })).toBeInTheDocument();
    click("Close preferences");
  }
});

it("moves from a finished lesson straight to the next one on the path", async () => {
  await mount("path");
  fireEvent.click(screen.getByRole("button", { name: new RegExp(allLessons[0].title) }));
  act(() => session.onComplete(3, 4));
  act(() => session.onNext!());
  await settle();
  expect(screen.getByRole("heading", { name: allLessons[1].title })).toBeInTheDocument();
  expect((await saved()).completed[allLessons[0].id]).toMatchObject({ score: 3, total: 4 });
});

it("offers no next lesson after the last lesson or a practice session", async () => {
  const p = withMistakes(progressSeed(), [allQuestions[0].id]);

  for (const l of allLessons.slice(0, -1)) {
    p.completed[l.id] = { score: 1, total: 1, at: "2026-09-01T08:00:00Z" };
  }

  await mount("path", p);
  click("Continue learning");
  expect(session.lesson.id).toBe(allLessons.at(-1)!.id);
  expect(session.onNext).toBeUndefined();
  click("Test close session");
  changeUrl("/practice");
  await settle();
  click("My mistakes (1)");
  click("Review my mistakes");
  expect(session.lesson.title).toBe("A fresh look at your mistakes");
  expect(session.onNext).toBeUndefined();
});

it("opens individual path lessons and toggles unit expansion", async () => {
  await mount("path");
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

it("keeps old unknown mistake references safe and dismisses the notice", async () => {
  vi.useFakeTimers();
  const p = progressSeed();

  p.mistakes = ["deleted-question"];
  await mount("practice", p);
  fireEvent.click(screen.getByRole("button", { name: "My mistakes (0)" }));
  expect(screen.getByRole("heading", { name: "A fresh page. A fresh start." })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Try a daily mix/ }));
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("shows the first three units on Today", async () => {
  await mount();

  for (const title of ["¡Hola, mundo!", "This is me", "My favorite people"]) {
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  }

  expect(screen.queryByRole("heading", { name: "A place called home" })).not.toBeInTheDocument();
});

it("routes help, footer, path links and the brand consistently", async () => {
  await mount();

  for (const name of [
    "How the exam works",
    "Your exam, explained",
    "Independent practice · Official sources inside",
  ]) {
    click(name);
    await settle();
    expect(screen.getByRole("heading", { name: "Your guide to DELE A1." })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Paso home" }));
    await settle();
  }

  for (const name of ["View full path", "Home, cafés, adventures & 9 more chapters"]) {
    click(name);
    await settle();
    expect(screen.getByRole("heading", { name: "Every step has a story." })).toBeInTheDocument();
    click("My learning space");
    await settle();
  }
});

it.each([
  ["today", "A good day to learn Spanish."],
  ["path", "Every step has a story."],
  ["practice", "Your practice studio."],
  ["exam", "Meet the exam."],
  ["guide", "Your guide to DELE A1."],
])("shows exactly one main view for #%s", async (page, title) => {
  const { container } = await mount(page);

  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
  expect(container.querySelectorAll('nav [aria-current="page"]')).toHaveLength(1);
});

it("switches pages without retaining a previous main view", async () => {
  await mount();

  const steps = [
    ["Learning path", "Every step has a story."],
    ["Practice studio", "Your practice studio."],
    ["Exam rehearsal", "Meet the exam."],
    ["The A1 guide", "Your guide to DELE A1."],
    ["My learning space", "A good day to learn Spanish."],
  ];

  for (const [button, title] of steps) {
    click(button);
    await settle();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
  }
});

it("keeps other readiness points when one is unchecked", async () => {
  await mount("guide");
  const boxes = screen.getAllByRole("checkbox");

  fireEvent.click(boxes[0]);
  await settle();
  const [firstId] = (await saved()).checks;

  fireEvent.click(boxes[1]);
  await settle();
  const [secondId] = (await saved()).checks.filter((id) => id !== firstId);

  fireEvent.click(boxes[0]);
  await settle();
  expect((await saved()).checks).toEqual([secondId]);
  expect(boxes[1]).toBeChecked();
});

it("only unlocks flashcards after completing their vocabulary lesson", async () => {
  const p = progressSeed();

  p.completed["u1-grammar"] = { score: 1, total: 1, at: "2026-01-01T00:00:00Z" };
  await mount("practice", p);
  expect(screen.getByText("Your collection starts with a lesson.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Review flashcards" })).not.toBeInTheDocument();
  click("Explore lessons");
  await settle();
  expect(screen.getByRole("heading", { name: "Every step has a story." })).toBeInTheDocument();
});

it("preferences start closed and close after either Save or Close", async () => {
  await mount();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Close navigation" })).not.toBeInTheDocument();
  click("Open your learning preferences");
  click("Save preferences");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  click("Open your learning preferences");
  click("Close preferences");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("dashboard units expand independently and can collapse again", async () => {
  await mount();
  const second = screen.getByRole("button", { name: /UNIT 02/ });

  expect(second).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(second);
  expect(second).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(second);
  expect(second).toHaveAttribute("aria-expanded", "false");
});

it("counts partial unit completion and path percentage separately", async () => {
  const p = progressSeed();

  p.completed[allLessons[0].id] = { score: 4, total: 8, at: "2026-09-08T12:00:00Z" };
  await mount("path", p);
  expect(screen.getByText("1/4 lessons")).toBeInTheDocument();
  expect(screen.getByText("1/48 complete · 2% of your path")).toBeInTheDocument();
});

describe("app shell behavior kept through the component split", () => {
  it("queues due spaced reviews with open mistakes, earliest due first", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T12:00:00Z"));
    const [a, b, c, d, e, f] = allQuestions.slice(0, 6).map((q) => q.id);
    const p = withAnswers(withMistakes(progressSeed(), [a, b, f]), [c, d, e], true);

    p.mistakeReviews = {
      [a]: { level: 0, nextAt: "2026-09-09T12:00:00Z" },
      [b]: { level: 2, nextAt: "2026-09-06T12:00:00Z" },
      [c]: { level: 1, nextAt: "2026-09-07T12:00:00Z" },
      [d]: { level: 1, nextAt: "2026-09-10T12:00:00Z" },
      [e]: { level: 0, nextAt: "2026-09-09T12:00:00Z" },
      [f]: { level: 1, nextAt: "2026-09-10T12:00:00Z" },
      "deleted-question": { level: 1, nextAt: "2026-09-01T12:00:00Z" },
    };

    await mount("today", withAnswers(p, ["deleted-question"], false));
    fireEvent.click(screen.getByRole("button", { name: /5 mistakes to revisit/ }));
    expect(session.lesson.id).toBe("practice-mistakes");
    expect(session.lesson.questions.map((q) => q.id)).toEqual([b, c, a, e, f]);
  });

  it("starts a skill session from its practice studio card", async () => {
    await mount("practice");

    for (const [skill, count] of [
      ["Listening", 8],
      ["Writing", 4],
    ] as const) {
      fireEvent.click(
        screen.getByRole("button", { name: new RegExp(`${skill}\\s*0 questions practised`) }),
      );

      expect(session.lesson.title).toBe(`${skill} practice`);
      expect(session.lesson.questions).toHaveLength(count);
      expect(session.lesson.questions.every((q) => q.skill === skill.toLowerCase())).toBe(true);
      click("Test close session");
    }
  });

  it("confirms a reset on the dashboard with a notice that clears itself after four seconds", async () => {
    vi.useFakeTimers();
    await mount("path");
    click("Open your learning preferences");
    fireEvent.click(screen.getByText("Start over"));
    click("Reset my progress");
    click("Clear my practice data");
    await settle();
    expect(window.location.pathname).toBe("/today");

    expect(
      screen.getByRole("heading", { name: "A good day to learn Spanish." }),
    ).toBeInTheDocument();

    expect(screen.getByRole("status")).toHaveTextContent(
      "A fresh start. Your practice data has been cleared.",
    );

    act(() => vi.advanceTimersByTime(3999));
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("moves focus to the main content from the skip link without changing the page", async () => {
    const scrollIntoView = vi.fn();

    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    await mount("practice");
    fireEvent.click(screen.getByRole("link", { name: "Skip to content" }));
    expect(screen.getByRole("main")).toHaveFocus();
    expect(scrollIntoView).toHaveBeenCalledOnce();
    expect(window.location.pathname).toBe("/practice");
    delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
  });

  it("shows the current page, progress stats, name and mistake count in the top bar and sidebar", async () => {
    const p = withMistakes(progressSeed(), [allQuestions[0].id, allQuestions[1].id]);

    p.name = "ana";

    p.attempts.push({
      id: "1",
      questionId: allQuestions[2].id,
      skill: allQuestions[2].skill,
      answer: allQuestions[2].answer,
      correct: true,
      at: new Date().toISOString(),
    });

    const { container } = await mount("practice", p);

    expect(container.querySelector(".breadcrumb strong")).toHaveTextContent("Practice studio");

    expect(screen.getByTitle("Consecutive practice days")).toHaveTextContent("1day streak");

    expect(container.querySelector(".xp-stat")).toHaveTextContent("15 XP");

    expect(
      screen.getByRole("button", { name: "Open your learning preferences" }),
    ).toHaveTextContent("A");

    expect(screen.getByRole("button", { name: /ana\s*Learning at your pace/ })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Practice studio/ })).toHaveTextContent(
      "Practice studio2",
    );

    click("Learning path");
    await settle();
    expect(container.querySelector(".breadcrumb strong")).toHaveTextContent("Learning path");
  });
});

it("renders a truthful fresh dashboard and the full learning path", async () => {
  await mount("today");

  expect(screen.getByRole("heading", { name: "A good day to learn Spanish." })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Learning path" }));
  await settle();

  expect(
    screen.getByText("12 units · 48 lessons · 264 exercises. Explore freely, or follow the path."),
  ).toBeInTheDocument();

  expect(screen.getByRole("heading", { name: "Ready for your next chapter" })).toBeInTheDocument();
});

describe("progress on the server", () => {
  const refuse = (response: () => Promise<Response>) =>
    vi.mocked(fetch).mockImplementationOnce(response);

  it("shows a quiet loading screen, then a load error with Retry", async () => {
    refuse(() => Promise.reject(new TypeError("Failed to fetch")));
    await renderApp("/today");
    expect(screen.getByRole("status")).toHaveTextContent("Loading your progress…");
    await settle();

    expect(
      screen.getByRole("heading", { name: "Your progress could not be loaded." }),
    ).toBeInTheDocument();

    click("Retry");
    await settle();
    expect(screen.getByRole("heading", { name: "A good day to learn Spanish." })).toBeVisible();
  });

  it("opens without a passcode and sends none, even when the live talk stored one", async () => {
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));
    await mount();

    expect(screen.getByRole("heading", { name: "A good day to learn Spanish." })).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    expect(vi.mocked(fetch).mock.calls.at(-1)?.[1]?.headers).not.toHaveProperty("x-passcode");
  });

  it("shows a rate-limited load as a load error with Retry", async () => {
    refuse(async () => Response.json({ error: "rate" }, { status: 429 }));
    await mount();

    expect(
      screen.getByRole("heading", { name: "Your progress could not be loaded." }),
    ).toBeInTheDocument();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("holds answers behind a failed write until Retry saves them in order", async () => {
    await mount("path");
    click("Continue learning");
    refuse(async () => new Response("{}", { status: 503 }));

    act(() =>
      session.onAttempt({
        id: "first",
        questionId: "u1-v0",
        skill: "reading",
        answer: "wrong",
        correct: false,
        at: "2026-09-09T10:00:00.000Z",
      }),
    );

    await settle();
    expect(screen.getByRole("dialog", { name: "Progress not saved" })).toBeInTheDocument();
    act(() => session.onComplete(0, 1));
    await settle();
    expect((await saved()).completed).toEqual({});

    click("Retry");
    await settle();
    expect(screen.queryByRole("dialog", { name: "Progress not saved" })).not.toBeInTheDocument();
    expect((await saved()).recent.map((a) => a.id)).toEqual(["first"]);
    expect(Object.keys((await saved()).completed)).toEqual([allLessons[0].id]);
  });
});
