import { useRef } from "react";
import type { LiveScore, Question } from "../../data/types";
import type { AudioHandle } from "../audio/useAudioPlayer";
import { cardPadding } from "../question-card/cardPadding";
import type { LastAttempt } from "../history/LastTime";
import { QuestionHeading } from "../question-card/QuestionHeading";
import { LiveTalk } from "./LiveTalk";

type Props = {
  q: Question;
  onEvaluated?: (answer: string, correct: boolean, assisted: boolean, score: LiveScore) => void;
  onSubmit: (answer: string, correct: boolean, assisted: boolean) => void;
  previous?: LastAttempt;
};

export const LiveQuestion = ({ q, onEvaluated, onSubmit, previous }: Props) => {
  const listeningAudio = useRef<AudioHandle>(null);
  const answerAudio = useRef<AudioHandle>(null);

  return (
    <div className={cardPadding(false)}>
      <QuestionHeading
        q={q}
        exam={false}
        feedback={false}
        productive
        listeningAudio={listeningAudio}
        answerAudio={answerAudio}
        previous={previous}
      />
      <LiveTalk
        questionId={q.id}
        task={q.talk ?? ""}
        onEvaluated={onEvaluated}
        onSubmit={onSubmit}
      />
    </div>
  );
};
