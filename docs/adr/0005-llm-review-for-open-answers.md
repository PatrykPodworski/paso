---
status: accepted
---

# 0005. Answers code cannot check go to the LLM review

An answer that code can check deterministically (a choice, a tile order, a typed answer against an exhaustive list) is checked in code. An open answer that code cannot check, such as a free written question for a situation, goes to the existing LLM writing review with its points as the checklist. It does not get a self-assessment, a regular-expression match or a new grader. The review is a paid LLM feature, so the passcode gates it (ADR 0002). Without the passcode the learner can save the answer without feedback and move on: it is stored with no grade, counts in no score and does not enter the mistakes. Decided in [#613](https://github.com/PatrykPodworski/paso/issues/613).
