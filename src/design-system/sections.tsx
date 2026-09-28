import type { ReactNode } from "react";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { SectionHeading } from "./SectionHeading";

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
    id: "section-heading",
    name: "SectionHeading",
    render: () => (
      <div>
        {(["default", "path", "word", "collection"] as const).map((variant) => (
          <SectionHeading key={variant} variant={variant}>
            <div>
              {variant === "collection" ? <h3>Collection heading</h3> : <h2>{variant} heading</h2>}
              <p>A short line of supporting text.</p>
            </div>
            <button className="text-link">Text link</button>
          </SectionHeading>
        ))}
      </div>
    ),
  },
];
