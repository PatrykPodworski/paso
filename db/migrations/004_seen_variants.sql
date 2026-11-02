-- When a learner saw each mock exam task variant (#463). Rows are only added: a section that
-- starts adds one row per variant it shows, and the exam builder reads the latest per variant.
CREATE TABLE seen_variants (
  learner_id uuid NOT NULL REFERENCES learners (id) ON DELETE CASCADE,
  variant_id text NOT NULL,
  at timestamptz NOT NULL,
  PRIMARY KEY (learner_id, variant_id, at)
);
