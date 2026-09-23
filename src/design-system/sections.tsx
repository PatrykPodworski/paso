import type { ReactNode } from "react";
import { Button } from "./Button";
import { CONTEXT_SIZE } from "./button-context-sizes";

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
            {(["default", "small"] as const).map((size) =>
              [false, true].map((disabled) => (
                <Button key={`${size}${disabled}`} variant={variant} size={size} disabled={disabled}>
                  {variant} {size}
                  {disabled ? " disabled" : ""}
                </Button>
              )),
            )}
          </div>
        ))}
        {/* The escape hatches from button-context-sizes.ts. This block goes when they do. */}
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(CONTEXT_SIZE).map(([name, classes]) => (
            <Button key={name} variant="primary" sizeClasses={classes}>
              {name}
            </Button>
          ))}
        </div>
      </div>
    ),
  },
];
