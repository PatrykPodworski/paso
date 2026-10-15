import { Button } from "../../design-system/Button";
import { ButtonRow } from "../../design-system/ButtonRow";
import { FieldNote } from "../../design-system/FieldNote";
import type { LiveScore } from "../../data/types";

const HEADINGS = {
  perfect: "Perfect. You passed.",
  good: "Good. You passed.",
  bad: "Not yet. Talk again to pass.",
};

const NOTES = {
  perfect: "You gave your name, age and country in correct Spanish.",
  good: "The examiner understood you. Talk again to make your answers correct.",
  bad: "The examiner did not get all three answers. If you continue now, this talk waits in your mistakes.",
};

const LEVELS = {
  correct: "Correct",
  understandable: "Understandable, with mistakes",
  missing: "Missing",
};

const ITEMS = [
  ["name", "Name"],
  ["age", "Age"],
  ["country", "Country"],
] as const;

type Props = { score: LiveScore; onAgain: () => void; onContinue: () => void };

export const LiveResult = ({ score, onAgain, onContinue }: Props) => (
  <div className="mbs-[22px] border-bs border-sage-200 pbs-[22px]">
    <h3 className="font-serif text-[22px] font-medium">{HEADINGS[score.grade]}</h3>
    <p className="mbs-[8px] text-[14px] leading-[1.7] text-sage-700">{NOTES[score.grade]}</p>
    <ul aria-label="Your answers" className="mbs-[14px] flex flex-col gap-[6px] text-[14px]">
      {ITEMS.map(([item, label]) => (
        <li key={item} className="flex justify-between gap-[12px]">
          <span>{label}</span>
          <span className={score.items[item] === "missing" ? "text-coral-700" : "text-sage-700"}>
            {LEVELS[score.items[item]]}
          </span>
        </li>
      ))}
    </ul>
    <FieldNote className="mbs-[14px]">
      Only the transcript is scored, never your pronunciation.
    </FieldNote>
    <ButtonRow className="mbs-[18px]">
      {score.grade !== "perfect" && (
        <Button variant={score.grade === "bad" ? "primary" : "secondary"} onClick={onAgain}>
          Talk again
        </Button>
      )}
      <Button variant={score.grade === "bad" ? "secondary" : "primary"} onClick={onContinue}>
        Continue
      </Button>
    </ButtonRow>
  </div>
);
