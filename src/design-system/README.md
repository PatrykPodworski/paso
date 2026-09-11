# Design system

Shared UI lives here, one component per file, styled with Tailwind utilities.
Components are extracted from `src/App.tsx` and `src/components/` one at a time,
under the parent issue
[#44](https://github.com/PatrykPodworski/paso/issues/44).

## Conventions

**No barrel files.** Each component is one file, imported directly by relative
path the way the rest of `src/` imports: `import { Button } from
"./design-system/Button"`.

**Two pull requests per component.** The first extracts it and rewrites its
styling to Tailwind using arbitrary values that match the old CSS exactly —
`pnpm test:visual` must pass with no baseline update, which is what proves the
refactor changed nothing. The second normalises those arbitrary values to the
Tailwind scale; baseline changes are expected there and are the point of the
review. Keeping them apart means every pixel that ever moves is a decision
somebody made on purpose.

**Deleting the old CSS is load-bearing, not cleanup.** Tailwind's utilities are
imported unlayered (see the comment at the top of `src/styles.css`), so a
utility class beats the bare element rules — that is what lets `text-*` win
against `button { color: inherit }`. It does **not** beat an existing class rule
of equal or higher specificity. Migrating an element means removing the class
rules that styled it in the same change, including descendant and state
selectors that target it. `tests/e2e/tailwind.spec.ts` guards the layering.

**Every component registers in the gallery.** `Gallery.tsx` is rendered at
`/#design-system` and screenshotted per section by
`tests/visual/design-system.spec.ts`. Register each variant and state, including
the ones no app view happens to show — a disabled button, an error state — since
those are exactly what the whole-page baselines miss.

## Extraction inventory

Candidates in the current codebase, by call-site count. Order is a suggestion,
not a queue; only the rows with an issue are scheduled.

| Component      | Classes in `styles.css`                       | Call sites | Issue |
| -------------- | --------------------------------------------- | ---------: | ----- |
| Button         | `.button` + `primary` `secondary` `small` `danger` | 29 | [#46](https://github.com/PatrykPodworski/paso/issues/46), [#47](https://github.com/PatrykPodworski/paso/issues/47) |
| Eyebrow        | `.eyebrow`                                    | 29 | — |
| Panel          | `.panel`, `.panel-heading`                    | 25 | — |
| TextLink       | `.text-link`                                  | 12 | — |
| FieldNote      | `.field-note`                                 | 11 | — |
| SectionHeading | `.section-heading`                            |  8 | — |
| ButtonRow      | `.button-row`                                 |  7 | — |
| IconButton     | `.icon-button`                                |  5 | — |
| Notice         | `.notice`                                     |  5 | — |
| PageHeading    | `.page-heading`                               |  5 | — |
| Badge          | `.outline-badge`                              |  4 | — |
| ProgressTrack  | `.progress-track`                             |  2 | — |
| Icon           | already `src/components/Icon.tsx`             |  — | move only |
| Dialog         | already `src/components/Dialog.tsx`           |  — | move only |
