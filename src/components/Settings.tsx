import { useState } from "react";
import { Button } from "../design-system/Button";
import { Dialog } from "../design-system/Dialog";
import { Eyebrow } from "../design-system/Eyebrow";
import { TextLink } from "../design-system/TextLink";
import { localDate } from "../data/progress";
import type { Progress } from "../data/types";
import { Icon } from "./Icon";
export const Settings = ({
  progress,
  onSave,
  onClose,
  onReset,
}: {
  progress: Progress;
  onSave: (p: Partial<Progress>) => void;
  onClose: () => void;
  onReset: () => void;
}) => {
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
    <Dialog label="Your learning preferences" onClose={onClose} className="settings-dialog">
      <header>
        <div>
          <Eyebrow>MAKE YOURSELF AT HOME</Eyebrow>
          <h2>Your little preferences.</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close preferences">
          <Icon name="x" />
        </button>
      </header>
      <label>
        What should we call you?
        <input
          value={name}
          maxLength={32}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </label>
      <label>
        Your daily practice goal
        <select value={goal} onChange={(e) => setGoal(+e.target.value)}>
          <option value={5}>A little · 5 exercises</option>
          <option value={10}>Steady steps · 10 exercises</option>
          <option value={20}>A good stretch · 20 exercises</option>
        </select>
      </label>
      <label>
        Exam date <span className="subtle">(optional)</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <p className="field-note">
        Progress and writing drafts stay in this browser. Export a backup before clearing browser
        data. Microphone recordings stay only in the active tab unless downloaded.
      </p>
      <div className="button-row">
        <Button
          variant="secondary"
          size="compact"
          className="max-tablet:w-full"
          onClick={exportProgress}
        >
          <Icon name="download" size={17} />
          Export progress
        </Button>
        <Button
          variant="primary"
          size="compact"
          className="max-tablet:w-full"
          onClick={() => {
            onSave({ name: name.trim(), goal, examDate: date });
            onClose();
          }}
        >
          Save preferences
          <Icon name="check" size={17} />
        </Button>
      </div>
      <details className="data-settings">
        <summary>Start over</summary>
        {reset ? (
          <div>
            <p>
              This clears lesson progress, drafts, checklists and the exam rehearsal in this
              browser.
            </p>
            <div className="button-row">
              <Button variant="secondary" size="small" onClick={() => setReset(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="small" onClick={onReset}>
                Clear my practice data
              </Button>
            </div>
          </div>
        ) : (
          <TextLink
            className="mt-[12px] text-[13px]! text-[#b19475]!"
            onClick={() => setReset(true)}
          >
            Reset my progress
          </TextLink>
        )}
      </details>
    </Dialog>
  );
};
