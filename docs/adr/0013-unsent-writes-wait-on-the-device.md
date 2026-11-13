---
status: accepted
---

# 0013. A failed write waits on the device and never blocks the learner

The server database is still the source of truth, and progress still loads only from the server, so there is no offline mode. A write that fails no longer stops the learner. A network error, 408, 429 or 5xx keeps the write and the writes behind it in order on the device. The client sends them again by itself after a delay and when the browser is back online. The dialog offers Retry and Continue, and Continue lets the learner go on, for example to finish a mock exam. The next visit sends the kept writes before it shows progress. Any other 4xx is a refusal that the same request would get again, so the client drops that write, says that one change was not saved, and sends the writes behind it. This supersedes [0001](0001-no-offline-mode.md); the decision is recorded in [#806](https://github.com/PatrykPodworski/paso/issues/806), where a refused mock exam save made Retry loop.
