import { useEffect, useRef } from "react";
import type { Ref } from "react";
import type { Question } from "../../data/types";
import { AudioButton } from "../audio/AudioButton";
import type { AudioHandle } from "../audio/useAudioPlayer";

type QuestionKindProps = { q: Question; productive: boolean };

const QuestionKind = ({ q, productive }: QuestionKindProps) => (
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

type Props = {
  q: Question;
  exam: boolean;
  feedback: boolean;
  productive: boolean;
  listeningAudio: Ref<AudioHandle>;
  answerAudio: Ref<AudioHandle>;
};

export const QuestionHeading = ({
  q,
  exam,
  feedback,
  productive,
  listeningAudio,
  answerAudio,
}: Props) => {
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
        <div
          className="question-pronunciation [&_button]:col-start-2 [&_button]:row-start-1 [&_button]:mt-[15px] [&_button]:h-[44px] [&_button]:w-[44px] [&_button]:self-start [&_button]:rounded-[50%] [&_button]:border [&_button]:border-[#e5dfec] [&_button]:bg-[#f3eff7] [&_button]:text-[#7c698e] [&_button:hover]:bg-[#eae3f1]"
          hidden={!q.audio && !feedback}
        >
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
