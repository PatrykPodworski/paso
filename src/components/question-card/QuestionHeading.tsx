import { SkillDot } from "../SkillDot";
import { useEffect, useRef } from "react";
import type { Ref } from "react";
import type { Question } from "../../data/types";
import { AudioButton } from "../audio/AudioButton";
import type { AudioHandle } from "../audio/useAudioPlayer";

type QuestionKindProps = { q: Question; productive: boolean };

const QuestionKind = ({ q, productive }: QuestionKindProps) => (
  <div className="question-kind flex items-center gap-[8px] text-[12px] uppercase tracking-[1.4px] text-sage-600 max-md:gap-[6px] max-md:text-[9px] max-md:tracking-[1px] max-sm:tracking-[0.8px]">
    <SkillDot skill={q.skill} />
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
  const hidePronunciation = !q.audio && !feedback;

  return (
    <>
      <QuestionKind q={q} productive={productive} />
      <div className="question-heading grid grid-cols-[minmax(0,1fr)_auto] gap-x-[12px]">
        <h2
          ref={heading}
          tabIndex={-1}
          className={`font-serif tracking-[-0.7px] col-[1] row-[1] m-[15px_0_23px] text-[27px] font-medium leading-[1.5] focus:outline-none max-md:m-[15px_0_21px] ${
            exam ? "max-md:text-[25px]" : "max-md:text-[24px]"
          }`}
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
            <AudioButton
              ref={listeningAudio}
              round="pronunciation"
              text={q.audio}
              label="Play Spanish audio"
              autoPlay={q.kind === "listen"}
              limit={exam ? 2 : undefined}
            />
          ) : !exam ? (
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
