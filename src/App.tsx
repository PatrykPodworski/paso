import { useState } from "react";
import type { ReactNode } from "react";
import { allLessons } from "./data/curriculum";
import type { Lesson, Skill } from "./data/types";
import { BackofficePage } from "./components/backoffice/BackofficePage";
import { Guide } from "./components/Guide";
import { Icon } from "./design-system/Icon";
import { LessonSession } from "./components/LessonSession";
import { mistakeQueue } from "./components/mistakeQueue";
import { MockExam } from "./components/mock-exam/MockExam";
import { clearMockRun } from "./components/mock-exam/useMockRun";
import type { Page } from "./components/navigation";
import { PathPage } from "./components/PathPage";
import { practiceLesson } from "./components/practiceLesson";
import { PracticePage } from "./components/practice/PracticePage";
import { ProgressLoading } from "./components/progress/ProgressLoading";
import { ProgressProblem } from "./components/progress/ProgressProblem";
import { useProgress } from "./components/progress/useProgress";
import { Settings } from "./components/shell/Settings";
import { Sidebar } from "./components/shell/Sidebar";
import { TodayPage } from "./components/today/TodayPage";
import { Topbar } from "./components/shell/Topbar";
import { useNavigation } from "./components/shell/useNavigation";
import { useToast } from "./components/shell/useToast";
import { Notice } from "./design-system/Notice";
import { PRESSABLE } from "./design-system/pressable";

const App = () => {
  const { snapshot: progress, problem, storageError, actions } = useProgress();
  const { page, setPage, navigate, mobileNav, setMobileNav } = useNavigation();
  const [session, setSession] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState(false);
  const [expanded, setExpanded] = useState("u1");
  const [filter, setFilter] = useState<Skill | "all" | "mistakes">("all");
  const [toast, setToast] = useToast();

  const problemDialog = (
    <ProgressProblem problem={problem} onRetry={actions.retry} onUnlock={actions.unlock} />
  );

  if (!progress) {
    return (
      <>
        <ProgressLoading failed={problem === "load"} onRetry={actions.retry} />
        {problemDialog}
      </>
    );
  }

  const nextLesson = allLessons.find((l) => !progress.completed[l.id]) || allLessons[0];
  const completed = Object.keys(progress.completed).length;
  const progressPercent = Math.round((completed / allLessons.length) * 100);
  const mistakeQuestions = mistakeQueue(progress, new Date());
  const sessionIndex = session ? allLessons.findIndex((l) => l.id === session.id) : -1;
  const lessonAfterSession = sessionIndex === -1 ? undefined : allLessons[sessionIndex + 1];

  const practice = (skill: Skill | "all" | "mistakes") => {
    const lesson = practiceLesson(skill, progress, mistakeQuestions);

    if (!lesson) {
      setToast("Nothing to review yet. Your future mistakes will appear here.");

      return;
    }

    setSession(lesson);
  };

  const complete = (score: number, total: number) => {
    if (session && allLessons.some((l) => l.id === session.id)) {
      actions.complete(session.id, score, total);
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
        onVocabulary={actions.vocabulary}
        mistakeQuestions={mistakeQuestions}
        filter={filter}
        setFilter={setFilter}
        setSession={setSession}
        navigate={navigate}
        practice={practice}
      />
    ),
    exam: <MockExam progress={progress} onResult={actions.mockResult} />,
    guide: (
      <Guide
        progress={progress}
        onCheck={(id) => actions.check(id, !progress.checks.includes(id))}
      />
    ),
    backoffice: <BackofficePage setSession={setSession} />,
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
              Browser storage is unavailable. Progress is saved online for this visit only; use
              Export progress in preferences to keep a copy.
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
          key={session.id}
          lesson={session}
          progress={progress}
          onClose={() => {
            actions.flushDrafts();
            setSession(null);
          }}
          onAttempt={actions.attempt}
          onComplete={complete}
          onDraft={actions.draft}
          onNext={lessonAfterSession && (() => setSession(lessonAfterSession))}
        />
      )}
      {settings && (
        <Settings
          progress={progress}
          onClose={() => setSettings(false)}
          onSave={actions.settings}
          onReset={() => {
            actions.reset();
            const mockRunCleared = clearMockRun();

            setSettings(false);
            setPage("today");
            window.location.hash = "today";

            setToast(
              mockRunCleared
                ? "A fresh start. Your practice data has been cleared."
                : "Your progress was reset, but this browser kept your saved mock exam.",
            );
          }}
        />
      )}
      {problemDialog}
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
