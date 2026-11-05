-- A rehearsal may take one section alone (#578). A result records the sections it covers and
-- has a reading or listening score only when it covered that section. Results saved before
-- covered the whole exam.
ALTER TABLE mock_results
  ADD COLUMN sections smallint[] NOT NULL DEFAULT '{0,1,2,3}',
  ALTER COLUMN reading DROP NOT NULL,
  ALTER COLUMN listening DROP NOT NULL;
