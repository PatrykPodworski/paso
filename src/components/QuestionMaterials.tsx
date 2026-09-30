import { TextLink } from "../design-system/TextLink";
import { useState } from "react";
import type { Ref } from "react";
import type { Question } from "../data/types";
import { AudioButton } from "./audio/AudioButton";
import type { AudioHandle } from "./audio/useAudioPlayer";

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
          className="question-scene"
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
        <div className="reading-passage" lang="es">
          <span className="paper-clip" aria-hidden="true" />
          {!exam && (
            <AudioButton
              ref={passageAudio}
              continuous
              minimal
              text={q.passage}
              label="Play the reading passage"
            />
          )}
          <p>{q.passage}</p>
        </div>
      )}
      {q.audio && (
        <>
          {!exam && (
            <TextLink
              type="button"
              className="transcript-toggle"
              onClick={() => {
                setTranscript((t) => !t);
                onTranscript();
              }}
            >
              {transcript ? "Hide transcript" : "Need a hand? Show transcript"}
            </TextLink>
          )}
          {transcript && (
            <div className="transcript" lang="es">
              {q.audio}
              <small>
                Transcript assistance is recorded; this answer will not count toward unassisted
                accuracy.
              </small>
            </div>
          )}
        </>
      )}
      {q.visual && (
        <div className="vocab-visual" role="img" aria-label="Vocabulary illustration">
          {q.visual}
        </div>
      )}
    </>
  );
};
