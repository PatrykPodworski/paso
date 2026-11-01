import { TextLink } from "../../design-system/TextLink";
import { useState } from "react";
import type { Question } from "../../data/types";

const PASSAGE =
  "reading-passage relative rounded-lg border border-border bg-muted py-6 px-7 mb-5 max-md:p-5";

type Props = {
  q: Question;
  exam: boolean;
  onTranscript: () => void;
};

export const QuestionMaterials = ({ q, exam, onTranscript }: Props) => {
  const [transcript, setTranscript] = useState(false);

  return (
    <>
      {q.image && (
        <img
          className="w-full max-h-40 rounded-lg object-cover mb-5 max-sm:max-h-32"
          src={`/illustrations/${q.image}.svg`}
          alt={
            q.image === "cafe"
              ? "Illustrated café counter with coffee and bread"
              : q.image === "town"
                ? "A neighborhood with a park, pharmacy and train station"
                : "A train waiting at a station"
          }
        />
      )}
      {q.passage && (
        <div className={PASSAGE} lang="es">
          <span
            className="absolute right-6 -top-1.5 h-6 w-2.5 rotate-15 rounded-md border-2 border-border"
            aria-hidden="true"
          />
          <p className="whitespace-pre-line text-sm leading-loose text-foreground">{q.passage}</p>
        </div>
      )}
      {q.audio && (
        <>
          {!exam && (
            <TextLink
              type="button"
              className="mt-2.5 mx-0 mb-5 text-xs! font-normal! text-muted-foreground!"
              onClick={() => {
                setTranscript((t) => !t);
                onTranscript();
              }}
            >
              {transcript ? "Hide transcript" : "Need a hand? Show transcript"}
            </TextLink>
          )}
          {transcript && (
            <div
              className="rounded-sm border-l-3 border-border bg-muted py-4 px-5 text-sm leading-relaxed text-foreground mb-5"
              lang="es"
            >
              {q.audio}
              <small className="block text-xs leading-relaxed text-muted-foreground mt-2.5">
                Transcript assistance is recorded; this answer will not count toward unassisted
                accuracy.
              </small>
            </div>
          )}
        </>
      )}
      {(q.picture || q.visual) && (
        <div
          className="bg-radial from-muted to-transparent to-60% p-3.5 text-center text-7xl mt-3 mx-0 mb-6"
          role="img"
          aria-label="Vocabulary illustration"
        >
          {q.picture ? (
            <img
              className="mx-auto size-28 max-sm:size-24"
              src={`/illustrations/words/${q.picture}.webp`}
              width={512}
              height={512}
              alt=""
            />
          ) : (
            q.visual
          )}
        </div>
      )}
    </>
  );
};
