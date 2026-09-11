import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { allLessons, allQuestions, foundations, units, visualQuestions } from "./data/curriculum";
import { formPractice } from "./data/mock";
import type { Attempt, Lesson, Progress, Skill, Unit } from "./data/types";
import {
  dailyAnswers,
  emptyProgress,
  localDate,
  readProgress,
  reviewDue,
  skillStats,
  STORAGE_KEY,
  streak,
  withAttempt,
  xp,
} from "./data/progress";
import { Icon } from "./components/Icon";
import { MemoryHint } from "./components/MemoryHint";
import { JourneyArt, Stamp } from "./components/Art";
import { AudioButton } from "./components/Audio";
import { Dialog } from "./components/Dialog";
import { LessonSession } from "./components/LessonSession";
import { Guide } from "./components/Guide";
import { MockExam } from "./components/MockExam";
import { PocketVocabulary } from "./components/PocketVocabulary";
const exerciseBank = [...allQuestions, ...foundations, formPractice, ...visualQuestions];
const exerciseMap = new Map(exerciseBank.map((q) => [q.id, q]));
type Page = "today" | "path" | "practice" | "exam" | "guide";
const navigation: { id: Page; label: string; icon: string }[] = [
  { id: "today", label: "My learning space", icon: "home" },
  { id: "path", label: "Learning path", icon: "map" },
  { id: "practice", label: "Practice studio", icon: "layers" },
  { id: "exam", label: "Exam rehearsal", icon: "flag" },
  { id: "guide", label: "The A1 guide", icon: "book" },
];
const skills: { id: Skill; name: string; spanish: string; icon: string }[] = [
  { id: "reading", name: "Reading", spanish: "Leer", icon: "book" },
  { id: "listening", name: "Listening", spanish: "Escuchar", icon: "headphones" },
  { id: "writing", name: "Writing", spanish: "Escribir", icon: "pen" },
  { id: "speaking", name: "Speaking", spanish: "Hablar", icon: "mic" },
];
const pageFromHash = (): Page => {
  const h = window.location.hash.slice(1);
  return navigation.some((n) => n.id === h) ? (h as Page) : "today";
};
const UnitCard = ({
  unit,
  index,
  progress,
  start,
  expanded,
  onExpand,
}: {
  unit: Unit;
  index: number;
  progress: Progress;
  start: (l: Lesson) => void;
  expanded: boolean;
  onExpand: () => void;
}) => {
  const done = unit.lessons.filter((l) => progress.completed[l.id]).length;
  return (
    <article className={`unit-card ${expanded ? "expanded" : ""}`}>
      <button type="button" className="unit-summary" onClick={onExpand} aria-expanded={expanded}>
        <div className={`unit-icon ${unit.color}`}>
          <Icon name={unit.icon} size={25} />
        </div>
        <div className="unit-info">
          <span className="eyebrow">
            UNIT {String(index + 1).padStart(2, "0")} <i>·</i> {unit.spanish}
          </span>
          <h3>{unit.title}</h3>
          <p>{unit.subtitle}</p>
        </div>
        <div className="unit-status">
          <span>
            {done === 4 ? (
              <>
                <Icon name="check" size={14} />
                Complete
              </>
            ) : done ? (
              `${done}/4 lessons`
            ) : (
              "4 lessons"
            )}
          </span>
          <Icon name={expanded ? "down" : "chevron"} size={17} />
        </div>
      </button>
      {expanded && (
        <div className="unit-expanded">
          <div className="unit-goals">
            {unit.goals.map((g) => (
              <span key={g}>
                <Icon name="check" size={13} />
                {g}
              </span>
            ))}
          </div>
          <div className="lesson-list">
            {unit.lessons.map((l, i) => (
              <button
                type="button"
                key={l.id}
                className={`lesson-row ${progress.completed[l.id] ? "completed" : ""}`}
                onClick={() => start(l)}
              >
                <div className="lesson-node">
                  <Icon name={progress.completed[l.id] ? "check" : l.icon} size={17} />
                </div>
                <span>
                  <strong>{l.title}</strong>
                  <small>{l.subtitle}</small>
                </span>
                <span className="lesson-length">
                  {l.minutes} min{" "}
                  <Icon
                    name={i === 0 && !progress.completed[l.id] ? "play" : "chevron"}
                    size={15}
                  />
                </span>
              </button>
            ))}
          </div>
          <details className="lesson-tip">
            <summary>
              <Icon name="spark" size={15} />A little pattern to remember
            </summary>
            <p>{unit.tip}</p>
            <div lang="es">
              {unit.example}
              <AudioButton compact text={unit.example} label="Listen to the unit example" />
            </div>
          </details>
        </div>
      )}
    </article>
  );
};
const Settings = ({
  progress,
  onSave,
  onClose,
  onReset,
}: {
  progress: Progress;
  onSave: (p: Partial<Progress>) => void;
  onClose: () => void;
  onReset: () => void;
}) => {
  const [name, setName] = useState(progress.name);
  const [goal, setGoal] = useState(progress.goal);
  const [date, setDate] = useState(progress.examDate);
  const [reset, setReset] = useState(false);
  const exportProgress = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `paso-progress-${localDate()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Dialog label="Your learning preferences" onClose={onClose} className="settings-dialog">
      <header>
        <div>
          <span className="eyebrow">MAKE YOURSELF AT HOME</span>
          <h2>Your little preferences.</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close preferences">
          <Icon name="x" />
        </button>
      </header>
      <label>
        What should we call you?
        <input
          value={name}
          maxLength={32}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </label>
      <label>
        Your daily practice goal
        <select value={goal} onChange={(e) => setGoal(+e.target.value)}>
          <option value={5}>A little · 5 exercises</option>
          <option value={10}>Steady steps · 10 exercises</option>
          <option value={20}>A good stretch · 20 exercises</option>
        </select>
      </label>
      <label>
        Exam date <span className="subtle">(optional)</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <p className="field-note">
        Progress and writing drafts stay in this browser. Export a backup before clearing browser
        data. Microphone recordings stay only in the active tab unless downloaded.
      </p>
      <div className="button-row">
        <button className="button secondary" onClick={exportProgress}>
          <Icon name="download" size={17} />
          Export progress
        </button>
        <button
          className="button primary"
          onClick={() => {
            onSave({ name: name.trim(), goal, examDate: date });
            onClose();
          }}
        >
          Save preferences
          <Icon name="check" size={17} />
        </button>
      </div>
      <details className="data-settings">
        <summary>Start over</summary>
        {reset ? (
          <div>
            <p>
              This clears lesson progress, drafts, checklists and the exam rehearsal in this
              browser.
            </p>
            <div className="button-row">
              <button className="button secondary small" onClick={() => setReset(false)}>
                Cancel
              </button>
              <button className="button danger small" onClick={onReset}>
                Clear my practice data
              </button>
            </div>
          </div>
        ) : (
          <button className="text-link" onClick={() => setReset(true)}>
            Reset my progress
          </button>
        )}
      </details>
    </Dialog>
  );
};
const App = () => {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [page, setPage] = useState<Page>(pageFromHash);
  const [session, setSession] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [expanded, setExpanded] = useState("u1");
  const [filter, setFilter] = useState<Skill | "all" | "mistakes">("all");
  const [storageError, setStorageError] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  useEffect(() => {
    const handle = () => {
      setPage(pageFromHash());
      setMobileNav(false);
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);
  useEffect(() => {
    if (!toast) {
      return;
    }
    const id = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(id);
  }, [toast]);
  const navigate = (target: Page) => {
    setPage(target);
    window.location.hash = target;
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const nextLesson = allLessons.find((l) => !progress.completed[l.id]) || allLessons[0];
  const nextUnit = units.find((u) => u.lessons.some((l) => l.id === nextLesson.id))!;
  const today = dailyAnswers(progress);
  const completed = Object.keys(progress.completed).length;
  const progressPercent = Math.round((completed / allLessons.length) * 100);
  const now = new Date();
  const mistakeEntries = new Map<
    string,
    { id: string; q: (typeof allQuestions)[number]; insertion: number; inQueue: boolean }
  >();
  for (const [i, id] of progress.mistakes.entries()) {
    const q = exerciseMap.get(id);
    if (!q) {
      continue;
    }
    mistakeEntries.set(id, { id, q, insertion: i, inQueue: true });
  }
  for (const [id, review] of Object.entries(progress.mistakeReviews)) {
    if (mistakeEntries.has(id) || !exerciseMap.has(id)) {
      continue;
    }
    const q = exerciseMap.get(id);
    if (!q) {
      continue;
    }
    const insertion = progress.mistakes.length;
    if (!review.nextAt || reviewDue(review, now)) {
      mistakeEntries.set(id, { id, q, insertion, inQueue: false });
    }
  }
  const mistakeQuestions = [...mistakeEntries.values()]
    .filter((entry) => entry.inQueue || reviewDue(progress.mistakeReviews[entry.id], now))
    .sort((a, b) => {
      const aDue = progress.mistakeReviews[a.id]?.nextAt
        ? new Date(progress.mistakeReviews[a.id]!.nextAt).getTime()
        : now.getTime();
      const bDue = progress.mistakeReviews[b.id]?.nextAt
        ? new Date(progress.mistakeReviews[b.id]!.nextAt).getTime()
        : now.getTime();
      if (aDue !== bDue) {
        return aDue - bDue;
      }
      return a.insertion - b.insertion;
    })
    .map(({ q }) => q);

  const practice = (skill: Skill | "all" | "mistakes") => {
    let questions =
      skill === "mistakes"
        ? mistakeQuestions
        : exerciseBank.filter((q) => skill === "all" || q.skill === skill);
    if (!questions.length) {
      setToast("Nothing to review yet. Your future mistakes will appear here.");
      return;
    }
    if (skill !== "mistakes") {
      const practiced = new Map(progress.attempts.map((a) => [a.questionId, a.at]));
      questions = [...questions].sort((a, b) =>
        (practiced.get(a.id) || "").localeCompare(practiced.get(b.id) || ""),
      );
    }
    setSession({
      id: `practice-${skill}`,
      title:
        skill === "mistakes"
          ? "A fresh look at your mistakes"
          : skill === "all"
            ? "Your daily mix"
            : `${skill[0].toUpperCase() + skill.slice(1)} practice`,
      subtitle: "A little focused practice",
      minutes: 6,
      icon: "layers",
      questions: questions.slice(0, skill === "writing" || skill === "speaking" ? 4 : 8),
    });
  };
  const saveAttempt = (a: Attempt) => setProgress((p) => withAttempt(p, a));
  const complete = (score: number, total: number) => {
    if (!session) {
      return;
    }
    if (allLessons.some((l) => l.id === session.id)) {
      setProgress((p) => ({
        ...p,
        completed: { ...p.completed, [session.id]: { score, total, at: new Date().toISOString() } },
      }));
    }
  };
  const daysToExam = progress.examDate
    ? Math.ceil(
        (new Date(`${progress.examDate}T00:00:00`).getTime() -
          new Date(`${localDate()}T00:00:00`).getTime()) /
          86400000,
      )
    : null;
  return (
    <div className="app-shell">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
          document.getElementById("main-content")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      {mobileNav && (
        <button
          className="nav-backdrop"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <a
          href="#today"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate("today");
          }}
          aria-label="Paso home"
        >
          <span className="brand-mark">
            p<span>•</span>
          </span>
          <span>
            paso<span className="brand-period">.</span>
          </span>
        </a>
        <div className="course-switch">
          <span className="spanish-flag" aria-label="Spanish flag" />
          <div>
            <strong>Spanish for your world</strong>
            <span>DELE A1 · Beginner</span>
          </div>
          <span className="course-badge">A1</span>
        </div>
        <span className="nav-label">YOUR LEARNING SPACE</span>
        <nav aria-label="Main navigation">
          {navigation.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => navigate(n.id)}
              aria-current={page === n.id ? "page" : undefined}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.id === "practice" && mistakeQuestions.length > 0 && (
                <small>{mistakeQuestions.length}</small>
              )}
              {page === n.id && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="small-sun">✺</span>
          <p>Un poquito cada día.</p>
          <span>
            A little every day
            <br />
            takes you a long way.
          </span>
          <div className="handdrawn-line" />
        </div>
        <div className="sidebar-bottom">
          <button className="help-link" onClick={() => navigate("guide")}>
            <Icon name="info" size={17} />
            Your exam, explained
            <Icon name="external" size={13} />
          </button>
          <button className="profile" onClick={() => setSettings(true)}>
            <span className="avatar">{progress.name ? progress.name[0].toUpperCase() : "P"}</span>
            <span>
              <strong>{progress.name || "Your Spanish journey"}</strong>
              <small>Learning at your pace</small>
            </span>
            <Icon name="settings" size={18} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <button
              className="mobile-menu icon-button"
              onClick={() => setMobileNav(true)}
              aria-label="Open navigation"
            >
              <Icon name="menu" />
            </button>
            <span className="breadcrumb">
              Your Spanish journey
              <Icon name="chevron" size={13} />
              <strong>{navigation.find((n) => n.id === page)?.label}</strong>
            </span>
          </div>
          <div className="topbar-stats">
            <span title="Consecutive practice days">
              <Icon name="flame" size={19} />
              <b>{streak(progress)}</b>
              <span>day streak</span>
            </span>
            <span className="xp-stat">
              <Icon name="spark" size={17} />
              <b>{xp(progress)}</b> XP
            </span>
            <button
              className="top-avatar"
              onClick={() => setSettings(true)}
              aria-label="Open your learning preferences"
            >
              {progress.name ? progress.name[0].toUpperCase() : "P"}
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {storageError && (
            <p className="notice" role="status">
              Browser storage is unavailable. Progress is kept for this visit; use Export progress
              in preferences to save a copy.
            </p>
          )}
          {page === "today" && (
            <>
              <div className="page-heading dashboard-heading">
                <div>
                  <div className="eyebrow greeting">
                    {new Date().getHours() < 12
                      ? "BUENOS DÍAS"
                      : new Date().getHours() < 20
                        ? "BUENAS TARDES"
                        : "BUENAS NOCHES"}{" "}
                    <span>✦</span>
                  </div>
                  <h1>
                    {progress.name ? `Hola, ${progress.name}.` : "A good day to learn Spanish."}
                  </h1>
                  <p>Your next chapter starts with a small step.</p>
                </div>
                <button className="date-chip" onClick={() => setSettings(true)}>
                  <Icon name="sun" size={17} />
                  {daysToExam === null
                    ? "At your own pace"
                    : daysToExam > 0
                      ? `${daysToExam} days to your exam`
                      : daysToExam === 0
                        ? "Your exam day"
                        : "Keep your Spanish growing"}
                  <Icon name="down" size={13} />
                </button>
              </div>
              <div className="dashboard-grid">
                <div className="dashboard-primary">
                  <section className="hero-card">
                    <div className="hero-text">
                      <span className="hero-eyebrow">
                        <i />
                        YOUR JOURNEY TO DELE A1
                      </span>
                      <h2>
                        Small steps.
                        <br />A world of <em>Spanish.</em>
                      </h2>
                      <p>Real-life Spanish, little wins, and a clear path to your first diploma.</p>
                      <button className="button primary" onClick={() => setSession(nextLesson)}>
                        {completed ? "Continue my journey" : "Let’s take the first step"}
                        <Icon name="arrow" size={19} />
                      </button>
                      <span className="hero-caption">
                        <Icon name="clock" size={13} />
                        {nextLesson.minutes} minutes is a lovely start
                      </span>
                    </div>
                    <JourneyArt />
                    <span className="hero-footnote">POCO A POCO, PASO A PASO.</span>
                  </section>
                  <div className="section-heading path-heading">
                    <div>
                      <span className="eyebrow">A LITTLE STRUCTURE. A LOT OF POSSIBILITY.</span>
                      <h2>Your learning path</h2>
                    </div>
                    <button className="text-link" onClick={() => navigate("path")}>
                      View full path
                      <Icon name="arrow" size={16} />
                    </button>
                  </div>
                  <div className="path-overview">
                    <span>
                      <b>{completed}</b> of {allLessons.length} lessons complete
                    </span>
                    <div className="progress-track">
                      <div style={{ width: `${progressPercent}%` }} />
                    </div>
                    <b>{progressPercent}%</b>
                  </div>
                  <div className="flex flex-col gap-3">
                    {units.slice(0, 3).map((u, i) => (
                      <UnitCard
                        key={u.id}
                        unit={u}
                        index={i}
                        progress={progress}
                        start={setSession}
                        expanded={expanded === u.id}
                        onExpand={() => setExpanded(expanded === u.id ? "" : u.id)}
                      />
                    ))}
                  </div>
                  <button className="remaining-units" onClick={() => navigate("path")}>
                    Home, cafés, adventures & 6 more chapters
                    <Icon name="arrow" size={16} />
                  </button>
                  <div className="section-heading">
                    <h2>A little change of pace</h2>
                    <span className="subtle">Make it yours</span>
                  </div>
                  <div className="quick-practice">
                    <button onClick={() => practice("listening")}>
                      <span className="quick-icon lavender">
                        <Icon name="headphones" size={23} />
                      </span>
                      <strong>Tune your ear</strong>
                      <small>Listen to everyday Spanish</small>
                      <Icon name="arrow" size={17} />
                    </button>
                    <button onClick={() => practice("speaking")}>
                      <span className="quick-icon peach">
                        <Icon name="mic" size={23} />
                      </span>
                      <strong>Find your voice</strong>
                      <small>A safe space to speak</small>
                      <Icon name="arrow" size={17} />
                    </button>
                    <button onClick={() => practice(mistakeQuestions.length ? "mistakes" : "all")}>
                      <span className="quick-icon sage">
                        <Icon name="repeat" size={23} />
                      </span>
                      <strong>Make it stick</strong>
                      <small>
                        {mistakeQuestions.length
                          ? `${mistakeQuestions.length} mistakes to revisit`
                          : "A fresh mix of little challenges"}
                      </small>
                      <Icon name="arrow" size={17} />
                    </button>
                  </div>
                </div>
                <aside className="dashboard-aside">
                  <section className="panel daily-goal">
                    <div className="panel-heading">
                      <h3>Your daily little win</h3>
                      <button
                        className="icon-button"
                        onClick={() => setSettings(true)}
                        aria-label="Adjust your daily goal"
                      >
                        <Icon name="settings" size={16} />
                      </button>
                    </div>
                    <div
                      className="goal-ring"
                      style={
                        {
                          "--goal": `${Math.min(today / progress.goal, 1) * 100}%`,
                        } as CSSProperties
                      }
                    >
                      <div>
                        <Icon name={today >= progress.goal ? "check" : "spark"} size={24} />
                        <strong>
                          {today}
                          <span>/{progress.goal}</span>
                        </strong>
                        <small>exercises today</small>
                      </div>
                    </div>
                    <p>
                      {today >= progress.goal
                        ? "Daily goal reached. ¡Muy bien!"
                        : today
                          ? "You’re building a lovely habit."
                          : "A few minutes. A little more confidence."}
                    </p>
                    <div className="week-dots">
                      {Array.from({ length: 7 }, (_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
                        const n = dailyAnswers(progress, localDate(d));
                        return (
                          <div key={i} className={localDate(d) === localDate() ? "is-today" : ""}>
                            <span>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                            <i
                              className={n ? "done" : ""}
                              title={`${d.toLocaleDateString()}: ${n} exercises`}
                            >
                              {n ? (
                                <Icon name="check" size={12} />
                              ) : localDate(d) === localDate() ? (
                                <b />
                              ) : null}
                            </i>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                  <section className="panel skills-panel">
                    <div className="panel-heading">
                      <h3>A little of every skill</h3>
                      <Icon name="layers" size={17} />
                    </div>
                    <p>Four ways to grow your Spanish.</p>
                    {skills.map((s) => {
                      const stats = skillStats(progress, s.id);
                      const total = exerciseBank.filter((q) => q.skill === s.id).length;
                      return (
                        <button className="skill-row" key={s.id} onClick={() => practice(s.id)}>
                          <span className={`skill-icon ${s.id}`}>
                            <Icon name={s.icon} size={17} />
                          </span>
                          <span>
                            <strong>
                              {s.name}
                              <small>{stats.practised} practised</small>
                            </strong>
                            <span className="progress-track">
                              <span style={{ width: `${(stats.practised / total) * 100}%` }} />
                            </span>
                          </span>
                          <Icon name="chevron" size={13} />
                        </button>
                      );
                    })}
                    <button className="text-link" onClick={() => navigate("guide")}>
                      How the exam works
                      <Icon name="arrow" size={15} />
                    </button>
                  </section>
                  <section className="phrase-card">
                    <span className="eyebrow">
                      <Icon name="spark" size={14} /> A PHRASE FOR TODAY
                    </span>
                    <h3 lang="es">Poco a poco.</h3>
                    <span className="phrase-pronunciation">/ˈpo.ko a ˈpo.ko/</span>
                    <p>Little by little.</p>
                    <div>
                      <span>Progress has its own pace.</span>
                      <AudioButton compact text="Poco a poco." label="Listen to poco a poco" />
                    </div>
                  </section>
                  <div className="quiet-note">
                    <Icon name="heart" size={16} />
                    <p>
                      No rush. No lost hearts.
                      <br />
                      Just you, getting a little better.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
          {page === "path" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">FROM YOUR FIRST HOLA TO YOUR A1</span>
                  <h1>Every step has a story.</h1>
                  <p>
                    {units.length} units · {allLessons.length} lessons · {allQuestions.length}{" "}
                    exercises. Explore freely, or follow the path.
                  </p>
                </div>
                <Stamp />
              </div>
              <div className="path-banner panel">
                <span className={`unit-icon ${nextUnit.color}`}>
                  <Icon name={nextUnit.icon} size={28} />
                </span>
                <div>
                  <span className="eyebrow">YOUR NEXT SMALL STEP</span>
                  <h3>
                    {nextUnit.title} · {nextLesson.title}
                  </h3>
                  <p>
                    {completed}/{allLessons.length} complete · {progressPercent}% of your path
                  </p>
                </div>
                <button className="button primary" onClick={() => setSession(nextLesson)}>
                  Continue learning
                  <Icon name="arrow" />
                </button>
              </div>
              <div className="path-layout">
                <div className="full-path">
                  {units.map((u, i) => (
                    <div className="path-stop" key={u.id}>
                      <span
                        className={`path-number ${u.lessons.every((l) => progress.completed[l.id]) ? "done" : ""}`}
                      >
                        {u.lessons.every((l) => progress.completed[l.id]) ? (
                          <Icon name="check" size={16} />
                        ) : (
                          String(i + 1).padStart(2, "0")
                        )}
                      </span>
                      <UnitCard
                        unit={u}
                        index={i}
                        progress={progress}
                        start={setSession}
                        expanded={expanded === u.id}
                        onExpand={() => setExpanded(expanded === u.id ? "" : u.id)}
                      />
                    </div>
                  ))}
                  <div className="path-finish">
                    <Icon name="flag" size={28} />
                    <div>
                      <h3>The next chapter is yours.</h3>
                      <p>Put your skills together in the exam rehearsal.</p>
                    </div>
                    <button className="button primary" onClick={() => navigate("exam")}>
                      Meet the exam
                      <Icon name="arrow" />
                    </button>
                  </div>
                </div>
                <aside className="path-sidebar panel">
                  <span className="eyebrow">HOW YOUR PATH WORKS</span>
                  <h3>
                    Learn it. Try it.
                    <br />
                    Make it yours.
                  </h3>
                  {[
                    [
                      "spark",
                      "Discover the words",
                      "Connect Spanish words with meaning and sound.",
                    ],
                    ["layers", "Understand the pattern", "Learn the why behind each answer."],
                    ["headphones", "Meet real life", "Read a message. Listen to a conversation."],
                    ["mic", "Use your own voice", "Write, record and reflect on your progress."],
                  ].map(([icon, title, body]) => (
                    <div key={title}>
                      <Icon name={icon} size={20} />
                      <section>
                        <h4>{title}</h4>
                        <p>{body}</p>
                      </section>
                    </div>
                  ))}
                  <p className="field-note">
                    All lessons are open. Completion tracks practice, not exam readiness. Review
                    mistakes and use the A1 checklist to find gaps.
                  </p>
                </aside>
              </div>
            </>
          )}
          {page === "practice" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">MORE PLAY. MORE PRACTICE. MORE YOU.</span>
                  <h1>Your practice studio.</h1>
                  <p>Follow your curiosity, or give a tricky word another chance.</p>
                </div>
                <span className="outline-badge">
                  <Icon name="spark" size={16} />
                  {exerciseBank.length} exercises to explore
                </span>
              </div>
              <div className="practice-tabs" role="group" aria-label="Filter practice by skill">
                {(["all", ...skills.map((s) => s.id), "mistakes"] as const).map((s) => (
                  <button
                    key={s}
                    className={filter === s ? "active" : ""}
                    onClick={() => setFilter(s)}
                  >
                    {s === "all"
                      ? "All skills"
                      : s === "mistakes"
                        ? `My mistakes (${mistakeQuestions.length})`
                        : s[0].toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              {filter === "mistakes" ? (
                <div className="panel mistakes-panel">
                  <span className="quick-icon peach">
                    <Icon name="repeat" size={28} />
                  </span>
                  <h2>
                    {mistakeQuestions.length
                      ? "Mistakes are little signposts."
                      : "A fresh page. A fresh start."}
                  </h2>
                  <p>
                    {mistakeQuestions.length
                      ? `${mistakeQuestions.length} questions are ready for another look. A correct answer without transcript assistance clears a question from this queue.`
                      : "No mistakes waiting here yet. As you practise, tricky questions will collect here with their explanations."}
                  </p>
                  <button
                    className="button primary"
                    onClick={() => practice(mistakeQuestions.length ? "mistakes" : "all")}
                  >
                    {mistakeQuestions.length ? "Review my mistakes" : "Try a daily mix"}
                    <Icon name="arrow" />
                  </button>
                  {mistakeQuestions.slice(0, 12).map((q) => (
                    <details key={q.id}>
                      <summary>
                        <span className={`skill-dot ${q.skill}`} />
                        {q.prompt}
                      </summary>
                      <p>
                        Correct answer: <strong>{q.answer}</strong>
                      </p>
                      <p>{q.explanation}</p>
                      <MemoryHint text={q.memoryHint} />
                      <button
                        className="text-link"
                        onClick={() =>
                          setSession({
                            id: "review-one",
                            title: "Another little chance",
                            subtitle: "Mistake review",
                            minutes: 2,
                            icon: "repeat",
                            questions: [q],
                          })
                        }
                      >
                        Try again
                        <Icon name="arrow" size={15} />
                      </button>
                    </details>
                  ))}
                </div>
              ) : (
                <>
                  <div className="practice-hero panel">
                    <div>
                      <span className="eyebrow">A SMALL SESSION, CHOSEN FOR YOU</span>
                      <h2>
                        {filter === "all"
                          ? "A little bit of everything."
                          : filter === "listening"
                            ? "Let Spanish find your ear."
                            : filter === "speaking"
                              ? "Your voice belongs here."
                              : filter === "writing"
                                ? "Make a little room for your words."
                                : "Find the meaning in the details."}
                      </h2>
                      <p>
                        Fresh questions come first. Revisit the ones you’ve seen as your confidence
                        grows.
                      </p>
                      <button className="button primary" onClick={() => practice(filter)}>
                        Start {filter === "all" ? "my daily mix" : `${filter} practice`}
                        <Icon name="arrow" />
                      </button>
                    </div>
                    <div className={`practice-orb ${filter}`}>
                      <Icon name={skills.find((s) => s.id === filter)?.icon || "spark"} size={64} />
                      <i>¡Tú puedes!</i>
                    </div>
                  </div>
                  <div className="practice-skill-grid">
                    {skills
                      .filter((s) => filter === "all" || filter === s.id)
                      .map((s) => {
                        const stats = skillStats(progress, s.id);
                        return (
                          <button
                            key={s.id}
                            className="panel practice-skill-card"
                            onClick={() => practice(s.id)}
                          >
                            <span className={`skill-icon ${s.id}`}>
                              <Icon name={s.icon} size={24} />
                            </span>
                            <span className="eyebrow">{s.spanish}</span>
                            <h3>{s.name}</h3>
                            <p>{stats.practised} questions practised</p>
                            <span>
                              {stats.accuracy === null
                                ? "A lovely place to start"
                                : `${stats.accuracy}% unassisted objective accuracy`}
                            </span>
                            <Icon name="arrow" size={19} />
                          </button>
                        );
                      })}
                  </div>
                  <div className="focused-practice">
                    <button
                      className="panel"
                      onClick={() =>
                        setSession({
                          id: "pictures",
                          title: "Picture a little Spanish",
                          subtitle: "Read the visual clues",
                          minutes: 4,
                          icon: "map",
                          questions: visualQuestions,
                        })
                      }
                    >
                      <span className="quick-icon sage">
                        <Icon name="map" />
                      </span>
                      <div>
                        <h3>Picture this</h3>
                        <p>6 visual puzzles · cafés, trains & your neighborhood</p>
                      </div>
                      <Icon name="arrow" />
                    </button>
                    <button
                      className="panel"
                      onClick={() =>
                        setSession({
                          id: "foundations",
                          title: "The little foundations",
                          subtitle: "Sounds, numbers and patterns",
                          minutes: 8,
                          icon: "layers",
                          questions: foundations,
                        })
                      }
                    >
                      <span className="quick-icon sand">
                        <Icon name="layers" />
                      </span>
                      <div>
                        <h3>The foundation lab</h3>
                        <p>24 checks · sounds, spelling, numbers & patterns</p>
                      </div>
                      <Icon name="arrow" />
                    </button>
                    <button
                      className="panel"
                      onClick={() =>
                        setSession({
                          id: "form",
                          title: "A form, a little Spanish",
                          subtitle: "Writing task 1",
                          minutes: 5,
                          icon: "pen",
                          questions: [formPractice],
                        })
                      }
                    >
                      <span className="quick-icon lavender">
                        <Icon name="pen" />
                      </span>
                      <div>
                        <h3>Fill in your story</h3>
                        <p>A personal form · 15–25 words · exam task 1</p>
                      </div>
                      <Icon name="arrow" />
                    </button>
                  </div>
                </>
              )}
              <PocketVocabulary
                progress={progress}
                onReview={(word, review) =>
                  setProgress((p) => ({
                    ...p,
                    vocabularyReviews: { ...p.vocabularyReviews, [word]: review },
                  }))
                }
                onLearn={() => navigate("path")}
              />
            </>
          )}
          {page === "exam" && (
            <MockExam
              progress={progress}
              onResult={(result) =>
                setProgress((p) => ({ ...p, mockResults: [...p.mockResults, result] }))
              }
            />
          )}
          {page === "guide" && (
            <Guide
              progress={progress}
              onCheck={(id) =>
                setProgress((p) => ({
                  ...p,
                  checks: p.checks.includes(id)
                    ? p.checks.filter((c) => c !== id)
                    : [...p.checks, id],
                }))
              }
            />
          )}
          <footer className="main-footer">
            <span>Made for the joy of getting there.</span>
            <span>
              paso a paso <span>✦</span>
            </span>
            <button onClick={() => navigate("guide")}>
              Independent practice · Official sources inside
              <Icon name="external" size={12} />
            </button>
          </footer>
        </main>
      </div>
      {session && (
        <LessonSession
          lesson={session}
          progress={progress}
          onClose={() => setSession(null)}
          onAttempt={saveAttempt}
          onComplete={complete}
          onDraft={(id, text) =>
            setProgress((p) => ({ ...p, drafts: { ...p.drafts, [id]: text } }))
          }
        />
      )}
      {settings && (
        <Settings
          progress={progress}
          onClose={() => setSettings(false)}
          onSave={(patch) => setProgress((p) => ({ ...p, ...patch }))}
          onReset={() => {
            setProgress(emptyProgress());
            try {
              localStorage.removeItem("paso-mock-v1");
            } catch {
              /* State still resets for this visit. */
            }
            setSettings(false);
            setPage("today");
            window.location.hash = "today";
            setToast("A fresh start. Your practice data has been cleared.");
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
    </div>
  );
};
export default App;
