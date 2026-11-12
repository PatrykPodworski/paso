import type { TeachingQuestion } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { Button } from "../ui/button";
import { cardPadding } from "./cardPadding";
import { TeachingContent } from "./TeachingContent";

type Props = { q: TeachingQuestion; onContinue: () => void };

// React's autoFocus focuses on mount, but a lesson that opens on a card mounts it before the
// dialog's showModal(), which then moves focus to the first element with the autofocus
// attribute. React never writes that attribute, so the ref does.
const markAutofocus = (el: HTMLElement | null) => el?.setAttribute("autofocus", "");

export const TeachingCard = ({ q, onContinue }: Props) => (
  <div className={cardPadding(false)}>
    <h2 className="font-heading tracking-tight text-2xl font-medium leading-normal mbs-3.5 mbe-4">
      {q.prompt}
    </h2>
    <TeachingContent teach={q.teach} />
    <div className="flex justify-end mbs-6 border-bs border-border pbs-5 max-md:pbs-4">
      <Button
        type="button"
        size="lg"
        className="max-md:w-full"
        ref={markAutofocus}
        autoFocus
        onClick={onContinue}
      >
        Continue
        <Icon name="arrow" />
      </Button>
    </div>
  </div>
);
