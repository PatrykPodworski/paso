import { Eyebrow } from "../design-system/Eyebrow";
import type { Lesson, Progress, Unit } from "../data/types";
import { AudioButton } from "./audio/AudioButton";
import { Icon } from "../design-system/Icon";

type Props = {
  unit: Unit;
  onPath?: boolean;
  index: number;
  progress: Progress;
  start: (l: Lesson) => void;
  expanded: boolean;
  onExpand: () => void;
};

export const UnitCard = ({
  unit,
  onPath = false,
  index,
  progress,
  start,
  expanded,
  onExpand,
}: Props) => {
  const done = unit.lessons.filter((l) => progress.completed[l.id]).length;

  return (
    <article className={`unit-card ${expanded ? "expanded" : ""}`}>
      <button type="button" className="unit-summary" onClick={onExpand} aria-expanded={expanded}>
        <div className={`unit-icon ${unit.color}`}>
          <Icon name={unit.icon} size={25} />
        </div>
        <div className="unit-info">
          <Eyebrow variant={onPath ? "pathUnit" : "unit"}>
            UNIT {String(index + 1).padStart(2, "0")} <i>·</i> {unit.spanish}
          </Eyebrow>
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
