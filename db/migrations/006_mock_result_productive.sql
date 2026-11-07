-- A finished rehearsal records writing and speaking, including a section that ended without
-- a score. Results already stored keep this null: their missing scores stay unknown.
-- Nothing here fills or changes a score.
ALTER TABLE mock_results
  ADD COLUMN productive_recorded boolean;
