import { useState } from "react";
import { Button } from "../../design-system/Button";
import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import { clipText } from "../../data/progress";
import type { LiveGrade, LiveScore, TalkTurn } from "../../data/types";
import { LiveResult } from "./LiveResult";
import { LiveStart } from "./LiveStart";
import { accessAfter, readAccess, saveAccess } from "./liveAccess";
import { LiveStatus } from "./LiveStatus";
import { clearPendingTalk, readPendingTalk, savePendingTalk } from "./pendingTalk";
import { transcriptText } from "./transcript";
import { useLiveTalk } from "./useLiveTalk";

const PROBLEMS: Record<string, string> = {
  denied: "Microphone access was declined. Allow it in your browser settings to talk to Lucía.",
  microphone: "The microphone could not start. Check it and try again.",
  passcode: "That passcode is not right.",
  passcode_tries: "Too many wrong passcodes. Try again tomorrow.",
  free_used: "This network has already used its free live talk.",
  unavailable: "Lucía is not available right now. Try again later.",
};

type Scoring =
  | { state: "idle" }
  | { state: "scoring" | "failed"; turns: TalkTurn[]; passcode?: string }
  | { state: "done"; turns: TalkTurn[]; score: LiveScore };

type Props = {
  // Keeps a finished talk that is not scored yet when the question closes.
  questionId?: string;
  task: string;
  onEvaluated?: (answer: string, correct: boolean, assisted: boolean, grade: LiveGrade) => void;
  onSubmit: (answer: string, correct: boolean, assisted: boolean) => void;
};

export const LiveTalk = ({ questionId, task, onEvaluated, onSubmit }: Props) => {
  const talk = useLiveTalk();
  const [access, setAccess] = useState(readAccess);
  const [passcode, setPasscode] = useState(access.passcode);
  const [problem, setProblem] = useState("");

  const [scoring, setScoring] = useState<Scoring>(() => {
    const turns = readPendingTalk(questionId);

    return turns
      ? { state: "failed", turns, passcode: access.passcode || undefined }
      : { state: "idle" };
  });

  const score = async (turns: TalkTurn[], passcode: string | undefined) => {
    setScoring({ state: "scoring", turns, passcode });
    savePendingTalk(questionId, turns);

    try {
      const response = await fetch("/api/score-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, turns, passcode }),
      });

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      const result = (await response.json()) as LiveScore;

      setScoring({ state: "done", turns, score: result });
      onEvaluated?.(clipText(transcriptText(turns)), result.grade !== "bad", false, result.grade);
      clearPendingTalk(questionId);
    } catch {
      setScoring({ state: "failed", turns, passcode });
    }
  };

  const remember = (code: string | null) => {
    const next = accessAfter(code, access, passcode);

    if (next !== access) {
      setAccess(next);
      saveAccess(next);
    }
  };

  const start = () => {
    setProblem("");

    const used = access.freeUsed ? passcode : undefined;

    return talk.start(task, used, {
      onCreated: () => {
        remember(null);
        clearPendingTalk(questionId);
        setScoring({ state: "idle" });
      },
      onEnded: (turns) => score(turns, used),
      onFail: (code) => {
        remember(code);
        setPasscode(code === "passcode" ? "" : passcode);
        setProblem(PROBLEMS[code] ?? PROBLEMS.unavailable);
      },
    });
  };

  const again = () => {
    setScoring({ state: "idle" });
    talk.reset();
  };

  return (
    <div className="mbs-1 rounded-lg border border-sand-200 bg-sand-100 p-5 max-md:p-4">
      <FieldNote className="mbe-4">
        Lucía talks with you in Spanish. Your voice goes to OpenAI for the talk; the transcript is
        scored.
      </FieldNote>
      {talk.status === "idle" && (
        <LiveStart
          needsPasscode={access.freeUsed}
          passcode={passcode}
          onPasscode={setPasscode}
          onStart={start}
        />
      )}
      <LiveStatus
        status={talk.status}
        seconds={talk.seconds}
        scoring={scoring.state === "scoring"}
        onEnd={talk.end}
        onCancel={talk.cancel}
      />
      {problem && <Notice as="p">{problem}</Notice>}
      {scoring.state === "failed" && (
        <Notice as="div">
          <p>The talk could not be scored.</p>
          <Button
            variant="secondary"
            size="small"
            onClick={() => score(scoring.turns, scoring.passcode)}
          >
            Score again
          </Button>
        </Notice>
      )}
      {scoring.state === "done" && (
        <LiveResult
          score={scoring.score}
          // A talk restored from storage has no timeline, so its turns are keyed by position.
          turns={
            talk.turns.length ? talk.turns : scoring.turns.map((turn, at) => ({ ...turn, at }))
          }
          onAgain={again}
          onContinue={() =>
            onSubmit(clipText(transcriptText(scoring.turns)), scoring.score.grade !== "bad", false)
          }
        />
      )}
    </div>
  );
};
