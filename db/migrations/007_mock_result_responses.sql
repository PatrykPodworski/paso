-- A rehearsal result keeps the learner's responses from the sections it took (#602).
-- Results saved before keep null: their responses were never stored, and nothing fills them.
ALTER TABLE mock_results
  ADD COLUMN responses jsonb;
