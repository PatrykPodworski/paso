import type { MockTopic } from "./mock.ts";

export type Skill = "reading" | "listening" | "writing" | "speaking";

// A card in words.json. TypeScript infers a different shape per topic from the JSON, and
// flattening the topics fails once a card mixes key, unit and picture, so the shape is declared.
export type WordCard = {
  es: string;
  en: string;
  key?: string;
  unit?: number;
  unitOrder?: number;
  visual?: string;
  picture?: string;
};

export type UnitWordCard = WordCard & { unit: number; unitOrder: number; visual: string };

export type QuestionKind =
  | "choice"
  | "listen"
  | "type"
  | "order"
  | "write"
  | "form"
  | "live"
  // An unscored teaching card: `prompt` is its heading and `teach` its body.
  | "teach";

export type TeachExample = { es: string; en: string };
export type TeachTerm = { es: string; meaning: string; example?: TeachExample; note?: string };

// A teaching card's body: new words one per row, or a rule with its examples.
export type TeachContent = {
  heading: string;
  rule?: string;
  terms?: TeachTerm[];
  examples?: TeachExample[];
};

export type Grade = "perfect" | "good" | "bad";
export type LiveItem = "correct" | "understandable" | "missing";
export type LiveScoreItem = { id: string; label: string; level: LiveItem };

export type Correction = {
  original: string;
  corrected: string;
  explanation: string;
  // Set by the writing review when the correction changes only accents or ¿ ?.
  accentOnly?: true;
};

// corrections is absent when the learner said nothing, so there was nothing to check.
export type LiveScore = { grade: Grade; items: LiveScoreItem[]; corrections?: Correction[] };
export type TalkTurn = { role: "examiner" | "student"; text: string };

export type WritingCoverage = { point: string; met: boolean; feedback: string };
// A DELE A1 writing mark: one holistic band from 0 to 3 per task.
export type WritingMark = { band: number; reason: string };

export type WritingReview = {
  wordCount: number;
  coverage: WritingCoverage[];
  corrections: Correction[];
  revised: string;
  mark?: WritingMark;
  // A practice task's result, recorded like a live talk's grade.
  grade?: Grade;
};

type QuestionFields = {
  id: string;
  skill: Skill;
  // What the learner does with the prompt, shown apart from it, e.g. "Translate into Spanish".
  instruction?: string;
  prompt: string;
  answer: string;
  explanation: string;
  memoryHint?: string;
  // Shown one at a time before checking; the step after the last one reveals the answer.
  hints?: string[];
  options?: string[];
  accepted?: string[];
  passage?: string;
  audio?: string;
  // Spanish to hear after answering; separate from listening prompts and English answers.
  pronunciation?: string;
  image?: string;
  visual?: string;
  // A papercut word picture in public/illustrations/words/; shown instead of the visual emoji.
  picture?: string;
  tokens?: string[];
  checklist?: string[];
  // A write task answered with one question or one sentence, which the writing review checks
  // against the checklist instead of as a letter.
  single?: "question" | "sentence";
  minWords?: number;
  maxWords?: number;
  fields?: { label: string; example: string }[];
  task?: string;
  // The server-side talk task a live question runs.
  talk?: string;
  // The answer is a full Spanish question, so a correct typed answer without ¿ and ? gets a note.
  questionMarks?: true;
};

export type Exercise = QuestionFields & { kind: Exclude<QuestionKind, "teach">; teach?: never };
export type TeachingQuestion = QuestionFields & { kind: "teach"; teach: TeachContent };
export type Question = Exercise | TeachingQuestion;

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  icon: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  spanish: string;
  subtitle: string;
  icon: string;
  goals: string[];
  tip: string;
  example: string;
  lessons: Lesson[];
}

export interface Attempt {
  id: string;
  questionId: string;
  skill: Skill;
  correct: boolean | null;
  answer: string;
  at: string;
  assisted?: boolean;
  grade?: Grade;
  // A correct answer with an accent or ¿ ? mistake: it still joins the mistakes (ADR 0011).
  noted?: boolean;
}

export type ReviewState = {
  level: number;
  nextAt: string;
};

export type VocabularyReview = ReviewState & { reviewedAt?: string };

