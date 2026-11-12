import { SkillDot } from "../SkillDot";
import { useEffect, useRef } from "react";
import type { Ref } from "react";
import { EXAM_PLAYS, spokenText } from "../../data/audio";
import type { Question } from "../../data/types";
import { AudioButton } from "../audio/AudioButton";
import type { AudioHandle } from "../audio/useAudioPlayer";
import { isSilentTask } from "./useAnswer";
import { type LastAttempt, LastTime } from "../history/LastTime";

type QuestionKindProps = { q: Question; productive: boolean; previous?: LastAttempt };

const QuestionKind = ({ q, productive, previous }: QuestionKindProps) => (
  <div className="question-kind flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground max-md:gap-1.5 max-md:text-2xs max-sm:tracking-wider">
    <SkillDot skill={q.skill} />
    {q.skill} <span className="px-1 opacity-50"> / </span>
    {q.kind === "listen"
      ? "Listen closely"
      : q.kind === "order"
        ? "Build a sentence"
        : productive
          ? "Your turn"
          : "A small step forward"}
    {previous && <LastTime previous={previous} />}
  </div>
);

// The exam's plays of a recording, which every question that shares it counts together.
export type RecordingPlays = { count: number; onPlayed: () => void };

type ListeningPlayerProps = {
  ref: Ref<AudioHandle>;
  q: Question & { audio: string };
  exam: boolean;
  plays?: RecordingPlays;
};

// A recording plays by itself only the first time.
const ListeningPlayer = ({ ref, q, exam, plays }: ListeningPlayerProps) => (
  <AudioButton
    ref={ref}
    round="pronunciation"
    text={q.audio}
    label="Play Spanish audio"
    autoPlay={q.kind === "listen" && !plays?.count}
    continuous
    limit={exam ? EXAM_PLAYS : undefined}
    played={plays?.count}
    onPlayed={plays?.onPlayed}
  />
);

type Props = {
  q: Question;
  exam: boolean;
  feedback: boolean;
  productive: boolean;
  listeningAudio: Ref<AudioHandle>;
  answerAudio: Ref<AudioHandle>;
  // The learner's previous answer to this question, shown in a lesson.
  previous?: LastAttempt;
  plays?: RecordingPlays;
};

export const QuestionHeading = ({
  q,
  exam,
  feedback,
  productive,
  listeningAudio,
  answerAudio,
  previous,
  plays,
}: Props) => {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // A typed answer focuses its own field, so the learner can type at once.
    if (!["type", "write"].includes(q.kind)) {
      heading.current?.focus({ preventScroll: true });
    }

    const dialog = heading.current?.closest("dialog");

    if (dialog) {
      dialog.scrollTop = 0;
    }
  }, [q.id, q.kind]);

  const pronunciation = spokenText(q);
  const hidePronunciation = !q.audio && (!feedback || isSilentTask(q));

  return (
    <>
      <QuestionKind q={q} productive={productive} previous={previous} />
      {/* The instruction, small and muted, then the sentence or situation it refers to, on its
          own line with a rule at its start. Both sit outside the heading, so a screen reader
          reads them first and the heading's name stays the prompt alone. */}
      {(q.instruction || q.context) && (
        <div className="mbs-3.5 flex flex-col gap-2">
          {q.instruction && (
            <p className="text-sm leading-relaxed text-muted-foreground">{q.instruction}</p>
          )}
          {q.context && (
            <p className="question-context border-s-2 border-border ps-3 text-base leading-relaxed text-foreground">
              {q.context}
            </p>
          )}
        </div>
      )}
      <div className="question-heading grid grid-cols-1 gap-x-3">
        <h2
          ref={heading}
          tabIndex={-1}
          className={`font-heading tracking-tight col-start-1 row-start-1 ${q.context ? "mbs-3" : q.instruction ? "mbs-1" : "mbs-3.5"} mx-0 mb-6 text-2xl font-medium leading-normal focus:outline-none max-md:mx-0 max-md:mb-5`}
        >
          {q.prompt}
        </h2>
        {/* The player sits in the heading grid's second column; the wrapper becomes
            `contents` so the button places itself (AudioButton places its counter). */}
        <div
          className={`question-pronunciation ${hidePronunciation ? "" : "contents"}`}
          hidden={hidePronunciation}
        >
          {q.audio ? (
            <ListeningPlayer
              ref={listeningAudio}
              q={{ ...q, audio: q.audio }}
              exam={exam}
              plays={plays}
            />
          ) : !exam && !isSilentTask(q) ? (
            <AudioButton
              ref={answerAudio}
              round="pronunciation"
              text={pronunciation}
              label="Play Spanish audio"
            />
          ) : null}
        </div>
      </div>
    </>
  );
};
