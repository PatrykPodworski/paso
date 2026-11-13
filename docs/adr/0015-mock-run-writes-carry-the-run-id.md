---
status: accepted
---

# 0015. A mock run write applies only to the run it was made for

Each mock exam run gets an id when it starts, and the run keeps it. Every mock run write names the run it was made for: a change names the run it changes, and a new run names the run it replaces. The server applies the write only when that run is the learner's current run, and answers 409 `stale_run` otherwise. The client drops such a write without a dialog, because the current run lost nothing. This makes writes that wait on the device ([0013](0013-unsent-writes-wait-on-the-device.md)) safe to send later: a write from an earlier run, or from another tab, cannot change a newer run. A write without a run id is for the run without one: a run started before run ids existed, or no run yet, so runs already in progress go on unchanged. Rehearsal results are not checked against the run, because each result already has its own id and a late result of an earlier run belongs in the history. Recorded in [#806](https://github.com/PatrykPodworski/paso/issues/806).
