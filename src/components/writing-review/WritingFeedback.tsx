import { Eyebrow } from "../../design-system/Eyebrow";
import { Icon } from "../../design-system/Icon";
import type { WritingReview } from "../../data/types";

const TEXT = "text-sm leading-relaxed text-foreground";

type Props = { review: WritingReview; minWords?: number; maxWords?: number };

export const WritingFeedback = ({ review, minWords, maxWords }: Props) => (
  <div className="flex flex-col gap-4">
    {review.mark && (
      <p className={TEXT}>
        <strong>Mark: {review.mark.band} out of 3.</strong> {review.mark.reason}
      </p>
    )}
    <p className={TEXT}>
      {review.wordCount} words. Target: {minWords}–{maxWords}.
    </p>
    <div>
      <Eyebrow>Requested points</Eyebrow>
      <ul className="mbs-2 flex flex-col gap-2">
        {review.coverage.map((c) => (
          <li key={c.point} className={`flex items-start gap-2 ${TEXT}`}>
            <Icon name={c.met ? "check" : "x"} size={16} className="mbs-1 shrink-0" />
            <span>
              <span className="sr-only">{c.met ? "Covered: " : "Missing: "}</span>
              {c.point} <span className="text-muted-foreground">{c.feedback}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
    {review.corrections.length > 0 && (
      <div>
        <Eyebrow>Corrections</Eyebrow>
        <ul className="mbs-2 flex flex-col gap-2">
          {review.corrections.map((c) => (
            <li key={`${c.original}→${c.corrected}`} className={TEXT}>
              <span lang="es" className="line-through decoration-destructive">
                {c.original}
              </span>{" "}
              → <strong lang="es">{c.corrected}</strong>{" "}
              <span className="text-muted-foreground">{c.explanation}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    {review.revised && (
      <div>
        <Eyebrow>Revised version</Eyebrow>
        <p lang="es" className={`mbs-2 ${TEXT}`}>
          {review.revised}
        </p>
      </div>
    )}
  </div>
);
