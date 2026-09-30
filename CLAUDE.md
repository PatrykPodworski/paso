# paso

Tracker: GitHub Issues (`gh`, repo PatrykPodworski/paso). Agent work follows the `running-issue-batches` skill — parent issue + sub-issues, `blocked-by` relations, status labels `in-progress` / `in-review`.

Worktree setup: symlink the main checkout's `.cache` (Playwright browsers) into the worktree, run `pnpm install`, and give each worktree its own `PW_PORT` (the Playwright dev server port, default 4174).

Checks before a commit: `pnpm fmt:check`, `pnpm lint`, `pnpm build`, `pnpm test`. Mutation testing runs in CI only. Visual baselines live in Argos, not in the repo.
