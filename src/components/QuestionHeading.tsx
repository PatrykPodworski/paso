import { useEffect, useRef } from "react";
import type { Ref } from "react";
import type { Question } from "../data/types";
import { AudioButton } from "./Audio";
import type { AudioHandle } from "./Audio";
const QuestionKind = ({ q, productive }: { q: Question; productive: boolean }) => (
  <div className="question-kind">
    <span className={`skill-dot ${q.skill}`} />
    {q.skill} <span> / </span>
    {q.kind === "listen"
      ? "Listen closely"
      : q.kind === "order"
        ? "Build a sentence"
        : productive
          ? "Your turn"
          : "A small step forward"}
  </div>
);
export const QuestionHeading = ({
  q,
  exam,
  feedback,
  productive,
  listeningAudio,
  answerAudio,
}: {
  q: Question;
  exam: boolean;
  feedback: boolean;
  productive: boolean;
  listeningAudio: Ref<AudioHandle>;
  answerAudio: Ref<AudioHandle>;
}) => {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const dialog = heading.current?.closest("dialog");
    if (dialog) {
      dialog.scrollTop = 0;
    }
  }, [q.id]);
  const pronunciation = q.pronunciation || q.audio || q.passage || q.answer;
  return (
    <>
      <QuestionKind q={q} productive={productive} />
      <div className="question-heading">
        <h2 ref={heading} tabIndex={-1}>
          {q.prompt}
        </h2>
        <div className="question-pronunciation" hidden={!q.audio && !feedback}>
          {q.audio ? (
            <AudioButton
              ref={listeningAudio}
              compact
              text={q.audio}
              label="Play Spanish audio"
              autoPlay={q.kind === "listen"}
              limit={exam ? 2 : undefined}
            />
          ) : !exam ? (
            <AudioButton
              ref={answerAudio}
              compact
              text={pronunciation}
              label="Play Spanish audio"
            />
          ) : null}
        </div>
      </div>
    </>
  );
};
