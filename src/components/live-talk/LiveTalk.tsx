import { useState } from "react";
import { Button } from "../../design-system/Button";
import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import type { LiveGrade, LiveScore, TalkTurn } from "../../data/types";
import { LiveResult } from "./LiveResult";
import { LiveStart } from "./LiveStart";
import { accessAfter, readAccess, saveAccess } from "./liveAccess";
import { LiveStatus } from "./LiveStatus";
import { transcriptText } from "./transcript";
import { useLiveTalk } from "./useLiveTalk";

const PROBLEMS: Record<string, string> = {
  denied: "Microphone access was declined. Allow it in your browser settings to talk to Lucía.",
  microphone: "The microphone could not start. Check it and try again.",
  passcode: "That passcode is not right.",
  passcode_tries: "Too many wrong passcodes. Try again tomorrow.",
  free_used: "This network has already used its free live talk.",
  daily_cap: "The live talks for today are used up. Try again tomorrow.",
  unavailable: "Lucía is not available right now. Try again later.",
};

type Scoring =
  | { state: "idle" }
  | { state: "scoring" | "failed"; turns: TalkTurn[] }
  | { state: "done"; turns: TalkTurn[]; score: LiveScore };

type Props = {
  onEvaluated?: (answer: string, correct: boolean, assisted: boolean, grade: LiveGrade) => void;
  onSubmit: (answer: string, correct: boolean, assisted: boolean) => void;
};

export const LiveTalk = ({ onEvaluated, onSubmit }: Props) => {
  const talk = useLiveTalk();
  const [access, setAccess] = useState(readAccess);
  const [passcode, setPasscode] = useState(access.passcode);
  const [problem, setProblem] = useState("");
  const [scoring, setScoring] = useState<Scoring>({ state: "idle" });

  const score = async (turns: TalkTurn[]) => {
    setScoring({ state: "scoring", turns });

    try {
      const response = await fetch("/api/score-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turns }),
      });

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      const result = (await response.json()) as LiveScore;

      setScoring({ state: "done", turns, score: result });
      onEvaluated?.(transcriptText(turns), result.grade !== "bad", false, result.grade);
    } catch {
      setScoring({ state: "failed", turns });
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

    return talk.start(access.freeUsed ? passcode : undefined, {
      onCreated: () => remember(null),
      onEnded: score,
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
    <div className="mbs-[4px] rounded-[10px] border border-sand-200 bg-sand-100 p-[22px] max-md:p-[18px]">
      <FieldNote className="mbe-[16px]">
        Lucía asks you three short questions in Spanish. The talk lasts about a minute and ends
        after two. Your voice goes to OpenAI for the talk; the transcript is scored.
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
          <Button variant="secondary" size="small" onClick={() => score(scoring.turns)}>
            Score again
          </Button>
        </Notice>
      )}
      {scoring.state === "done" && (
        <LiveResult
          score={scoring.score}
          turns={talk.turns}
          onAgain={again}
          onContinue={() =>
            onSubmit(transcriptText(scoring.turns), scoring.score.grade !== "bad", false)
          }
        />
      )}
    </div>
  );
};
