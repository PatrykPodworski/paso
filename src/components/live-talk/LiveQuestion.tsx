import { useRef } from "react";
import type { LiveGrade, Question } from "../../data/types";
import type { AudioHandle } from "../audio/useAudioPlayer";
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
    <div className="p-[29px_36px_30px] max-md:p-[25px_22px] max-sm:p-[22px_18px]">
      <QuestionHeading
        q={q}
        exam={false}
        feedback={false}
        productive
        listeningAudio={listeningAudio}
        answerAudio={answerAudio}
      />
      <LiveTalk onEvaluated={onEvaluated} onSubmit={onSubmit} />
    </div>
  );
};
