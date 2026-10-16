import { useState } from "react";
import type { ReactNode } from "react";
import { allLessons } from "./data/curriculum";
import { emptyProgress, withAttempt } from "./data/progress";
import type { Attempt, Lesson, Skill } from "./data/types";
import { Guide } from "./components/Guide";
import { Icon } from "./design-system/Icon";
import { LessonSession } from "./components/LessonSession";
import { mistakeQueue } from "./components/mistakeQueue";
import { MockExam } from "./components/mock-exam/MockExam";
import type { Page } from "./components/navigation";
import { PathPage } from "./components/PathPage";
import { practiceLesson } from "./components/practiceLesson";
import { PracticePage } from "./components/practice/PracticePage";
import { Settings } from "./components/shell/Settings";
import { Sidebar } from "./components/shell/Sidebar";
import { TodayPage } from "./components/today/TodayPage";
import { Topbar } from "./components/shell/Topbar";
import { useNavigation } from "./components/shell/useNavigation";
import { usePersistedProgress } from "./components/shell/usePersistedProgress";
import { useToast } from "./components/shell/useToast";
import { Notice } from "./design-system/Notice";
import { PRESSABLE } from "./design-system/pressable";

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
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="underline fixed left-2.5 -top-25 z-200 p-3 bg-white text-green-900 focus:top-2.5"
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
      <div className="ml-65 max-xl:ml-54 max-md:ml-0">
        <Topbar
          page={page}
          progress={progress}
          openNav={() => setMobileNav(true)}
          openSettings={() => setSettings(true)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="max-w-392 m-auto outline-none pt-8 px-9 pb-0 max-xl:pt-7 max-xl:px-7 max-xl:pb-0 max-md:pt-6 max-md:px-5 max-md:pb-0 max-sm:px-4"
        >
          {storageError && (
            <Notice as="p" role="status">
              Browser storage is unavailable. Progress is kept for this visit; use Export progress
              in preferences to save a copy.
            </Notice>
          )}
          {pages[page]}
          <footer className="flex max-md:flex-wrap items-center justify-between gap-3.5 mt-10 max-md:mt-8 pt-5 px-0 pb-6 max-md:py-5 max-md:px-0 border-t border-t-sage-200 text-2xs text-sage-400">
            <span className="max-lg:hidden">Made for the joy of getting there.</span>
            <span className="font-serif text-sm italic text-sage-500">
              paso a paso <span className="text-sand-500 ml-1.5">✦</span>
            </span>
            <button
              className={`${PRESSABLE} flex items-center gap-1 border-0 bg-transparent py-px px-1.5 text-2xs text-sage-400`}
              onClick={() => navigate("guide")}
            >
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
        <div
          className="fixed bottom-6 inset-x-4 mx-auto w-fit z-100 flex items-center gap-2.5 py-3.5 px-5 rounded-lg bg-green-900 text-sage-50 text-sm shadow-xl shadow-green-950/13"
          role="status"
        >
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
