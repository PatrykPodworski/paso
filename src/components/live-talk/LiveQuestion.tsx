import { useRef } from "react";
import type { LiveGrade, Question } from "../../data/types";
import type { AudioHandle } from "../audio/useAudioPlayer";
import { cardPadding } from "../question-card/cardPadding";
import { QuestionHeading } from "../question-card/QuestionHeading";
import { LiveTalk } from "./LiveTalk";

type Props = {
  q: Question;
  onEvaluated?: (answer: string, correct: boolean, assisted: boolean, grade: LiveGrade) => void;
  onSubmit: (answer: string, correct: boolean, assisted: boolean) => void;
};

export const LiveQuestion = ({ q, onEvaluated, onSubmit }: Props) => {
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
      />
      <LiveTalk task={q.talk ?? ""} onEvaluated={onEvaluated} onSubmit={onSubmit} />
    </div>
  );
};
