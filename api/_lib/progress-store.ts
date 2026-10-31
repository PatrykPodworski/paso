import { REVIEW_WINDOWS } from "../../src/data/progress.ts";
import type {
  Attempt,
  LiveGrade,
  MockRun,
  MockRunPatch,
  ProgressSnapshot,
  Skill,
  VocabularyReview,
} from "../../src/data/types.ts";
import type { Db, Query } from "./db.js";
import type { Completion, MockResult } from "./progress-fields.js";

export type Settings = { name: string; goal: number; examDate: string };

const RECENT = 20;

const FRESH_MOCK_RUN: MockRun = {
  section: 0,
  index: 0,
  stage: "intro",
  answers: {},
  deadline: 0,
  started: "",
  drafts: {},
  scores: {},
  talks: {},
};

const DAYS = 400;
const QUESTION_XP = 5;
const LESSON_XP = 20;
const TOP_LEVEL = REVIEW_WINDOWS.length - 1;

const q = (text: string, ...params: unknown[]): Query => ({ text, params });

// Timestamps leave the database as ISO strings, so both drivers return the same text.
const iso = (column: string) =>
  `to_char(${column} AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;

const reads = (learner: string) => [
  q("SELECT name, goal, exam_date, xp FROM learners WHERE id = $1", learner),
  q(
    `SELECT lesson_id, score, total, ${iso("at")} AS at FROM lesson_completions WHERE learner_id = $1`,
    learner,
  ),
  q(
    `SELECT question_id, skill, ${iso("last_at")} AS at, correct, answer, assisted, grade,
       in_mistakes, review_level, ${iso("review_next_at")} AS review_next_at
     FROM question_states WHERE learner_id = $1`,
    learner,
  ),
  q(
    `SELECT word, level, ${iso("next_at")} AS next_at, ${iso("reviewed_at")} AS reviewed_at
     FROM vocabulary_reviews WHERE learner_id = $1`,
    learner,
  ),
  q("SELECT check_id FROM guide_checks WHERE learner_id = $1 ORDER BY check_id", learner),
  q(
    `SELECT id, ${iso("at")} AS at, reading, listening, writing, speaking
     FROM mock_results WHERE learner_id = $1 ORDER BY mock_results.at, id`,
    learner,
  ),
  q("SELECT question_id, text FROM drafts WHERE learner_id = $1", learner),
  q(
    `SELECT id, question_id, skill, correct, answer, ${iso("at")} AS at, assisted, grade
     FROM attempts WHERE learner_id = $1 ORDER BY attempts.at DESC, id DESC LIMIT ${RECENT}`,
    learner,
  ),
  q(
    `SELECT to_char(day, 'YYYY-MM-DD') AS day FROM (
       SELECT DISTINCT local_day AS day FROM attempts WHERE learner_id = $1
       ORDER BY day DESC LIMIT ${DAYS}
     ) days ORDER BY days.day DESC`,
    learner,
  ),
  q("SELECT run FROM mock_runs WHERE learner_id = $1", learner),
];

type LearnerRow = { name: string; goal: number; exam_date: string; xp: number };
type CompletionRow = { lesson_id: string; score: number; total: number; at: string };
type ReviewRow = { word: string; level: number; next_at: string; reviewed_at: string | null };
type MockRow = MockResult & { writing: number | null; speaking: number | null };
type DraftRow = { question_id: string; text: string };
type DayRow = { day: string };

type AttemptRow = {
  id: string;
  question_id: string;
  skill: Skill;
  correct: boolean | null;
  answer: string;
  at: string;
  assisted: boolean;
  grade: LiveGrade | null;
};

type QuestionRow = Omit<AttemptRow, "id"> & {
  in_mistakes: boolean;
  review_level: number | null;
  review_next_at: string | null;
};

const NEW_LEARNER: LearnerRow = { name: "", goal: 10, exam_date: "", xp: 0 };

const answerOf = (r: Omit<AttemptRow, "id">) => ({
  skill: r.skill,
  correct: r.correct,
  answer: r.answer,
  at: r.at,
  ...(r.assisted ? { assisted: true } : {}),
  ...(r.grade ? { grade: r.grade } : {}),
});

const questionOf = (r: QuestionRow) => ({
  ...answerOf(r),
  inMistakes: r.in_mistakes,
  ...(r.review_level === null
    ? {}
    : { review: { level: r.review_level, nextAt: r.review_next_at as string } }),
});

const vocabularyReviewOf = (r: ReviewRow) => ({
  level: r.level,
  nextAt: r.next_at,
  ...(r.reviewed_at ? { reviewedAt: r.reviewed_at } : {}),
});

const mockResultOf = ({ writing, speaking, ...m }: MockRow) => ({
  ...m,
  ...(writing === null ? {} : { writing }),
  ...(speaking === null ? {} : { speaking }),
});

const snapshotOf = (results: unknown[][]): ProgressSnapshot => {
  const [learners, completions, questions, reviews, checks, mocks, drafts, recent, days, runs] =
    results as [
      LearnerRow[],
      CompletionRow[],
      QuestionRow[],
      ReviewRow[],
      { check_id: string }[],
      MockRow[],
      DraftRow[],
      AttemptRow[],
      DayRow[],
      { run: MockRun }[],
    ];

  const learner = learners[0] ?? NEW_LEARNER;

  return {
    name: learner.name,
    goal: learner.goal,
    examDate: learner.exam_date,
    xp: learner.xp,
    completed: Object.fromEntries(
      completions.map((c) => [c.lesson_id, { score: c.score, total: c.total, at: c.at }]),
    ),
    questions: Object.fromEntries(questions.map((r) => [r.question_id, questionOf(r)])),
    vocabularyReviews: Object.fromEntries(reviews.map((r) => [r.word, vocabularyReviewOf(r)])),
    checks: checks.map((c) => c.check_id),
    mockResults: mocks.map(mockResultOf),
    drafts: Object.fromEntries(drafts.map((d) => [d.question_id, d.text])),
    recent: recent.map((r) => ({ id: r.id, questionId: r.question_id, ...answerOf(r) })),
    days: days.map((d) => d.day),
    // A run saved before a field existed takes that field's default.
    mockRun: runs[0] ? { ...FRESH_MOCK_RUN, ...runs[0].run } : null,
  };
};

// Writes and reads in one transaction, so the snapshot shows the write.
const write = async (db: Db, learner: string, writes: Query[]) => {
  const results = await db.transaction([...writes, ...reads(learner)]);

  return { results, snapshot: snapshotOf(results.slice(writes.length)) };
};

const ensureLearner = (learner: string) =>
  q("INSERT INTO learners (id) VALUES ($1) ON CONFLICT (id) DO NOTHING", learner);

export const readProgress = async (db: Db, learner: string) =>
  snapshotOf(await db.transaction(reads(learner)));

// The attempt rules: a wrong answer goes to the mistakes, due at once. An unassisted
// correct answer to a tracked question leaves the mistakes and moves one review window
// up, or leaves the reviews for good when it is a graded live talk. +5 XP when the
// question is new. An attempt id already stored changes nothing.
export const saveAttempt = async (db: Db, learner: string, a: Attempt, timeZone: string) => {
  const recovers =
    "(excluded.correct AND NOT excluded.assisted AND (s.in_mistakes OR s.review_level IS NOT NULL))";

  const next = `LEAST(GREATEST(COALESCE(s.review_level, 0), 0) + 1, ${TOP_LEVEL})`;
  const windows = `ARRAY[${REVIEW_WINDOWS.join(", ")}]`;

  return (
    await write(db, learner, [
      ensureLearner(learner),
      q(
        `WITH inserted AS (
           INSERT INTO attempts
             (learner_id, id, question_id, skill, correct, answer, at, local_day, assisted, grade)
           VALUES ($1, $2, $3, $4, $5, $6, $7, ($7::timestamptz AT TIME ZONE $8::text)::date, $9, $10)
           ON CONFLICT (learner_id, id) DO NOTHING
           RETURNING *
         ), state AS (
           INSERT INTO question_states AS s (learner_id, question_id, skill, last_attempt_id,
             last_at, correct, answer, assisted, grade, in_mistakes, review_level, review_next_at)
           SELECT learner_id, question_id, skill, id, at, correct, answer, assisted, grade,
             correct IS FALSE,
             CASE WHEN correct IS FALSE THEN 0 END,
             CASE WHEN correct IS FALSE THEN at END
           FROM inserted
           ON CONFLICT (learner_id, question_id) DO UPDATE SET
             skill = excluded.skill,
             last_attempt_id = excluded.last_attempt_id,
             last_at = excluded.last_at,
             correct = excluded.correct,
             answer = excluded.answer,
             assisted = excluded.assisted,
             grade = excluded.grade,
             in_mistakes = CASE
               WHEN excluded.correct IS FALSE THEN true
               WHEN ${recovers} THEN false
               ELSE s.in_mistakes END,
             review_level = CASE
               WHEN excluded.correct IS FALSE THEN 0
               WHEN ${recovers} AND excluded.grade IS NOT NULL THEN NULL
               WHEN ${recovers} THEN ${next}
               ELSE s.review_level END,
             review_next_at = CASE
               WHEN excluded.correct IS FALSE THEN excluded.last_at
               WHEN ${recovers} AND excluded.grade IS NOT NULL THEN NULL
               WHEN ${recovers} THEN
                 excluded.last_at + make_interval(hours => 24 * (${windows})[${next} + 1])
               ELSE s.review_next_at END
           RETURNING xmax = 0 AS created
         )
         UPDATE learners SET xp = xp + ${QUESTION_XP}
         WHERE id = $1 AND EXISTS (SELECT 1 FROM state WHERE created)`,
        learner,
        a.id,
        a.questionId,
        a.skill,
        a.correct,
        a.answer,
        a.at,
        timeZone,
        a.assisted ?? false,
        a.grade ?? null,
      ),
    ])
  ).snapshot;
};

// The latest score wins; +20 XP only for the first completion.
export const completeLesson = async (db: Db, learner: string, lessonId: string, c: Completion) =>
  (
    await write(db, learner, [
      ensureLearner(learner),
      q(
        `WITH done AS (
           INSERT INTO lesson_completions (learner_id, lesson_id, score, total, at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (learner_id, lesson_id) DO UPDATE
             SET score = excluded.score, total = excluded.total, at = excluded.at
           RETURNING xmax = 0 AS created
         )
         UPDATE learners SET xp = xp + ${LESSON_XP}
         WHERE id = $1 AND EXISTS (SELECT 1 FROM done WHERE created)`,
        learner,
        lessonId,
        c.score,
        c.total,
        c.at,
      ),
    ])
  ).snapshot;

export const saveDraft = async (db: Db, learner: string, questionId: string, text: string) =>
  (
    await write(db, learner, [
      ensureLearner(learner),
      text
        ? q(
            `INSERT INTO drafts (learner_id, question_id, text) VALUES ($1, $2, $3)
             ON CONFLICT (learner_id, question_id) DO UPDATE
               SET text = excluded.text, updated_at = now()`,
            learner,
            questionId,
            text,
          )
        : q("DELETE FROM drafts WHERE learner_id = $1 AND question_id = $2", learner, questionId),
    ])
  ).snapshot;

export const saveVocabulary = async (
  db: Db,
  learner: string,
  reviews: Record<string, VocabularyReview>,
) =>
  (
    await write(db, learner, [
      ensureLearner(learner),
      q(
        `INSERT INTO vocabulary_reviews (learner_id, word, level, reviewed_at, next_at)
         SELECT $1, key, (value->>'level')::int, (value->>'reviewedAt')::timestamptz,
           (value->>'nextAt')::timestamptz
         FROM jsonb_each($2::jsonb)
         ON CONFLICT (learner_id, word) DO UPDATE SET
           level = excluded.level, reviewed_at = excluded.reviewed_at, next_at = excluded.next_at`,
        learner,
        JSON.stringify(reviews),
      ),
    ])
  ).snapshot;

export const setCheck = async (db: Db, learner: string, checkId: string, done: boolean) =>
  (
    await write(db, learner, [
      ensureLearner(learner),
      done
        ? q(
            "INSERT INTO guide_checks (learner_id, check_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            learner,
            checkId,
          )
        : q("DELETE FROM guide_checks WHERE learner_id = $1 AND check_id = $2", learner, checkId),
    ])
  ).snapshot;

export const saveSettings = async (db: Db, learner: string, s: Settings) =>
  (
    await write(db, learner, [
      ensureLearner(learner),
      q(
        "UPDATE learners SET name = $2, goal = $3, exam_date = $4 WHERE id = $1",
        learner,
        s.name,
        s.goal,
        s.examDate,
      ),
    ])
  ).snapshot;

export const saveMockResult = async (db: Db, learner: string, m: MockResult) =>
  (
    await write(db, learner, [
      ensureLearner(learner),
      q(
        `INSERT INTO mock_results (learner_id, id, at, reading, listening, writing, speaking)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (learner_id, id) DO NOTHING`,
        learner,
        m.id,
        m.at,
        m.reading,
        m.listening,
        m.writing ?? null,
        m.speaking ?? null,
      ),
    ])
  ).snapshot;

// Top-level fields replace; answers, drafts, scores and talks merge per key, so a change from one
// tab keeps what another tab saved. `replace` starts a new run from the defaults.
export const saveMockRun = async (
  db: Db,
  learner: string,
  patch: MockRunPatch,
  replace: boolean,
) => {
  const merged = (map: string) =>
    `'${map}', COALESCE(r.run->'${map}', '{}') || COALESCE($3::jsonb->'${map}', '{}')`;

  return (
    await write(db, learner, [
      ensureLearner(learner),
      q(
        // A run that does not exist yet starts from the defaults.
        `INSERT INTO mock_runs AS r (learner_id, run) VALUES ($1, $2::jsonb || $3::jsonb)
         ON CONFLICT (learner_id) DO UPDATE SET
           run = CASE WHEN $4::boolean THEN excluded.run ELSE
             r.run || $3::jsonb ||
             jsonb_build_object(${merged("answers")}, ${merged("drafts")}, ${merged("scores")}, ${merged("talks")})
           END,
           updated_at = now()`,
        learner,
        JSON.stringify(FRESH_MOCK_RUN),
        JSON.stringify(patch),
        replace,
      ),
    ])
  ).snapshot;
};

// Deleting the learner cascades to every table.
export const resetProgress = async (db: Db, learner: string) =>
  (await write(db, learner, [q("DELETE FROM learners WHERE id = $1", learner)])).snapshot;
