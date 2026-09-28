import type { ReactNode } from "react";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { Icon } from "../components/Icon";
import { TextLink } from "./TextLink";
import { FieldNote } from "./FieldNote";

// The gallery registry. Every component extracted into src/design-system/ adds a section
// here so tests/visual/design-system.spec.ts screenshots its variants in isolation,
// including the states no app view happens to render. Rendered by Gallery.tsx at
// /#design-system. Separate from that component so Fast Refresh keeps working.
export const sections: { id: string; name: string; render: () => ReactNode }[] = [
  {
    id: "button",
    name: "Button",
    render: () => (
      <div className="flex flex-col gap-4">
        {(["primary", "secondary", "danger"] as const).map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            {(["default", "compact", "small"] as const).map((size) =>
              [false, true].map((disabled) => (
                <Button
                  key={`${size}${disabled}`}
                  variant={variant}
                  size={size}
                  disabled={disabled}
                >
                  {variant} {size}
                  {disabled ? " disabled" : ""}
                </Button>
              )),
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "eyebrow",
    name: "Eyebrow",
    render: () => (
      <div className="flex flex-col gap-3">
        {(
          [
            "default",
            "page",
            "heading",
            "banner",
            "checklist",
            "small",
            "phrase",
            "unit",
            "pathUnit",
          ] as const
        ).map((variant) => (
          <Eyebrow key={variant} variant={variant}>
            {variant.toUpperCase()} <i>·</i> EYEBROW
          </Eyebrow>
        ))}
      </div>
    ),
  },
  {
    id: "text-link",
    name: "TextLink",
    render: () => (
      <div className="flex flex-wrap items-center gap-6">
        <TextLink>Button</TextLink>
        <TextLink>
          With icon
          <Icon name="arrow" size={16} />
        </TextLink>
        <TextLink disabled>Disabled</TextLink>
        <TextLink href="#design-system">
          Anchor
          <Icon name="external" size={15} />
        </TextLink>
      </div>
    ),
  },
  {
    id: "field-note",
    name: "FieldNote",
    render: () => (
      <div className="flex flex-col gap-4">
        <FieldNote>Progress and writing drafts stay in this browser.</FieldNote>
        <FieldNote>
          A note with a link inside. <a href="#design-system">Official structure ↗</a>
        </FieldNote>
      </div>
    ),
  },
];
