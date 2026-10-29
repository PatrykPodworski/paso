CREATE TABLE learners (
  id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  goal int NOT NULL DEFAULT 10,
  exam_date text NOT NULL DEFAULT '',
  xp int NOT NULL DEFAULT 0,
  imported_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE attempts (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  id text NOT NULL,
  question_id text NOT NULL,
  skill text NOT NULL,
  correct boolean,
  answer text NOT NULL,
  at timestamptz NOT NULL,
  local_day date NOT NULL,
  assisted boolean NOT NULL DEFAULT false,
  grade text,
  PRIMARY KEY (learner_id, id)
);

CREATE INDEX attempts_recent ON attempts (learner_id, at DESC);

CREATE INDEX attempts_days ON attempts (learner_id, local_day DESC);

CREATE TABLE question_states (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  question_id text NOT NULL,
  skill text NOT NULL,
  last_attempt_id text NOT NULL,
  last_at timestamptz NOT NULL,
  correct boolean,
  answer text NOT NULL,
  assisted boolean NOT NULL DEFAULT false,
  grade text,
  in_mistakes boolean NOT NULL DEFAULT false,
  review_level int,
  review_next_at timestamptz,
  PRIMARY KEY (learner_id, question_id)
);

CREATE TABLE lesson_completions (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  score int NOT NULL,
  total int NOT NULL,
  at timestamptz NOT NULL,
  PRIMARY KEY (learner_id, lesson_id)
);

CREATE TABLE vocabulary_reviews (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  word text NOT NULL,
  level int NOT NULL,
  reviewed_at timestamptz,
  next_at timestamptz NOT NULL,
  PRIMARY KEY (learner_id, word)
);

CREATE TABLE guide_checks (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  check_id text NOT NULL,
  PRIMARY KEY (learner_id, check_id)
);

CREATE TABLE mock_results (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  id text NOT NULL,
  at timestamptz NOT NULL,
  reading int NOT NULL,
  listening int NOT NULL,
  writing real,
  speaking real,
  PRIMARY KEY (learner_id, id)
);

CREATE TABLE drafts (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  question_id text NOT NULL,
  text text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (learner_id, question_id)
);
