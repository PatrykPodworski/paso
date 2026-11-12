import { useState } from "react";
import type { ReactNode } from "react";
import { allLessons } from "./data/curriculum";
import { currentUnit, journeyLesson } from "./data/journeyLesson";
import { pathLessons } from "./data/path";
import { practiceSets, setLessons } from "./data/practice-sets/index";
import type { Lesson, Skill } from "./data/types";
import { BackofficePage } from "./components/backoffice/BackofficePage";
import { Guide } from "./components/Guide";
import { Icon } from "./design-system/Icon";
import { LessonSession } from "./components/LessonSession";
import { mistakeQueue } from "./components/mistakeQueue";
import { MockExam } from "./components/mock-exam/MockExam";
import { sectionOf, type Page } from "./components/navigation";
import { PathPage } from "./components/PathPage";
import { practiceLesson } from "./components/practiceLesson";
import { PracticePage } from "./components/practice/PracticePage";
import { SetPage } from "./components/practice-sets/SetPage";
import { ProgressLoading } from "./components/progress/ProgressLoading";
import { SaveFailed } from "./components/progress/SaveFailed";
import { useProgress } from "./components/progress/useProgress";
import { Settings } from "./components/shell/Settings";
import { Sidebar } from "./components/shell/Sidebar";
import { TodayPage } from "./components/today/TodayPage";
import { Topbar } from "./components/shell/Topbar";
import { useNavigation } from "./components/shell/useNavigation";
import { useToast } from "./components/shell/useToast";
import { Notice } from "./design-system/Notice";
import { PRESSABLE } from "./design-system/pressable";

// The next lesson on the path, or undefined after the last one or a practice session.
const lessonAfter = (lesson: Lesson | null) => {
  const index = pathLessons.findIndex((l) => l.id === lesson?.id);

  return index === -1 ? undefined : pathLessons[index + 1]?.lesson();
};

const App = () => {
  const { snapshot: progress, problem, storageError, actions } = useProgress();
  const { page, navigate, mobileNav, setMobileNav } = useNavigation();
  const [session, setSession] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState(false);
  // null until the learner opens or closes a unit; "" when they closed one.
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<Skill | "all" | "mistakes">("all");
  const [toast, setToast] = useToast();

  const problemDialog = (problem === "save" || problem === "refused") && (
    <SaveFailed
      refused={problem === "refused"}
      onRetry={actions.retry}
      onContinue={actions.dismiss}
    />
  );

  if (!progress) {
    return (
      <>
        <ProgressLoading failed={problem === "load"} onRetry={actions.retry} />
        {problemDialog}
      </>
    );
  }

  const nextLesson = journeyLesson(progress);
  // The path counts every lesson it shows (ADR 0012); a lesson off the path records completion too.
  const completed = pathLessons.filter((l) => progress.completed[l.id]).length;
  const progressPercent = Math.round((completed / pathLessons.length) * 100);
  const mistakeQuestions = mistakeQueue(progress, new Date());
  const lessonAfterSession = lessonAfter(session);

  const practice = (skill: Skill | "all" | "mistakes") => {
    const lesson = practiceLesson(skill, progress, mistakeQuestions);

    if (!lesson) {
      setToast("Nothing to review yet. Your future mistakes will appear here.");

      return;
    }

    setSession(lesson);
  };

  const expandedUnit = expanded ?? currentUnit(progress).id;

  const toggleExpanded = (id: string) =>
    setExpanded((open) => ((open ?? expandedUnit) === id ? "" : id));

  const complete = (score: number, total: number) => {
    if (session && [...allLessons, ...setLessons].some((l) => l.id === session.id)) {
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
        expanded={expandedUnit}
        toggleExpanded={toggleExpanded}
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
        expanded={expandedUnit}
        toggleExpanded={toggleExpanded}
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
    ...Object.fromEntries(
      practiceSets.map((s) => [
        s.route,
        <SetPage key={s.id} set={s} progress={progress} setSession={setSession} />,
      ]),
    ),
    exam: (
      <MockExam
        progress={progress}
        onResult={actions.mockResult}
        onResponses={actions.mockResponses}
        onRunChange={actions.mockRun}
        onNewRun={actions.newMockRun}
        onSeen={actions.seen}
        onLeave={actions.flushDrafts}
      />
    ),
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
        className="underline fixed left-2.5 -top-25 z-200 p-3 bg-card text-foreground focus:top-2.5"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
          document.getElementById("main-content")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <Sidebar
        page={sectionOf(page)}
        navigate={navigate}
        mobileNav={mobileNav}
        closeNav={() => setMobileNav(false)}
        mistakeCount={mistakeQuestions.length}
        name={progress.name}
        openSettings={() => setSettings(true)}
      />
      <div className="ml-65 max-xl:ml-54 max-md:ml-0">
        <Topbar
          page={sectionOf(page)}
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
          <footer className="flex max-md:flex-wrap items-center justify-between gap-3.5 mt-10 max-md:mt-8 pt-5 px-0 pb-6 max-md:py-5 max-md:px-0 border-t border-t-border text-2xs text-muted-foreground">
            <span className="max-lg:hidden">Made for the joy of getting there.</span>
            <span className="font-heading text-sm italic text-muted-foreground">
              paso a paso <span className="text-muted-foreground ml-1.5">✦</span>
            </span>
            <button
              className={`${PRESSABLE} flex items-center gap-1 border-0 bg-transparent py-px px-1.5 text-2xs text-muted-foreground`}
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

            setSettings(false);
            navigate("today");

            setToast("A fresh start. Your practice data has been cleared.");
          }}
        />
      )}
      {problemDialog}
      {toast && (
        <div
          className="fixed bottom-6 inset-x-4 mx-auto w-fit z-100 flex items-center gap-2.5 py-3.5 px-5 rounded-lg bg-foreground text-background text-sm shadow-xl"
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
