import { useState } from "react";
import type { ReactNode } from "react";
import { allLessons } from "./data/curriculum";
import { emptyProgress, withAttempt } from "./data/progress";
import type { Attempt, Lesson, Skill } from "./data/types";
import { Guide } from "./components/Guide";
import { Icon } from "./design-system/Icon";
import { LessonSession } from "./components/LessonSession";
import { mistakeQueue } from "./components/mistakeQueue";
import { MockExam } from "./components/MockExam";
import type { Page } from "./components/navigation";
import { PathPage } from "./components/PathPage";
import { practiceLesson } from "./components/practiceLesson";
import { PracticePage } from "./components/PracticePage";
import { Settings } from "./components/Settings";
import { Sidebar } from "./components/Sidebar";
import { TodayPage } from "./components/TodayPage";
import { Topbar } from "./components/Topbar";
import { useNavigation } from "./components/useNavigation";
import { usePersistedProgress } from "./components/usePersistedProgress";
import { useToast } from "./components/useToast";
import { Notice } from "./design-system/Notice";

const App = () => {
  const [progress, setProgress, storageError] = usePersistedProgress();
  const { page, setPage, navigate, mobileNav, setMobileNav } = useNavigation();
  const [session, setSession] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState(false);
  const [expanded, setExpanded] = useState("u1");
  const [filter, setFilter] = useState<Skill | "all" | "mistakes">("all");
  const [toast, setToast] = useToast();
  const nextLesson = allLessons.find((l) => !progress.completed[l.id]) || allLessons[0];
  const completed = Object.keys(progress.completed).length;
  const progressPercent = Math.round((completed / allLessons.length) * 100);
  const mistakeQuestions = mistakeQueue(progress, new Date());

  const practice = (skill: Skill | "all" | "mistakes") => {
    const lesson = practiceLesson(skill, progress, mistakeQuestions);

    if (!lesson) {
      setToast("Nothing to review yet. Your future mistakes will appear here.");

      return;
    }

    setSession(lesson);
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

  const pages: Record<Page, ReactNode> = {
    today: (
      <TodayPage
        progress={progress}
        nextLesson={nextLesson}
        completed={completed}
        progressPercent={progressPercent}
        mistakeCount={mistakeQuestions.length}
        expanded={expanded}
        setExpanded={setExpanded}
        setSession={setSession}
        openSettings={() => setSettings(true)}
        navigate={navigate}
        practice={practice}
      />
    ),
    path: (
      <PathPage
        progress={progress}
        nextLesson={nextLesson}
        completed={completed}
        progressPercent={progressPercent}
        expanded={expanded}
        setExpanded={setExpanded}
        setSession={setSession}
        navigate={navigate}
      />
    ),
    practice: (
      <PracticePage
        progress={progress}
        setProgress={setProgress}
        mistakeQuestions={mistakeQuestions}
        filter={filter}
        setFilter={setFilter}
        setSession={setSession}
        navigate={navigate}
        practice={practice}
      />
    ),
    exam: (
      <MockExam
        progress={progress}
        onResult={(result) =>
          setProgress((p) => ({ ...p, mockResults: [...p.mockResults, result] }))
        }
      />
    ),
    guide: (
      <Guide
        progress={progress}
        onCheck={(id) =>
          setProgress((p) => ({
            ...p,
            checks: p.checks.includes(id) ? p.checks.filter((c) => c !== id) : [...p.checks, id],
          }))
        }
      />
    ),
  };

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
      <Sidebar
        page={page}
        navigate={navigate}
        mobileNav={mobileNav}
        closeNav={() => setMobileNav(false)}
        mistakeCount={mistakeQuestions.length}
        name={progress.name}
        openSettings={() => setSettings(true)}
      />
      <div className="main-shell">
        <Topbar
          page={page}
          progress={progress}
          openNav={() => setMobileNav(true)}
          openSettings={() => setSettings(true)}
        />
        <main id="main-content" tabIndex={-1}>
          {storageError && (
            <Notice as="p" role="status">
              Browser storage is unavailable. Progress is kept for this visit; use Export progress
              in preferences to save a copy.
            </Notice>
          )}
          {pages[page]}
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
