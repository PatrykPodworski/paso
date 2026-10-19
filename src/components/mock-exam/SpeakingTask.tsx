import { useRef } from "react";
import { topicTalks } from "../../data/mock";
import type { LiveScore, Question } from "../../data/types";
import type { AudioHandle } from "../audio/useAudioPlayer";
import { LiveTalk } from "../live-talk/LiveTalk";
import { cardPadding } from "../question-card/cardPadding";
import { QuestionHeading } from "../question-card/QuestionHeading";
import { TopicPicker } from "./TopicPicker";
import type { Run, SetRun } from "./useMockRun";

type Props = {
  q: Question;
  run: Run;
  setRun: SetRun;
  onNext: () => void;
};

// One speaking task of the mock exam: a live talk whose transcript and grade are kept with
// the run as soon as Lucía has scored, so a reload shows the result instead of a new talk.
export const SpeakingTask = ({ q, run, setRun, onNext }: Props) => {
  const listeningAudio = useRef<AudioHandle>(null);
  const answerAudio = useRef<AudioHandle>(null);
  const task = q.talk ?? "";
  const result = run.talks[q.id];
  const needsTopic = topicTalks.includes(task);

  const keep = (answer: string, score: LiveScore) =>
    setRun((r) => ({
      ...r,
      answers: { ...r.answers, [q.id]: answer },
      talks: { ...r.talks, [q.id]: score },
    }));

  return (
    <div className={cardPadding(true)}>
      <QuestionHeading
        q={q}
        exam
        feedback={false}
        productive
        listeningAudio={listeningAudio}
        answerAudio={answerAudio}
      />
      {needsTopic && !result && (
        <TopicPicker topic={run.topic} onPick={(topic) => setRun((r) => ({ ...r, topic }))} />
      )}
      {(result || !needsTopic || run.topic) && (
        <LiveTalk
          exam
          task={task}
          topic={needsTopic ? run.topic : undefined}
          result={result}
          onEvaluated={(answer, _correct, _assisted, score) => keep(answer, score)}
          onSubmit={onNext}
        />
      )}
    </div>
  );
};
