import { useEffect, useRef } from "react";
import type { Ref } from "react";
import type { Question } from "../../data/types";
import { AudioButton } from "../audio/AudioButton";
import type { AudioHandle } from "../audio/useAudioPlayer";

// The pronunciation player sits in the heading grid's second column; its own
// wrappers become `contents` so the button and the plays counter place themselves.
const PRONUNCIATION =
  "[&:not([hidden])]:contents [&_.audio-control]:contents [&_.icon-button]:col-[2] [&_.icon-button]:row-[1] [&_.icon-button]:self-start [&_.icon-button]:w-[44px] [&_.icon-button]:h-[44px] [&_.icon-button]:mt-[15px] [&_.icon-button]:rounded-full [&_.icon-button]:border [&_.icon-button]:border-[#e5dfec] [&_.icon-button]:bg-[#f3eff7] [&_.icon-button]:text-[#7c698e] [&_.icon-button:hover]:bg-[#eae3f1] [&_.audio-control>small]:col-[2] [&_.audio-control>small]:m-[-12px_0_16px] [&_.audio-control>small]:text-center [&_.audio-control>small]:whitespace-nowrap";

type QuestionKindProps = { q: Question; productive: boolean };

const QuestionKind = ({ q, productive }: QuestionKindProps) => (
  <div className="question-kind flex items-center gap-[8px] text-[12px] uppercase tracking-[1.4px] text-[#7c8c68] max-tablet:gap-[6px] max-tablet:text-[9px] max-tablet:tracking-[1px] max-phone:tracking-[0.8px]">
    <span className={`skill-dot ${q.skill}`} />
    {q.skill} <span className="px-[4px] opacity-50"> / </span>
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
      <div className="question-heading grid grid-cols-[minmax(0,1fr)_auto] gap-x-[12px]">
        <h2
          ref={heading}
          tabIndex={-1}
          className={`col-[1] row-[1] m-[15px_0_23px] text-[27px] font-medium leading-[1.5] focus:outline-none max-tablet:m-[15px_0_21px] ${
            exam ? "max-tablet:text-[25px]" : "max-tablet:text-[24px]"
          }`}
        >
          {q.prompt}
        </h2>
        <div className={`question-pronunciation ${PRONUNCIATION}`} hidden={!q.audio && !feedback}>
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
