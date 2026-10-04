import { useEffect, useRef, useState } from "react";
import type { Question } from "../../data/types";
import { isCorrect } from "../../data/progress";
import { AnswerOptions } from "./AnswerOptions";
import { FormFields } from "./FormFields";
import { playWord } from "../audio/playWord";
import { stopAudio } from "../audio/playback";
import type { AudioHandle } from "../audio/useAudioPlayer";
import { QuestionFeedback } from "./QuestionFeedback";
import { QuestionFooter } from "./QuestionFooter";
import { QuestionHeading } from "./QuestionHeading";
import { PracticeChecks } from "./PracticeChecks";
import { QuestionMaterials } from "./QuestionMaterials";
import { SentenceBuilder } from "./SentenceBuilder";
import { useAnswer } from "./useAnswer";
import { WritingArea } from "./WritingArea";

const cardPadding = (exam: boolean) =>
  exam
    ? "pt-6 px-0 pb-0 max-md:pt-5 max-md:px-0 max-md:pb-0"
    : "py-7 px-9 max-md:py-6 max-md:px-5 max-sm:py-5 max-sm:px-4";

type Props = {
  q: Question;
  onSubmit: (answer: string, correct: boolean | null, assisted: boolean) => void;
  onEvaluated?: (answer: string, correct: boolean | null, assisted: boolean) => void;
  exam?: boolean;
  draft?: string;
  onDraft?: (text: string) => void;
};

export const QuestionCard = ({
  q,
  onSubmit,
  onEvaluated,
  exam = false,
  draft = "",
  onDraft,
}: Props) => {
  const answerAudio = useRef<AudioHandle>(null);
  const listeningAudio = useRef<AudioHandle>(null);
  const passageAudio = useRef<AudioHandle>(null);
  const [feedback, setFeedback] = useState(false);
  const [assisted, setAssisted] = useState(false);
  const a = useAnswer(q, draft, onDraft);
  const { answer, setText, selected, productive, value, submission, correct, words, canSubmit } = a;

  const submit = (choice?: string, after?: Promise<void>) => {
    const valid = choice === undefined ? canSubmit : !q.options || q.options.includes(choice);

    if (!valid || feedback) {
      return;
    }

    const submitted = choice ?? submission;
    const result = choice ? isCorrect(q, choice) : correct;

    if (exam) {
      onSubmit(submitted, result, assisted);

      return;
    }

    onEvaluated?.(submitted, result, assisted);
    setFeedback(true);

    // Keep the player mounted so playback starts inside the answer gesture.
    // Read the Spanish model even after a mistake, never the incorrect answer.
    // A tapped word is already speaking, so wait for it and read the sentence
    // after it rather than cutting it off. A passage the learner is listening
    // to must not be cut off by the model at all.
    if (q.kind !== "listen" && !passageAudio.current?.playing()) {
      const player = q.audio ? listeningAudio : answerAudio;

      if (after) {
        void after.then(() => player.current?.play());
      } else {
        player.current?.play();
      }
    }
  };

  const pickToken = (i: number) => {
    const spoken = playWord(q.tokens![i]);
    const next = [...selected, i];

    a.setSelected(next);
    const sentence = next.map((j) => q.tokens![j]).join(" ");

    if (next.length === q.tokens!.length && isCorrect(q, sentence)) {
      submit(sentence, spoken);
    }
  };

  // Number keys answer the question, mirroring the badges on each button.
  // ponytail: re-subscribed every render so the handler reads current state.
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const typing = document.activeElement?.closest("input, textarea");

      if (e.metaKey || e.ctrlKey || e.altKey || feedback || typing) {
        return;
      }

      const i = Number(e.key) - 1;

      if (!Number.isInteger(i) || i < 0) {
        return;
      }

      if (q.options?.[i] !== undefined) {
        e.preventDefault();
        setText(q.options[i]);
        submit(q.options[i]);
      } else if (q.kind === "order" && q.tokens?.[i] !== undefined && !selected.includes(i)) {
        e.preventDefault();
        pickToken(i);
      }
    };

    window.addEventListener("keydown", handle);

    return () => window.removeEventListener("keydown", handle);
  });

  return (
    <div className={cardPadding(exam)}>
      <QuestionHeading
        q={q}
        exam={exam}
        feedback={feedback}
        productive={productive}
        listeningAudio={listeningAudio}
        answerAudio={answerAudio}
      />
      <QuestionMaterials
        q={q}
        exam={exam}
        passageAudio={passageAudio}
        onTranscript={() => setAssisted(true)}
      />
      {q.options && (
        <AnswerOptions
          options={q.options}
          correctAnswer={q.answer}
          answer={answer}
          feedback={feedback}
          correct={correct}
          onChoose={(option) => {
            setText(option);
            submit(option);
          }}
        />
      )}
      {q.kind === "order" && (
        <SentenceBuilder
          tokens={q.tokens || []}
          selected={selected}
          feedback={feedback}
          onRemove={(pos) => a.setSelected((v) => v.filter((_, i) => i !== pos))}
          onPick={pickToken}
        />
      )}
      {["type", "write"].includes(q.kind) && (
        <WritingArea
          q={q}
          answer={answer}
          feedback={feedback}
          words={words}
          setText={setText}
          submit={() => submit()}
        />
      )}
      {q.kind === "form" && (
        <FormFields
          q={q}
          fieldValues={a.fieldValues}
          feedback={feedback}
          words={words}
          onFieldChange={a.setField}
        />
      )}
      <PracticeChecks
        q={q}
        exam={exam}
        feedback={feedback}
        practice={a}
        onStart={() => {
          a.setSpoken(false);
          setFeedback(false);
        }}
      />
      {!feedback ? (
        <QuestionFooter
          exam={exam}
          productive={productive}
          kind={q.kind}
          canSubmit={canSubmit}
          onCheck={() => submit()}
        />
      ) : (
        <QuestionFeedback
          q={q}
          correct={correct}
          productive={productive}
          value={value}
          checked={a.checks.length}
          assisted={assisted}
          onRevise={() => {
            stopAudio();
            setFeedback(false);
          }}
          onContinue={() => onSubmit(submission, correct, assisted)}
        />
      )}
    </div>
  );
};
