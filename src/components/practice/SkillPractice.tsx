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

export const SkillPractice = ({ progress, filter, setSession, practice }: Props) => (
  <>
    <Panel className="practice-hero">
      <div>
        <Eyebrow>A SMALL SESSION, CHOSEN FOR YOU</Eyebrow>
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
        <p>Fresh questions come first. Revisit the ones you’ve seen as your confidence grows.</p>
        <Button variant="primary" onClick={() => practice(filter)}>
          Start {filter === "all" ? "my daily mix" : `${filter} practice`}
          <Icon name="arrow" />
        </Button>
      </div>
      <div className={`practice-orb ${filter}`}>
        <Icon name={skills.find((s) => s.id === filter)?.icon || "spark"} size={64} />
        <i>¡Tú puedes!</i>
      </div>
    </Panel>
    <div className="practice-skill-grid">
      {skills
        .filter((s) => filter === "all" || filter === s.id)
        .map((s) => {
          const stats = skillStats(progress, s.id);

          return (
            <Panel
              as="button"
              key={s.id}
              className="practice-skill-card"
              onClick={() => practice(s.id)}
            >
              <span className={`${SKILL_ICON} w-[45px] h-[45px] mb-[17px] ${s.tint}`}>
                <Icon name={s.icon} size={24} />
              </span>
              <Eyebrow variant="small">{s.spanish}</Eyebrow>
              <h3>{s.name}</h3>
              <p>{stats.practised} questions practised</p>
              <span>
                {stats.accuracy === null
                  ? "A lovely place to start"
                  : `${stats.accuracy}% unassisted objective accuracy`}
              </span>
              <Icon name="arrow" size={19} />
            </Panel>
          );
        })}
    </div>
    <div className="focused-practice">
      <Panel
        as="button"
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
      </Panel>
      <Panel
        as="button"
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
      </Panel>
      <Panel
        as="button"
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
      </Panel>
    </div>
  </>
);
