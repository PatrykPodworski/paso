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
        className="underline fixed left-[10px] -top-[100px] z-[200] p-[12px] bg-[#fff] text-[#294b36] focus:top-[10px]"
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
      <div className="ml-[260px] max-xl:ml-[215px] max-md:ml-0">
        <Topbar
          page={page}
          progress={progress}
          openNav={() => setMobileNav(true)}
          openSettings={() => setSettings(true)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="max-w-[1570px] m-auto outline-none p-[34px_38px_0] max-xl:p-[28px_27px_0] max-md:p-[26px_20px_0] max-sm:px-[16px]"
        >
          {storageError && (
            <Notice as="p" role="status">
              Browser storage is unavailable. Progress is kept for this visit; use Export progress
              in preferences to save a copy.
            </Notice>
          )}
          {pages[page]}
          <footer className="flex max-md:flex-wrap items-center justify-between gap-[15px] mt-[42px] max-md:mt-[32px] p-[20px_0_25px] max-md:p-[20px_0] border-t border-t-sage-200 text-[11px] text-[#a2ab96]">
            <span className="max-lg:hidden">Made for the joy of getting there.</span>
            <span className="font-serif text-[14px] italic text-[#91a17d]">
              paso a paso <span className="text-[#c8a174] ml-[6px]">✦</span>
            </span>
            <button
              className={`${PRESSABLE} flex items-center gap-[4px] border-0 bg-transparent p-[1px_6px] text-[10px] max-md:text-[9px] text-[#a2ab96]`}
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
          className="fixed bottom-[25px] left-1/2 -translate-x-1/2 z-[100] flex items-center gap-[10px] p-[15px_22px] rounded-[10px] bg-green-900 text-[#f5f8ed] text-[14px] shadow-[0_7px_30px_#1f3e3022] max-w-[calc(100vw_-_30px)] max-md:w-max"
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
