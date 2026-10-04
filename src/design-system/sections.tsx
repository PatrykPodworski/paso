import type { ReactNode } from "react";
import { Icon, iconNames } from "./Icon";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { SectionHeading } from "./SectionHeading";
import { TextLink } from "./TextLink";
import { FieldNote } from "./FieldNote";
import { Panel, PanelHeading } from "./Panel";
import { PageHeading } from "./PageHeading";
import { Notice } from "./Notice";
import { ProgressTrack } from "./ProgressTrack";
import { ButtonRow } from "./ButtonRow";
import { IconButton } from "./IconButton";

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
            {variant.toUpperCase()}{" "}
            <i className={variant === "unit" || variant === "pathUnit" ? "not-italic px-1" : ""}>
              ·
            </i>{" "}
            EYEBROW
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
          A note with a link inside.{" "}
          <a className="underline" href="#design-system">
            Official structure ↗
          </a>
        </FieldNote>
      </div>
    ),
  },
  {
    id: "badge",
    name: "Badge",
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Badge>
          <Icon name="check" size={16} /> With icon
        </Badge>
        <Badge>3/12 checked</Badge>
      </div>
    ),
  },
  {
    id: "section-heading",
    name: "SectionHeading",
    render: () => (
      <div>
        {(["default", "path", "word", "collection"] as const).map((variant) => (
          <SectionHeading
            key={variant}
            variant={variant}
            title={variant === "collection" ? "Collection heading" : `${variant} heading`}
            text="A short line of supporting text."
          >
            <TextLink>Text link</TextLink>
          </SectionHeading>
        ))}
      </div>
    ),
  },
  {
    id: "panel",
    name: "Panel",
    render: () => (
      <div className="flex flex-col gap-4">
        <Panel className="p-5">Plain panel</Panel>
        <Panel as="section" className="p-5">
          <PanelHeading title="Heading with icon" icon="layers" />
        </Panel>
        <Panel as="button" className="p-5 text-left">
          Button panel
        </Panel>
      </div>
    ),
  },
  {
    id: "notice",
    name: "Notice",
    render: () => (
      <div>
        <Notice as="p" role="status">
          Browser storage is unavailable. Progress is kept for this visit.
        </Notice>
        <Notice icon="info">
          <p className="leading-relaxed">
            A notice with an icon and a{" "}
            <a className="underline" href="#design-system">
              link inside
            </a>
            .
          </p>
        </Notice>
        <Notice positive>
          <p className="leading-relaxed">
            Reading + writing: <strong>36.00/50</strong>
          </p>
        </Notice>
      </div>
    ),
  },
  {
    id: "progress-track",
    name: "ProgressTrack",
    render: () => (
      <div className="flex w-60 flex-col gap-3">
        {[0, 35, 100].map((percent) => (
          <ProgressTrack key={percent} value={percent} />
        ))}
      </div>
    ),
  },
  {
    id: "button-row",
    name: "ButtonRow",
    render: () => (
      <div className="flex flex-col gap-4">
        {["", "justify-center", "justify-between"].map((justify) => (
          <ButtonRow key={justify} className={justify}>
            <Button variant="secondary">Keep working</Button>
            <Button variant="primary">{justify || "default"}</Button>
          </ButtonRow>
        ))}
      </div>
    ),
  },
  {
    id: "page-heading",
    name: "PageHeading",
    render: () => (
      <div className="flex flex-col">
        <PageHeading
          eyebrow={
            <Eyebrow variant="page" className="mb-2">
              PAGE <i>·</i> EYEBROW
            </Eyebrow>
          }
          title="Page heading with an aside."
          description="The aside sits on the right."
        >
          <Badge className="max-md:hidden">Aside badge</Badge>
        </PageHeading>
        <PageHeading
          eyebrow={
            <Eyebrow variant="page" className="mb-2">
              PAGE <i>·</i> EYEBROW
            </Eyebrow>
          }
          title="Page heading without an aside."
          description="Title and description only."
        />
      </div>
    ),
  },
  {
    id: "icon-button",
    name: "IconButton",
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        <IconButton aria-label="Close">
          <Icon name="x" />
        </IconButton>
        <IconButton aria-label="Settings">
          <Icon name="settings" size={16} />
        </IconButton>
        <IconButton aria-label="Play" disabled>
          <Icon name="play" size={18} />
        </IconButton>
      </div>
    ),
  },
  {
    id: "icon",
    name: "Icon",
    render: () => (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {iconNames.map((name) => (
            <div key={name} className="flex w-20 flex-col items-center gap-1 text-xs">
              <Icon name={name} />
              {name}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {[16, 20, 32].map((size) => (
            <Icon key={size} name="star" size={size} />
          ))}
        </div>
      </div>
    ),
  },
];
