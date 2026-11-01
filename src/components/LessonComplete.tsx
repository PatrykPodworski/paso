import { CompletionArt } from "./CompletionArt";
import { CompletionStats } from "./CompletionStats";
import { Button } from "../design-system/Button";
import { ButtonRow } from "../design-system/ButtonRow";
import { Eyebrow } from "../design-system/Eyebrow";
import { FieldNote } from "../design-system/FieldNote";
import { Icon } from "../design-system/Icon";

type Props = {
  // One entry per question: correct, wrong, or null when it was not graded.
  results: (boolean | null)[];
  assisted: number;
  onClose: () => void;
  onNext?: () => void;
};

export const LessonComplete = ({ results, assisted, onClose, onNext }: Props) => (
  <div className="py-12 px-7 text-center max-md:py-9 max-md:px-5">
    <CompletionArt icon="flag" sparkles />
    <Eyebrow>ONE STEP CLOSER</Eyebrow>
    <h2 className="font-heading font-semibold tracking-tight leading-tight text-4xl my-3 mx-0">
      Look at you go.
    </h2>
    <p className="leading-relaxed text-sm text-muted-foreground mt-3">
      Another little piece of Spanish, yours to keep.
    </p>
    <CompletionStats
      stats={[
        [
          "objective answers",
          <>
            {results.filter((r) => r).length}
            <small className="text-base text-muted-foreground">
              /{results.filter((r) => r !== null).length}
            </small>
          </>,
        ],
        ["moments to review", results.filter((r) => r === false).length],
      ]}
    />
    {assisted > 0 && (
      <FieldNote className="mt-3">{assisted} answers used transcript assistance.</FieldNote>
    )}
    <p className="leading-relaxed text-sm text-muted-foreground mt-3">
      {results.some((r) => r === false)
        ? "Your mistakes are waiting in Practice studio, with explanations and another chance."
        : "A little practice every day goes a long way."}
    </p>
    <ButtonRow className="justify-center mt-6">
      {onNext ? (
        <>
          <Button variant="secondary" onClick={onClose}>
            Back to my journey
          </Button>
          <Button variant="primary" autoFocus onClick={onNext}>
            Next lesson
            <Icon name="arrow" />
          </Button>
        </>
      ) : (
        <Button variant="primary" autoFocus onClick={onClose}>
          Back to my journey
          <Icon name="arrow" />
        </Button>
      )}
    </ButtonRow>
  </div>
);
