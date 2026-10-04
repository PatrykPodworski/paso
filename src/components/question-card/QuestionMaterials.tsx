import { TextLink } from "../../design-system/TextLink";
import { useState } from "react";
import type { Ref } from "react";
import type { Question } from "../../data/types";
import { AudioButton } from "../audio/AudioButton";
import type { AudioHandle } from "../audio/useAudioPlayer";

const PASSAGE =
  "reading-passage relative rounded-[9px] border border-[#e8e5d6] bg-[#f8f5e9] p-[24px_27px] mb-[22px] max-md:p-[20px]";

type Props = {
  q: Question;
  exam: boolean;
  passageAudio: Ref<AudioHandle>;
  onTranscript: () => void;
};

export const QuestionMaterials = ({ q, exam, passageAudio, onTranscript }: Props) => {
  const [transcript, setTranscript] = useState(false);

  return (
    <>
      {q.image && (
        <img
          className="w-full max-h-[160px] rounded-[10px] object-cover mb-[20px] max-sm:max-h-[130px]"
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
            className="absolute right-[25px] top-[-7px] h-[25px] w-[11px] rotate-[15deg] rounded-[7px] border-2 border-[#c4c9b2]"
            aria-hidden="true"
          />
          {!exam && (
            <AudioButton
              ref={passageAudio}
              continuous
              minimal
              round="passage"
              text={q.passage}
              label="Play the reading passage"
            />
          )}
          <p className="whitespace-pre-line text-[15px] leading-[1.85] text-[#606e53] max-md:text-[14px]">
            {q.passage}
          </p>
        </div>
      )}
      {q.audio && (
        <>
          {!exam && (
            <TextLink
              type="button"
              className="m-[11px_0_19px] text-[13px]! font-normal! text-[#a394b1]!"
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
              className="rounded-[5px] border-l-[3px] border-[#c5b7d2] bg-[#f4f0f7] p-[18px_20px] text-[14px] leading-[1.8] text-[#93879f] mb-[20px]"
              lang="es"
            >
              {q.audio}
              <small className="block text-[12px] leading-[1.6] text-[#ad9dbb] mt-[10px]">
                Transcript assistance is recorded; this answer will not count toward unassisted
                accuracy.
              </small>
            </div>
          )}
        </>
      )}
      {q.visual && (
        <div
          className="bg-[radial-gradient(ellipse,#f4f0e1_0,transparent_60%)] p-[15px] text-center text-[67px] m-[12px_0_24px]"
          role="img"
          aria-label="Vocabulary illustration"
        >
          {q.visual}
        </div>
      )}
    </>
  );
};
