import { TONE } from "./tone";
import { FieldNote } from "../design-system/FieldNote";
import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { PageHeading } from "../design-system/PageHeading";
import { Panel } from "../design-system/Panel";
import { allLessons, allQuestions, units } from "../data/curriculum";
import type { Lesson, Progress } from "../data/types";
import { Stamp } from "./Art";
import { Icon } from "../design-system/Icon";
import type { Page } from "./navigation";
import type { Session } from "./practice";
import { UnitCard } from "./UnitCard";

const PATH_NUMBER =
  "flex items-center justify-center shrink-0 rounded-full border border-sage-200 mt-6 w-8 h-8 text-xs max-md:w-7 max-md:h-7 max-md:text-2xs";

type Props = {
  progress: Progress;
  nextLesson: Lesson;
  completed: number;
  progressPercent: number;
  expanded: string;
  setExpanded: (id: string) => void;
  setSession: Session;
  navigate: (target: Page) => void;
};

export const PathPage = ({
  progress,
  nextLesson,
  completed,
  progressPercent,
  expanded,
  setExpanded,
  setSession,
  navigate,
}: Props) => {
  const nextUnit = units.find((u) => u.lessons.some((l) => l.id === nextLesson.id))!;

  return (
    <>
      <PageHeading
        eyebrow={
          <Eyebrow variant="page" className="mb-2">
            FROM YOUR FIRST HOLA TO YOUR A1
          </Eyebrow>
        }
        title="Every step has a story."
        description={
          <>
            {units.length} units · {allLessons.length} lessons · {allQuestions.length} exercises.
            Explore freely, or follow the path.
          </>
        }
      >
        <Stamp />
      </PageHeading>
      <Panel className="flex items-center gap-4 max-md:gap-3 mb-7 p-6 max-md:p-5 max-lg:flex-wrap">
        <span
          className={`flex items-center justify-center shrink-0 rounded-xl w-12 h-12 max-xl:w-10 max-xl:h-11 max-md:w-11 max-sm:w-8 max-sm:h-9 ${TONE[nextUnit.color]}`}
        >
          <Icon name={nextUnit.icon} size={28} />
        </span>
        <div className="flex-1 max-lg:min-w-62 max-md:min-w-50 max-sm:min-w-40">
          <Eyebrow variant="banner" className="mb-1.5">
            YOUR NEXT SMALL STEP
          </Eyebrow>
          <h3 className="font-semibold tracking-tight text-base max-xl:text-sm">
            {nextUnit.title} · {nextLesson.title}
          </h3>
          <p className="leading-relaxed mt-1.5 text-sm text-sage-500">
            {completed}/{allLessons.length} complete · {progressPercent}% of your path
          </p>
        </div>
        <Button
          variant="primary"
          className="md:max-lg:ml-16"
          onClick={() => setSession(nextLesson)}
        >
          Continue learning
          <Icon name="arrow" />
        </Button>
      </Panel>
      <div className="flex gap-7 max-xl:gap-5 max-lg:flex-col">
        <div className="relative flex-1 min-w-0 before:absolute before:top-5 before:bottom-16 before:left-3.5 max-md:before:left-3 before:border-l before:border-dashed before:border-sage-200">
          {units.map((u, i) => (
            <div className="relative flex items-start gap-4 max-md:gap-2.5 mb-4" key={u.id}>
              <span
                className={`${PATH_NUMBER} ${u.lessons.every((l) => progress.completed[l.id]) ? "bg-olive-600 text-white" : "bg-sage-50 text-sage-500"}`}
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
          <div className="flex flex-wrap items-center gap-3.5 max-md:gap-3 mt-7 ml-12 max-md:ml-9 p-6 max-md:p-5 rounded-xl bg-sage-100 text-olive-600">
            <Icon name="flag" size={28} />
            <div>
              <h3 className="font-semibold tracking-tight font-serif text-xl">
                The next chapter is yours.
              </h3>
              <p className="leading-relaxed mt-1 text-xs">
                Put your skills together in the exam rehearsal.
              </p>
            </div>
            <Button
              variant="primary"
              size="small"
              className="md:ml-auto"
              onClick={() => navigate("exam")}
            >
              Meet the exam
              <Icon name="arrow" />
            </Button>
          </div>
        </div>
        <Panel
          as="aside"
          className="w-65 shrink-0 p-6 self-start sticky top-5 max-xl:w-57 max-lg:w-auto max-lg:self-stretch max-lg:static max-lg:grid max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1"
        >
          <Eyebrow className="max-lg:col-span-full">HOW YOUR PATH WORKS</Eyebrow>
          <h3 className="tracking-normal font-serif font-medium leading-tight text-2xl mt-3 mx-0 mb-6 max-lg:m-0 max-lg:col-span-full">
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
            <div key={title} className="flex gap-3 mb-6 max-lg:mb-0 text-sage-600">
              <Icon name={icon} size={20} />
              <section>
                <h4 className="font-semibold text-sm text-sage-800">{title}</h4>
                <p className="leading-relaxed mt-1.5 text-sm">{body}</p>
              </section>
            </div>
          ))}
          <FieldNote className="mt-1.5 max-lg:col-span-full">
            All lessons are open. Completion tracks practice, not exam readiness. Review mistakes
            and use the A1 checklist to find gaps.
          </FieldNote>
        </Panel>
      </div>
    </>
  );
};
