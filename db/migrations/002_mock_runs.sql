CREATE TABLE mock_runs (
  learner_id uuid PRIMARY KEY REFERENCES learners (id) ON DELETE CASCADE,
  run jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
