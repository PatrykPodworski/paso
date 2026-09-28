import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { allLessons, allQuestions, units } from "../data/curriculum";
import type { Lesson, Progress } from "../data/types";
import { Stamp } from "./Art";
import { Icon } from "./Icon";
import type { Page } from "./navigation";
import type { Session } from "./practice";
import { UnitCard } from "./UnitCard";
export const PathPage = ({
  progress,
  nextLesson,
  completed,
  progressPercent,
  expanded,
  setExpanded,
  setSession,
  navigate,
}: {
  progress: Progress;
  nextLesson: Lesson;
  completed: number;
  progressPercent: number;
  expanded: string;
  setExpanded: (id: string) => void;
  setSession: Session;
  navigate: (target: Page) => void;
}) => {
  const nextUnit = units.find((u) => u.lessons.some((l) => l.id === nextLesson.id))!;
  return (
    <>
      <div className="page-heading">
        <div>
          <Eyebrow variant="page" className="mb-[9px]">
            FROM YOUR FIRST HOLA TO YOUR A1
          </Eyebrow>
          <h1>Every step has a story.</h1>
          <p>
            {units.length} units · {allLessons.length} lessons · {allQuestions.length} exercises.
            Explore freely, or follow the path.
          </p>
        </div>
        <Stamp />
      </div>
      <div className="path-banner panel">
        <span className={`unit-icon ${nextUnit.color}`}>
          <Icon name={nextUnit.icon} size={28} />
        </span>
        <div>
          <Eyebrow variant="banner" className="mb-[7px]">
            YOUR NEXT SMALL STEP
          </Eyebrow>
          <h3>
            {nextUnit.title} · {nextLesson.title}
          </h3>
          <p>
            {completed}/{allLessons.length} complete · {progressPercent}% of your path
          </p>
        </div>
        <Button
          variant="primary"
          className="tablet:max-laptop:ml-[65px]"
          onClick={() => setSession(nextLesson)}
        >
          Continue learning
          <Icon name="arrow" />
        </Button>
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
                onPath
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
            <Button
              variant="primary"
              size="small"
              className="tablet:ml-auto"
              onClick={() => navigate("exam")}
            >
              Meet the exam
              <Icon name="arrow" />
            </Button>
          </div>
        </div>
        <aside className="path-sidebar panel">
          <Eyebrow className="max-laptop:col-span-full">HOW YOUR PATH WORKS</Eyebrow>
          <h3>
            Learn it. Try it.
            <br />
            Make it yours.
          </h3>
          {[
            ["spark", "Discover the words", "Connect Spanish words with meaning and sound."],
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
            All lessons are open. Completion tracks practice, not exam readiness. Review mistakes
            and use the A1 checklist to find gaps.
          </p>
        </aside>
      </div>
    </>
  );
};
