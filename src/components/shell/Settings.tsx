import { ButtonRow } from "../../design-system/ButtonRow";
import { FieldNote } from "../../design-system/FieldNote";
import { useState } from "react";
import { Button } from "../../design-system/Button";
import { Dialog } from "../../design-system/Dialog";
import { Eyebrow } from "../../design-system/Eyebrow";
import { TextLink } from "../../design-system/TextLink";
import { localDate } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";
import { FIELD } from "../../design-system/field";

type Props = {
  progress: Progress;
  onSave: (p: Partial<Progress>) => void;
  onClose: () => void;
  onReset: () => void;
};

const LABEL = "flex flex-col gap-2 mb-5 text-sage-600 text-sm";

export const Settings = ({ progress, onSave, onClose, onReset }: Props) => {
  const [name, setName] = useState(progress.name);
  const [goal, setGoal] = useState(progress.goal);
  const [date, setDate] = useState(progress.examDate);
  const [reset, setReset] = useState(false);

  const exportProgress = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" }),
    );

    const a = document.createElement("a");

    a.href = url;
    a.download = `paso-progress-${localDate()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Dialog label="Your learning preferences" onClose={onClose} className="w-140 p-7 max-md:p-6">
      <header className="flex justify-between gap-2.5 mb-7">
        <div>
          <Eyebrow>MAKE YOURSELF AT HOME</Eyebrow>
          <h2 className="font-serif font-semibold tracking-tight leading-tight mt-2 text-2xl">
            Your little preferences.
          </h2>
        </div>
        <IconButton onClick={onClose} aria-label="Close preferences">
          <Icon name="x" />
        </IconButton>
      </header>
      <label className={LABEL}>
        What should we call you?
        <input
          className={FIELD}
          value={name}
          maxLength={32}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </label>
      <label className={LABEL}>
        Your daily practice goal
        <select className={FIELD} value={goal} onChange={(e) => setGoal(+e.target.value)}>
          <option value={5}>A little · 5 exercises</option>
          <option value={10}>Steady steps · 10 exercises</option>
          <option value={20}>A good stretch · 20 exercises</option>
        </select>
      </label>
      <label className={LABEL}>
        Exam date <span className="text-xs text-sage-700">(optional)</span>
        <input
          className={FIELD}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <FieldNote className="mb-5">
        Progress and writing drafts stay in this browser. Export a backup before clearing browser
        data. Microphone recordings stay only in the active tab unless downloaded.
      </FieldNote>
      <ButtonRow className="justify-between">
        <Button
          variant="secondary"
          size="compact"
          className="max-md:w-full"
          onClick={exportProgress}
        >
          <Icon name="download" size={17} />
          Export progress
        </Button>
        <Button
          variant="primary"
          size="compact"
          className="max-md:w-full"
          onClick={() => {
            onSave({ name: name.trim(), goal, examDate: date });
            onClose();
          }}
        >
          Save preferences
          <Icon name="check" size={17} />
        </Button>
      </ButtonRow>
      <details className="mt-6 pt-4 border-t border-t-sage-200 text-xs text-sage-400">
        <summary className="cursor-pointer">Start over</summary>
        {reset ? (
          <div>
            <p className="leading-relaxed my-3.5 mx-0">
              This clears lesson progress, drafts, checklists and the exam rehearsal in this
              browser.
            </p>
            <ButtonRow>
              <Button variant="secondary" size="small" onClick={() => setReset(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="small" onClick={onReset}>
                Clear my practice data
              </Button>
            </ButtonRow>
          </div>
        ) : (
          <TextLink className="mt-3 text-xs! text-sand-500!" onClick={() => setReset(true)}>
            Reset my progress
          </TextLink>
        )}
      </details>
    </Dialog>
  );
};
