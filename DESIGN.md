# Design rules

Rules for building UI with this design system. They apply to people and agents alike.
The theme and components come from the shadcn registry `PatrykPodworski/design-system`,
built on [shadcn/ui](https://ui.shadcn.com) (style `base-maia`, base color `mist`,
[Base UI](https://base-ui.com) primitives, [lucide](https://lucide.dev) icons).

## Sources of truth

1. **Tokens** live in the theme: CSS variables in the project's main CSS file
   (`--background`, `--primary`, `--radius` and the rest), installed by the `theme` item.
   Use them through Tailwind utilities (`bg-background`, `text-muted-foreground`,
   `border-border`, `rounded-lg`). Never hard-code a color, font or radius.
2. **Components** live in `components/ui/`, installed from the registry. Build screens
   from them. Before writing a new component, check `shadcn list
PatrykPodworski/design-system` for one that already exists.
3. **This file** settles the choices the tokens and components leave open.

Treat files installed from the registry as vendored: do not edit them in the app. A
change that every app should get goes to the design-system repository first, then the
apps update to the new release tag. An update overwrites local edits.

## Install and update

- Install every item with the release tag the project pins:
  `pnpm dlx shadcn@latest add --yes PatrykPodworski/design-system/<item>#<tag>`.
  A tag pins the item and all its dependencies.
- Update by running the same command with the new tag and `--overwrite`, then review the
  diff.
- Pass `--yes` in scripts and agents. Without a terminal the CLI answers "no" to its
  prompts, installs nothing and still exits 0.

## Color

- Use semantic tokens only: `background`/`foreground`, `card`, `popover`, `primary`,
  `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-1`…`5`,
  `sidebar-*`. Pair each surface with its `-foreground` token.
- `primary` (yellow) marks the one main action of a view and the current selection. Do
  not use it for large backgrounds or for text (see "Accessibility" for the contrast).
- `destructive` is for actions that delete or cannot be undone, and for errors.
- Text on `muted` or `background` that is secondary uses `text-muted-foreground`.
- Every screen works in light and dark mode. Dark mode is the `.dark` class on a parent
  element; the tokens switch, the markup does not change. Never write `dark:` overrides
  for colors that a token already covers.
- A color the tokens lack (a brand accent, a category color) is a new token: add it to
  the theme in the design-system repository, not to one app.

## Typography

- One font family: Inter (`font-sans`, installed by the theme). Headings use
  `font-heading`, which is Inter as well.
- Use Tailwind's type scale (`text-xs` … `text-4xl`). Body text is `text-sm` or
  `text-base`.
- Weights: 400 for body, 500 for labels and controls, 600 for headings.
- Sentence case for headings, buttons and labels.

## Spacing and layout

- Use Tailwind's spacing scale (4px steps). Prefer `gap-*` on a flex or grid parent over
  margins on children.
- Common steps: 2 (8px) inside controls, 4 (16px) between related items, 6 (24px) between
  groups, 8–12 (32–48px) between page sections.
- Mobile first. Layouts work from 360px wide with no horizontal scroll.
- Radius comes from `rounded-*`, which follows `--radius`. Buttons and badges are pill
  shaped (`rounded-4xl`, set by the component); do not change it per use.
- Shadows stay subtle and come from the components (popover, dialog, sheet). Cards rely
  on the border, not on a shadow.

## Components

Pick the component by job:

| Job                                     | Item                                                    |
| --------------------------------------- | ------------------------------------------------------- |
| Main action, secondary action           | `button` (`default`, `secondary`, `outline`, `ghost`)   |
| Delete or irreversible action           | `button` with `variant="destructive"`                   |
| Icon-only action                        | `button` with `size="icon"` and an `aria-label`         |
| Group of actions                        | `button-group`, or a flex row with `gap-2`              |
| Text field, multi-line text             | `input`, `textarea`, inside `field`                     |
| Choice: one of few, one of many, many   | `radio-group`, `select` or `native-select`, `checkbox`  |
| On/off setting                          | `switch`                                                |
| Number in a range                       | `slider`                                                |
| Code or passcode                        | `input-otp`, or `input type="password"`                 |
| Modal task                              | `dialog`                                                |
| Confirm a destructive or leaving action | `alert-dialog`                                          |
| Side panel, mobile navigation           | `sheet` or `drawer`                                     |
| App navigation                          | `sidebar`, `breadcrumb`, `tabs`                         |
| Grouped content                         | `card`; `item` for rows in a list                       |
| Status label, count                     | `badge`                                                 |
| Message inside the page                 | `alert`                                                 |
| Short confirmation after an action      | `toast`                                                 |
| Progress of a task                      | `progress`                                              |
| Loading                                 | `skeleton` for content, `spinner` for an action         |
| Nothing to show yet                     | `empty`                                                 |
| Disclosure                              | `accordion`, `collapsible`                              |
| Hint on hover or focus                  | `tooltip` (never the only place for needed information) |

- One primary (`default` variant) button per view or dialog. Other actions use
  `secondary`, `outline` or `ghost`.
- Put the primary action last in a row of actions (right on wide screens). On narrow
  screens a row of actions may stack full width.
- Pass `className` to a component for placement (margin, width, grid or flex position).
  Do not restyle its color, size or radius through `className`; use a variant. A missing
  variant goes to the design-system repository.
- Icons come from `lucide-react`, sized by the component (16px by default).

## Accessibility

- Text contrast at least 4.5:1, large text and UI parts at least 3:1. Measured on the
  current theme (WCAG 2 ratio, light / dark):
  - Pass: `foreground` on `background`, `card`, `popover` (≥ 16.7); `primary-foreground`
    on `primary` (5.5 / 4.5); `secondary-foreground` and `accent-foreground` on their
    surfaces (≥ 14); `muted-foreground` on `background` (4.6 / 8.1); `destructive` on
    `background` (4.8 / 6.8).
  - Fail: `muted-foreground` on `muted` in light mode (4.2): use it only for text of
    18px and up, or put muted text on `background`. `primary` as text on `background` in
    light mode (1.6): do not use yellow text, which includes the `link` button variant,
    in light mode. `sidebar-primary-foreground` on `sidebar-primary` (2.8 / 1.9): do not
    put text on `sidebar-primary`.
- Every control is reachable by keyboard and shows the focus ring (`ring` token). Do not
  remove outlines.
- Touch targets are at least 44×44px on mobile. Grow the hit area with padding or a
  larger `size` when a control sits on its own.
- Every form control has a visible label (`FieldLabel` or `Label`). Placeholders are
  examples, not labels.
- Icon-only buttons have an `aria-label`. Decorative icons are `aria-hidden`.
- Respect `prefers-reduced-motion`: no motion that carries meaning without a static
  alternative.
- Do not use color as the only signal. Pair it with text or an icon.
