-- The mock exam is now built from task variants (#458). A run saved before that used the
-- single exam, which is variant 1 of each task.
UPDATE mock_runs
SET run = run || '{
  "seed": 0,
  "variants": {
    "r1": "r1-v1", "r2": "r2-v1", "r3": "r3-v1", "r4": "r4-v1",
    "l1": "l1-v1", "l2": "l2-v1", "l3": "l3-v1", "l4": "l4-v1",
    "w1": "w1-v1", "w2": "w2-v1",
    "s1": "s1-v1", "s2": "s2-v1"
  }
}'::jsonb
WHERE NOT run ? 'variants';
