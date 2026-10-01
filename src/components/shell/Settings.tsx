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

type Props = {
  progress: Progress;
  onSave: (p: Partial<Progress>) => void;
  onClose: () => void;
  onReset: () => void;
};

const LABEL = "flex flex-col gap-[9px] mb-[20px] text-[#839471] text-[14px]";

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
    <Dialog
      label="Your learning preferences"
      onClose={onClose}
      className="w-[min(560px,calc(100vw_-_35px))] p-[30px] max-tablet:p-[25px]"
    >
      <header className="flex justify-between gap-[10px] mb-[27px]">
        <div>
          <Eyebrow>MAKE YOURSELF AT HOME</Eyebrow>
          <h2 className="mt-[8px] text-[27px] max-tablet:text-[26px]">Your little preferences.</h2>
        </div>
        <IconButton onClick={onClose} aria-label="Close preferences">
          <Icon name="x" />
        </IconButton>
      </header>
      <label className={LABEL}>
        What should we call you?
        <input
          value={name}
          maxLength={32}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </label>
      <label className={LABEL}>
        Your daily practice goal
        <select value={goal} onChange={(e) => setGoal(+e.target.value)}>
          <option value={5}>A little · 5 exercises</option>
          <option value={10}>Steady steps · 10 exercises</option>
          <option value={20}>A good stretch · 20 exercises</option>
        </select>
      </label>
      <label className={LABEL}>
        Exam date <span className="text-[13px] text-[#75816b]">(optional)</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <FieldNote className="mb-[22px]">
        Progress and writing drafts stay in this browser. Export a backup before clearing browser
        data. Microphone recordings stay only in the active tab unless downloaded.
      </FieldNote>
      <ButtonRow className="justify-between">
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
      </ButtonRow>
      <details className="mt-[25px] pt-[17px] border-t border-t-line text-[13px] text-[#a4ad94]">
        <summary className="cursor-pointer">Start over</summary>
        {reset ? (
          <div>
            <p className="m-[14px_0]">
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
