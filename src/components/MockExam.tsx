import { Button } from "../design-system/Button";
import { CONTEXT_SIZE } from "../design-system/button-context-sizes";
import { useEffect, useState } from "react";
import { mockSections } from "../data/mock";
import type { Progress } from "../data/types";
import { countWords, isCorrect, passingGroups } from "../data/progress";
import { QuestionCard } from "./QuestionCard";
import { Icon } from "./Icon";
import { stopAudio } from "./Audio";
interface Run {
  section: number;
  index: number;
  stage: "intro" | "run" | "review" | "prep" | "done";
  answers: Record<string, string>;
  deadline: number;
  started: string;
  drafts: Record<string, string>;
}
const KEY = "paso-mock-v1";
const fresh = (): Run => ({
  section: 0,
  index: 0,
  stage: "intro",
  answers: {},
  deadline: 0,
  started: "",
  drafts: {},
});
const load = (): Run => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    return raw &&
      Number.isInteger(raw.section) &&
      raw.section >= 0 &&
      raw.section < 4 &&
      Number.isInteger(raw.index) &&
      raw.index >= 0 &&
      raw.index < mockSections[raw.section].questions.length &&
      ["intro", "run", "review", "prep", "done"].includes(raw.stage) &&
      raw.answers
      ? { ...fresh(), ...raw }
      : fresh();
  } catch {
    return fresh();
  }
};
export const MockExam = ({
  progress,
  onResult,
}: {
  progress: Progress;
  onResult: (result: Progress["mockResults"][number]) => void;
}) => {
  const [run, setRun] = useState<Run>(load);
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [writing, setWriting] = useState("");
  const [speaking, setSpeaking] = useState("");
  const section = mockSections[run.section];
  const q = section.questions[run.index];
  const left = Math.max(0, Math.ceil((run.deadline - now) / 1000));
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(run));
    } catch {
      setStorageError(true);
    }
  }, [run]);
  useEffect(() => {
    if (run.stage !== "run" && run.stage !== "prep") {
      return;
    }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [run.stage]);
  useEffect(() => {
    if ((run.stage === "run" || run.stage === "prep") && run.deadline > 0 && now >= run.deadline) {
      stopAudio();
      setRun((r) =>
        r.stage === "prep"
          ? { ...r, stage: "run", deadline: Date.now() + 600000 }
          : { ...r, stage: "review" },
      );
      setConfirm(false);
    }
  }, [now, run.deadline, run.stage]);
  const start = () => {
    setNow(Date.now());
    setRun({
      ...fresh(),
      stage: "run",
      started: new Date().toISOString(),
      deadline: Date.now() + 45 * 60000,
    });
  };
  const endSection = () => {
    stopAudio();
    setConfirm(false);
    setRun((r) => ({ ...r, stage: "review" }));
  };
  const score = (index: number) =>
    mockSections[index].questions.filter((q) => isCorrect(q, run.answers[q.id] || "")).length;
  const nextSection = () => {
    if (run.section === 3) {
      const result = { at: new Date().toISOString(), reading: score(0), listening: score(1) };
      onResult(result);
      setRun((r) => ({ ...r, stage: "done" }));
      return;
    }
    const next = run.section + 1;
    setNow(Date.now());
    setRun((r) => ({
      ...r,
      index: 0,
      section: next,
      stage: next === 3 ? "prep" : "run",
      deadline: Date.now() + (next === 3 ? 10 : mockSections[next].minutes) * 60000,
    }));
  };
  const download = () => {
    const body = {
      date: run.started,
      reading: score(0),
      listening: score(1),
      writing: "Requires human assessment",
      speaking: "Requires human assessment",
      responses: mockSections.flatMap((s) =>
        s.questions.map((q) => ({
          skill: s.title,
          task: q.task,
          prompt: q.prompt,
          response: run.answers[q.id] || "",
          model: q.answer,
          explanation: q.explanation,
        })),
      ),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(body, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "paso-exam-responses.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const entered =
    writing !== "" &&
    speaking !== "" &&
    +writing >= 0 &&
    +writing <= 25 &&
    +speaking >= 0 &&
    +speaking <= 25;
  const groups = passingGroups(score(0), +writing, score(1), +speaking);
  return (
    <div className="mock-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">A CALM DRESS REHEARSAL</span>
          <h1>Meet the exam.</h1>
          <p>Familiar tasks. A little focus. A more confident you.</p>
        </div>
        <span className="outline-badge">
          <Icon name="clock" size={16} /> Official section timings
        </span>
      </div>
      {storageError && (
        <p className="notice" role="status">
          This browser could not save the rehearsal. Keep this page open to retain your work.
        </p>
      )}
      {run.stage === "intro" ? (
        <>
          <div className="mock-intro panel">
            <div className="mock-intro-art">
              <Icon name="flag" size={70} />
              <span>DELE A1</span>
            </div>
            <div>
              <span className="eyebrow">YOUR FIRST FULL REHEARSAL</span>
              <h2>
                One exam. Four ways
                <br />
                to make yourself understood.
              </h2>
              <p>
                Try 55 original tasks and questions. Reading and listening are scored automatically.
                Writing and speaking are saved for self-review or a teacher’s assessment.
              </p>
              <div className="mock-meta">
                <span>
                  <Icon name="clock" />
                  105 min + 10 min oral prep
                </span>
                <span>
                  <Icon name="book" />4 skills · 100 possible points
                </span>
              </div>
              <Button variant="primary" onClick={start}>
                Start exam rehearsal
                <Icon name="arrow" />
              </Button>
            </div>
          </div>
          <div className="exam-section-grid">
            {mockSections.map((s, i) => (
              <article className="panel" key={s.title}>
                <div className={`skill-icon ${s.title.toLowerCase()}`}>
                  <Icon name={["book", "headphones", "pen", "mic"][i]} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.spanish}</p>
                <strong>{s.minutes} minutes</strong>
                <span>
                  {s.questions.length} {i < 2 ? "questions · 4 tasks" : "tasks"}
                </span>
              </article>
            ))}
          </div>
          <div className="notice">
            <Icon name="info" />
            <p>
              This is an independent guided rehearsal. Shorter listening clips, visual symbols and
              navigation differ from the live exam; audio is controlled per question. Use the{" "}
              <a
                href="https://examenes.cervantes.es/es/dele/preparar-prueba"
                target="_blank"
                rel="noreferrer"
              >
                official papers and recordings
              </a>{" "}
              to practise exact formatting and continuous audio. The timer keeps running if you
              leave this page.
            </p>
          </div>
          {progress.mockResults.length > 0 && (
            <div className="panel previous-exams">
              <h3>Your previous rehearsals</h3>
              {progress.mockResults
                .slice()
                .reverse()
                .map((r, i) => (
                  <div className="history-row" key={`${r.at}-${i}`}>
                    <span>{new Date(r.at).toLocaleDateString()}</span>
                    <strong>Reading {r.reading}/25</strong>
                    <strong>Listening {r.listening}/25</strong>
                    <small>Productive skills ungraded</small>
                  </div>
                ))}
            </div>
          )}
        </>
      ) : run.stage === "done" ? (
        <div className="panel exam-results">
          <div className="completion-art">
            <Icon name="trophy" size={48} />
          </div>
          <span className="eyebrow">REHEARSAL COMPLETE</span>
          <h2>You’ve met the exam.</h2>
          <p>Now you know where your next steps can take you.</p>
          <div className="result-score-grid">
            <div>
              <span>Reading</span>
              <strong>
                {score(0)}
                <small>/25</small>
              </strong>
            </div>
            <div>
              <span>Listening</span>
              <strong>
                {score(1)}
                <small>/25</small>
              </strong>
            </div>
            <div>
              <span>Writing</span>
              <strong className="ungraded">Human review</strong>
            </div>
            <div>
              <span>Speaking</span>
              <strong className="ungraded">Human review</strong>
            </div>
          </div>
          <div className="score-calculator">
            <h3>Check the two passing groups</h3>
            <p>
              Enter scores from a qualified reviewer, or explore hypothetical scores. These inputs
              do not assess your writing or pronunciation.
            </p>
            <div className="form-inline">
              <label>
                Writing score /25
                <input
                  type="number"
                  min="0"
                  max="25"
                  step="0.01"
                  value={writing}
                  onChange={(e) => setWriting(e.target.value)}
                  placeholder="Not yet graded"
                />
              </label>
              <label>
                Speaking score /25
                <input
                  type="number"
                  min="0"
                  max="25"
                  step="0.01"
                  value={speaking}
                  onChange={(e) => setSpeaking(e.target.value)}
                  placeholder="Not yet graded"
                />
              </label>
            </div>
            {entered ? (
              <div className={`notice ${groups.pass ? "positive" : ""}`}>
                <p>
                  Reading + writing: <strong>{groups.group1.toFixed(2)}/50</strong>
                  <br />
                  Listening + speaking: <strong>{groups.group2.toFixed(2)}/50</strong>
                  <br />
                  {groups.pass
                    ? "Both groups meet 30/50 based on the entered scores."
                    : "At least one group is below 30/50 based on the entered scores."}{" "}
                  This is not an official result or a prediction.
                </p>
              </div>
            ) : (
              <p className="field-note">
                A pass cannot be determined from reading and listening alone. Enter both scores
                between 0 and 25.
              </p>
            )}
          </div>
          <div className="button-row">
            <Button variant="secondary" sizeClasses={CONTEXT_SIZE.examResults} className="[@media(max-width:760px)]:w-full" onClick={download}>
              <Icon name="download" />
              Export responses for review
            </Button>
            <Button variant="primary" sizeClasses={CONTEXT_SIZE.examResults} className="[@media(max-width:760px)]:w-full" onClick={() => setRun(fresh())}>
              Return to exam overview
              <Icon name="arrow" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="exam-topbar">
            <div className="exam-steps">
              {mockSections.map((s, i) => (
                <span
                  key={s.title}
                  className={i === run.section ? "active" : i < run.section ? "done" : ""}
                >
                  <b>{i < run.section ? "✓" : i + 1}</b>
                  {s.title}
                </span>
              ))}
            </div>
            {run.stage !== "review" && (
              <span
                role="timer"
                aria-label="Time remaining"
                className={`exam-timer ${left < 120 ? "urgent" : ""}`}
              >
                <Icon name="clock" />
                {String(Math.floor(left / 60)).padStart(2, "0")}:
                {String(left % 60).padStart(2, "0")}
              </span>
            )}
          </div>
          {run.stage === "prep" ? (
            <div className="panel oral-prep">
              <span className="eyebrow">10 MINUTES TO PREPARE</span>
              <h2>A moment to find your words.</h2>
              <p>
                Prepare tasks 1 and 2. You may make brief notes; practise speaking from ideas rather
                than reading a script.
              </p>
              {mockSections[3].questions.slice(0, 2).map((q) => (
                <div key={q.id}>
                  <h3>{q.task}</h3>
                  <p>{q.prompt}</p>
                </div>
              ))}
              <label>
                Your preparation notes
                <textarea
                  rows={6}
                  value={run.drafts.prep || ""}
                  onChange={(e) =>
                    setRun((r) => ({ ...r, drafts: { ...r.drafts, prep: e.target.value } }))
                  }
                  placeholder="Nombre · nacionalidad · edad…"
                />
              </label>
              <Button
                variant="primary"
                onClick={() => {
                  setNow(Date.now());
                  setRun((r) => ({ ...r, stage: "run", deadline: Date.now() + 600000 }));
                }}
              >
                I’m ready · start speaking
                <Icon name="mic" />
              </Button>
            </div>
          ) : run.stage === "review" ? (
            <div className="panel section-review">
              <span className="eyebrow">{section.title.toUpperCase()} · SECTION REVIEW</span>
              <h2>
                {run.section < 2
                  ? `${score(run.section)} out of 25.`
                  : "Your practice is ready to review."}
              </h2>
              <p>
                {run.section < 2
                  ? "Correct answers earn one point. Wrong or unanswered questions earn zero, with no penalty."
                  : "Open responses require human judgment. Compare your response with the model and cover every requested point."}
              </p>
              <div className="button-row">
                <Button variant="primary" onClick={nextSection}>
                  {run.section === 3
                    ? "See my results"
                    : run.section === 2
                      ? "Continue to speaking preparation"
                      : `Continue to ${mockSections[run.section + 1].title.toLowerCase()}`}
                  <Icon name="arrow" />
                </Button>
              </div>
              <div className="answer-review-list">
                {section.questions.map((q, i) => {
                  const answer = run.answers[q.id];
                  return (
                    <details key={q.id}>
                      <summary>
                        <span
                          className={`review-status ${run.section > 1 ? "neutral" : isCorrect(q, answer || "") ? "good" : "bad"}`}
                        >
                          <Icon
                            name={
                              run.section > 1 ? "pen" : isCorrect(q, answer || "") ? "check" : "x"
                            }
                            size={16}
                          />
                        </span>
                        <span>
                          {i + 1}. {q.prompt}
                        </span>
                      </summary>
                      <div>
                        <p>
                          Your answer: <strong lang="es">{answer || "Not answered"}</strong>
                        </p>
                        <p>
                          {run.section < 2 ? "Correct answer" : "One possible response"}:{" "}
                          <strong lang="es">{q.answer}</strong>
                        </p>
                        <p>{q.explanation}</p>
                        {q.audio && <p lang="es">Transcript: {q.audio}</p>}
                        {q.minWords && (
                          <p>
                            Response length:{" "}
                            {countWords(
                              q.kind === "form"
                                ? (answer || "").replace(/^.*?: /gm, "")
                                : answer || "",
                            )}{" "}
                            words. Target: {q.minWords}–{q.maxWords}.
                          </p>
                        )}
                        {q.checklist?.map((c) => (
                          <p key={c}>□ {c}</p>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="panel exam-running">
              <div className="exam-question-nav">
                <span>{q.task}</span>
                <strong>
                  {run.index + 1} / {section.questions.length}
                </strong>
              </div>
              <QuestionCard
                key={`${run.section}-${run.index}`}
                q={q}
                exam
                draft={run.drafts[q.id] ?? run.answers[q.id] ?? ""}
                onDraft={(text) => setRun((r) => ({ ...r, drafts: { ...r.drafts, [q.id]: text } }))}
                onSubmit={(answer) => {
                  stopAudio();
                  setRun((r) => ({
                    ...r,
                    answers: { ...r.answers, [q.id]: answer },
                    index: Math.min(r.index + 1, section.questions.length - 1),
                  }));
                  if (run.index === section.questions.length - 1) {
                    setConfirm(true);
                  }
                }}
              />
              <div className="exam-navigation">
                <button
                  className="text-link"
                  disabled={run.index === 0}
                  onClick={() => {
                    stopAudio();
                    setRun((r) => ({ ...r, index: r.index - 1 }));
                  }}
                >
                  ← Previous question
                </button>
                <button
                  className="text-link"
                  onClick={() => {
                    stopAudio();
                    if (run.index === section.questions.length - 1) {
                      setConfirm(true);
                    } else {
                      setRun((r) => ({ ...r, index: r.index + 1 }));
                    }
                  }}
                >
                  Skip for now →
                </button>
                <Button variant="secondary" size="small" className="[@media(max-width:760px)]:w-full" onClick={() => setConfirm(true)}>
                  Finish section
                </Button>
              </div>
              {confirm && (
                <div className="finish-confirm" role="alert">
                  <h3>Finish {section.title.toLowerCase()}?</h3>
                  <p>
                    {section.questions.filter((q) => !run.answers[q.id]).length} unanswered. After
                    finishing, answers in this section cannot be changed.
                  </p>
                  <div className="button-row">
                    <Button variant="secondary" onClick={() => setConfirm(false)}>
                      Keep working
                    </Button>
                    <Button variant="primary" onClick={endSection}>
                      Finish & review
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
