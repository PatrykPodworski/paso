import { TONE } from "../tone";
import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { foundations, visualQuestions } from "../../data/curriculum";
import { formPractice } from "../../data/mock";
import { skillStats } from "../../data/progress";
import type { Progress, Skill } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { skills, SKILL_ICON, type Practice, type Session } from "../practice";

type Props = {
  progress: Progress;
  filter: Skill | "all";
  setSession: Session;
  practice: Practice;
};

const SETS = [
  {
    session: {
      id: "pictures",
      title: "Picture a little Spanish",
      subtitle: "Read the visual clues",
      minutes: 4,
      icon: "map",
      questions: visualQuestions,
    },
    tone: TONE.sage,
    name: "Picture this",
    note: "6 visual puzzles · cafés, trains & your neighborhood",
  },
  {
    session: {
      id: "foundations",
      title: "The little foundations",
      subtitle: "Sounds, numbers and patterns",
      minutes: 8,
      icon: "layers",
      questions: foundations,
    },
    tone: TONE.sand,
    name: "The foundation lab",
    note: "24 checks · sounds, spelling, numbers & patterns",
  },
  {
    session: {
      id: "form",
      title: "A form, a little Spanish",
      subtitle: "Writing task 1",
      minutes: 5,
      icon: "pen",
      questions: [formPractice],
    },
    tone: TONE.lavender,
    name: "Fill in your story",
    note: "A personal form · 15–25 words · exam task 1",
  },
];

export const SkillPractice = ({ progress, filter, setSession, practice }: Props) => (
  <>
    <Panel className="bg-sage-100! py-7 px-8 max-lg:p-7 max-md:p-6 max-sm:p-5 flex justify-between gap-5 overflow-hidden">
      <div className="max-w-130">
        <Eyebrow>A SMALL SESSION, CHOSEN FOR YOU</Eyebrow>
        <h2 className="font-serif font-semibold tracking-tight leading-tight text-3xl max-sm:text-2xl my-3 mx-0">
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
        <p className="leading-relaxed text-sm text-sage-600 max-w-105 mb-5">
          Fresh questions come first. Revisit the ones you’ve seen as your confidence grows.
        </p>
        <Button variant="primary" onClick={() => practice(filter)}>
          Start {filter === "all" ? "my daily mix" : `${filter} practice`}
          <Icon name="arrow" />
        </Button>
      </div>
      <div className="h-41 w-41 max-lg:h-31 max-lg:w-31 bg-sage-200 rounded-full text-olive-600 flex max-md:hidden flex-col items-center justify-center my-0 mx-6 max-lg:my-3.5 max-lg:mx-0 relative shrink-0">
        <Icon
          name={skills.find((s) => s.id === filter)?.icon || "spark"}
          size={64}
          className="max-lg:w-11 max-lg:h-11"
        />
        <i className="font-serif text-xl max-lg:text-base bg-sand-50 py-1 px-3.5 rounded-md -rotate-10 mt-4 text-sand-600">
          ¡Tú puedes!
        </i>
      </div>
    </Panel>
    <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-3.5 max-md:gap-3 mt-5">
      {skills
        .filter((s) => filter === "all" || filter === s.id)
        .map((s) => {
          const stats = skillStats(progress, s.id);

          return (
            <Panel
              as="button"
              key={s.id}
              className="text-left p-6 max-xl:py-5 max-xl:px-3.5 max-sm:py-5 max-sm:px-3.5 relative hover:-translate-y-0.5 hover:border-sage-300"
              onClick={() => practice(s.id)}
            >
              <span className={`${SKILL_ICON} w-11 h-11 mb-4 ${s.tint}`}>
                <Icon name={s.icon} size={24} />
              </span>
              <Eyebrow variant="small">{s.spanish}</Eyebrow>
              <h3 className="font-semibold tracking-tight text-lg max-md:text-base max-sm:text-lg mt-1">
                {s.name}
              </h3>
              <p className="leading-relaxed text-xs text-sage-500 my-2.5 mx-0">
                {stats.practised} questions practised
              </p>
              <span className="text-2xs max-lg:text-xs max-md:text-2xs text-sage-400">
                {stats.accuracy === null
                  ? "A lovely place to start"
                  : `${stats.accuracy}% unassisted objective accuracy`}
              </span>
              <Icon name="arrow" size={19} className="absolute right-5 top-9 text-sage-400" />
            </Panel>
          );
        })}
    </div>
    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4 mt-5">
      {SETS.map(({ session, tone, name, note }) => (
        <Panel
          as="button"
          key={session.id}
          className="flex items-center gap-3.5 max-sm:gap-2.5 p-5 max-xl:py-4 max-xl:px-3 text-left"
          onClick={() => setSession(session)}
        >
          <span
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 max-sm:w-9 max-sm:h-10 ${tone}`}
          >
            <Icon name={session.icon} />
          </span>
          <div>
            <h3 className="text-sm max-lg:text-base max-sm:text-sm font-semibold tracking-tight">
              {name}
            </h3>
            <p className="leading-relaxed text-xs max-xl:text-2xs max-lg:text-xs max-sm:text-2xs text-sage-500 mt-1">
              {note}
            </p>
          </div>
          <Icon name="arrow" className="ml-auto text-sage-500 w-4 max-sm:w-3.5" />
        </Panel>
      ))}
    </div>
  </>
);