// A learner's progress as the server stores it (api/progress.ts).
export interface ProgressSnapshot {
  name: string;
  goal: number;
  examDate: string;
  xp: number;
  completed: Record<string, { score: number; total: number; at: string }>;
  // The previous attempt at each question, with its mistake and review state.
  questions: Record<
    string,
    {
      skill: Skill;
      at: string;
      correct: boolean | null;
      answer: string;
      assisted?: boolean;
      grade?: Grade;
      inMistakes: boolean;
      review?: ReviewState;
    }
  >;
  vocabularyReviews: Record<string, VocabularyReview>;
  checks: string[];
  mockResults: {
    id: string;
    at: string;
    // The sections the rehearsal took, in exam order.
    sections: number[];
    // Present when that section was taken and scored. Zero is a score. Absent when the
    // section was not taken, or when writing or speaking finished without a score.
    reading?: number;
    listening?: number;
    writing?: number;
    speaking?: number;
    // Set when this result records the outcome of every section it took, including a
    // productive section with no score. Absent on results saved before that: a missing
    // writing or speaking score there was never stored, so it is not zero and not ungraded.
    recorded?: true;
    // Set when the result stored the learner's responses, which GET /api/progress?result=<id>
    // returns. Absent on results saved before responses were recorded.
    responses?: true;
  }[];
  drafts: Record<string, string>;
  // The last 20 attempts, newest first.
  recent: Attempt[];
  // Distinct local days with an attempt, newest first, at most 400.
  days: string[];
  mockRun: MockRun | null;
  // When the learner last saw each mock exam task variant, by variant id.
  seenVariants: Record<string, string>;
}

// One version of an official exam task: a whole coherent task with all its items.
export type MockVariant = {
  id: string;
  // What the variant is about and the characters in it. One exam repeats neither.
  theme: string;
  names: string[];
  questions: Question[];
};

// The pool of variants for one official task. Every variant of a task has the same number of
// items, so a section keeps the official structure whichever variants an exam takes.
export type MockTask = { id: string; variants: MockVariant[] };

export type MockSection = { title: string; spanish: string; minutes: number; tasks: MockTask[] };

// The variant an exam uses for each task: task id to variant id.
export type ExamVariants = Record<string, string>;

export type MockStage = "intro" | "run" | "review" | "prep" | "done";

// The mock exam in progress. `deadline` is in epoch milliseconds, 0 when no timer runs.
export interface MockRun {
  section: number;
  index: number;
  stage: MockStage;
  answers: Record<string, string>;
  deadline: number;
  started: string;
  drafts: Record<string, string>;
  // The writing and speaking scores as typed into the score calculator.
  scores: { writing?: string; speaking?: string };
  // The topic picked for speaking Tasks 2 and 3.
  topic?: MockTopic;
  // Lucía's score for each finished talk, by question id.
  talks: Record<string, LiveScore>;
  // The AI tutor's DELE band (0–3) for each writing task, by question id.
  marks: Record<string, number>;
  // The plays of each listening recording, by the id of the first question that has it.
  plays: Record<string, number>;
  // The seed the exam builder took and the variants it chose, so a run resumes and is reviewed
  // with the same tasks.
  seed: number;
  variants: ExamVariants;
  // The sections the run takes, in exam order: the whole exam or one section alone.
  sections: number[];
  // The rehearsal result this run saved, so a writing or speaking score that arrives on
  // the results page updates that same result.
  resultId?: string;
}

// A change to the mock run: top-level fields replace; answers, drafts, scores, talks, marks and
// plays merge per key.
export type MockRunPatch = Partial<MockRun>;

type ResponseTask = { questionId: string; variantId: string };

// One response of a rehearsal. A reading or listening answer is "" when unanswered.
type Answer = { answer: string; correct: boolean };

export type MockResponse =
  | (ResponseTask & Answer & { section: 0 })
  | (ResponseTask & Answer & { section: 1 })
  | (ResponseTask & { section: 2; status: "submitted" | "empty"; text: string; band?: number })
  | (ResponseTask & { section: 3; status: "scored"; transcript: string; score: LiveScore })
  // A talk that was skipped, dropped or never scored: the run keeps no transcript of it.
  | (ResponseTask & { section: 3; status: "none" });

// The learner's responses in a rehearsal, in exam order, from the sections it took.
export type MockResponses = { started: string; items: MockResponse[] };

// A rehearsal result before the server stores it under an id, with the responses it stores.
export type NewMockResult = Omit<ProgressSnapshot["mockResults"][number], "id" | "responses"> & {
  responses?: MockResponses;
};
