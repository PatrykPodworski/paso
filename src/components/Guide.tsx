import type { ReactNode } from "react";
import { Eyebrow } from "../design-system/Eyebrow";
import { Badge } from "../design-system/Badge";
import { SectionHeading } from "../design-system/SectionHeading";
import { PageHeading } from "../design-system/PageHeading";
import type { Progress } from "../data/types";
import { requirementGroups, sources } from "../data/research";
import { Icon } from "../design-system/Icon";
import { PassingRule } from "./PassingRule";
import { FieldNote } from "../design-system/FieldNote";
import { Panel } from "../design-system/Panel";
import { Notice } from "../design-system/Notice";
import { TextLink } from "../design-system/TextLink";
import { CHECKBOX } from "../design-system/field";

const TD = "py-4 px-2.5 max-md:py-3.5 max-md:px-2.5 border-b border-b-sage-100 max-md:text-xs";

const SKILLS = [
  ["book", "Reading", "45 min", "4 tasks · 25 questions (5 + 6 + 6 + 8)"],
  ["headphones", "Listening", "25 min", "4 tasks · 25 questions (5 + 5 + 8 + 7)"],
  ["pen", "Writing", "25 min", "Form: 15–25 words · Message: 30–40 words"],
  ["mic", "Speaking", "10 min + 10 prep", "Introduction · Topic · Conversation"],
];

const CRITERIA = [
  [
    "pen",
    "Writing",
    "Each task has equal weight. Answer the fields or message prompts with enough understandable information. Check word count, greeting and farewell where requested.",
  ],
  [
    "mic",
    "Speaking",
    "Introduce yourself for 1–2 minutes, discuss your chosen topic for 2–3, then converse for 3–4. Ask the interviewer two questions. Task completion and language use are assessed.",
  ],
  [
    "headphones",
    "Understanding",
    "Each correct reading or listening answer earns one point. There is no penalty for wrong answers. Official listening texts are played twice.",
  ],
];

const STEPS: [string, ReactNode][] = [
  [
    "Book the right exam",
    <>
      Select general DELE A1 at an authorized centre. No lower-level certificate is required. Fees,
      dates and deadlines depend on the centre and session; check the{" "}
      <a className="underline" href={sources[9].url} target="_blank" rel="noreferrer">
        official registration page
      </a>
      .
    </>,
  ],
  [
    "Check your appointment",
    "Confirm the location and the separate written and oral times. Ask the centre about any access arrangements when registering. Follow its instructions about materials and arrival time.",
  ],
  [
    "Bring your documents",
    <>
      Have the original official photo ID or passport used to register, registration receipt and
      official exam summons. Check the{" "}
      <a className="underline" href={sources[8].url} target="_blank" rel="noreferrer">
        candidate guidance
      </a>{" "}
      and your centre’s current instructions.
    </>,
  ],
];

type Props = {
  progress: Progress;
  onCheck: (id: string) => void;
};

export const Guide = ({ progress, onCheck }: Props) => {
  return (
    <div className="guide-page">
      <PageHeading
        eyebrow={
          <Eyebrow variant="page" className="mb-2">
            THE BIG PICTURE, MADE SIMPLE
          </Eyebrow>
        }
        title="Your guide to DELE A1."
        description="Know what’s expected. Practise with a purpose."
      >
        <Badge className="max-md:hidden">
          <Icon name="check" size={16} /> Researched 7 Sep 2026
        </Badge>
      </PageHeading>
      <Panel className="p-8 max-xl:p-7 max-md:p-6 max-sm:p-5 flex max-lg:block justify-between items-center gap-9 max-xl:gap-5 bg-sage-100!">
        <div className="max-w-170">
          <Eyebrow>A1 · THE EVERYDAY ESSENTIALS</Eyebrow>
          <h2 className="font-serif font-semibold tracking-tight leading-tight text-3xl max-sm:text-2xl mt-2.5 mx-0 mb-3.5">
            You don’t need perfect Spanish.
            <br />
            You need to connect.
          </h2>
          <p className="leading-relaxed text-sage-600 text-sm">
            A1 is about understanding familiar expressions, giving basic personal information and
            taking part in simple exchanges when the other person speaks clearly and helps. This
            course prepares for the general DELE A1, using the format introduced in 2020.
          </p>
          <TextLink className="mt-3.5" href={sources[0].url} target="_blank" rel="noreferrer">
            Read the official guide
            <Icon name="external" size={15} />
          </TextLink>
        </div>
        <div className="w-36 h-40 max-xl:w-29 max-xl:h-35 shrink-0 border border-sage-300 bg-sage-100 rounded-t-arch rounded-b-2xl text-7xl max-xl:text-6xl font-serif font-medium flex max-lg:hidden flex-col items-center justify-center text-olive-500 leading-none">
          A1
          <span className="font-sans text-2xs tracking-widest mt-4">UN PEQUEÑO GRAN PASO</span>
        </div>
      </Panel>
      <SectionHeading title="Four skills. Two passing groups." />
      <Panel className="pt-2 px-6 pb-4 max-md:px-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm max-xl:text-xs text-left whitespace-nowrap">
          <thead>
            <tr>
              {["Skill", "Time", "What you do", "Points"].map((h) => (
                <th
                  key={h}
                  className="text-sage-400 font-medium text-xs max-sm:text-2xs py-3.5 px-2.5 border-b border-b-sage-100"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SKILLS.map(([icon, skill, time, tasks]) => (
              <tr key={skill}>
                <td className={`${TD} text-olive-800 font-semibold`}>
                  <Icon name={icon} className="inline align-middle w-4 mr-2.5" />
                  {skill}
                </td>
                <td className={`${TD} text-sage-700`}>{time}</td>
                <td className={`${TD} text-sage-700`}>{tasks}</td>
                <td className={`${TD} text-sage-700 font-semibold`}>25</td>
              </tr>
            ))}
          </tbody>
        </table>
        <FieldNote className="mt-3.5">
          Administration order is reading, listening, writing, then the oral appointment as arranged
          by your centre. Older A1 guides have different timings.{" "}
          <a className="underline" href={sources[0].url} target="_blank" rel="noreferrer">
            Official structure ↗
          </a>
        </FieldNote>
      </Panel>
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-5 mt-6">
        <PassingRule />
        <Panel className="p-7 max-xl:p-6">
          <Eyebrow>WHAT THE EXAMINER LOOKS FOR</Eyebrow>
          <h3 className="tracking-normal font-serif text-2xl font-medium mt-2 mx-0 mb-3">
            Be clear. Cover the task.
          </h3>
          {CRITERIA.map(([icon, title, text]) => (
            <div key={title} className="flex gap-3.5 mt-6">
              <Icon name={icon} className="mt-0.5 text-sage-400" />
              <section>
                <h4 className="font-semibold text-sm">{title}</h4>
                <p className="leading-relaxed text-sm text-sage-700 mt-1.5">{text}</p>
              </section>
            </div>
          ))}
          <FieldNote className="border-t border-t-sage-200 pt-4 mt-5">
            Productive tasks use trained human raters and 0–3 rating bands, then scale to 25. This
            app’s completion, XP and practice accuracy are not official grades.{" "}
            <a className="underline" href={sources[0].url} target="_blank" rel="noreferrer">
              Assessment scales ↗
            </a>
          </FieldNote>
        </Panel>
      </div>
      <SectionHeading
        title="Your A1 readiness checklist"
        text="Self-assess these abilities as you work through the path."
      >
        <Badge>
          {
            requirementGroups.flatMap((g) => g.items).filter(([id]) => progress.checks.includes(id))
              .length
          }
          /{requirementGroups.flatMap((g) => g.items).length} checked
        </Badge>
      </SectionHeading>
      <Notice icon="info">
        <p className="leading-relaxed">
          There is no official fixed word list or separate grammar test to memorize for a guaranteed
          pass. This is a practical coverage map of the official A1 inventories. The{" "}
          <a className="underline" href={sources[10].url} target="_blank" rel="noreferrer">
            full curriculum
          </a>{" "}
          is the reference for exhaustive detail; A1 and A2 are separate columns. A checked box
          records your self-assessment.
        </p>
      </Notice>
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-5">
        {requirementGroups.map((g) => (
          <Panel as="section" className="p-6" key={g.title}>
            <h3 className="font-semibold tracking-tight flex items-center gap-2.5 mb-6 text-base">
              <Icon name={g.icon} className="text-sage-400 w-5" />
              {g.title}
            </h3>
            {g.items.map(([id, title, mapping]) => (
              <label
                className="flex gap-2.5 my-4 mx-0 items-start text-sage-700 text-sm leading-relaxed"
                key={id}
              >
                <input
                  className={`${CHECKBOX} mt-0.5 mx-0 mb-0`}
                  type="checkbox"
                  checked={progress.checks.includes(id)}
                  onChange={() => onCheck(id)}
                />
                <span>
                  {title}
                  <small className="text-2xs max-md:text-xs text-sage-400 block mt-1">
                    {mapping}
                  </small>
                </span>
              </label>
            ))}
            <TextLink
              className="mt-1 border-t border-t-sage-200 pt-3.5 text-xs!"
              href={sources[g.source].url}
              target="_blank"
              rel="noreferrer"
            >
              Official reference
              <Icon name="external" size={14} />
            </TextLink>
          </Panel>
        ))}
      </div>
      <SectionHeading title="Before you walk through the door" />
      <Panel className="grid grid-cols-3 max-lg:grid-cols-1 p-7 gap-7 max-lg:gap-5">
        {STEPS.map(([title, text], i) => (
          <div key={title} className="max-lg:relative max-lg:pl-11">
            <span className="font-serif text-3xl text-sage-300 max-lg:absolute max-lg:left-0 max-lg:top-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-base my-2.5 mx-0 font-semibold tracking-tight">{title}</h3>
            <p className="leading-relaxed text-sm text-sage-500">{text}</p>
          </div>
        ))}
      </Panel>
      <SectionHeading title="Go straight to the source">
        <span className="text-sm text-sage-700">Instituto Cervantes · Primary sources</span>
      </SectionHeading>
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3">
        {sources.map((s, i) => (
          <a
            key={s.url}
            className="border border-sage-200 rounded-lg flex items-center gap-3.5 max-xl:gap-2.5 p-4 max-xl:p-3.5 bg-white no-underline hover:border-sage-300 hover:bg-sage-50"
            href={s.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="source-number text-xs text-sage-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">
              <strong className="text-sm max-xl:text-xs max-md:text-sm font-semibold block leading-normal">
                {s.title}
              </strong>
              <small className="text-xs max-xl:text-2xs max-md:text-xs leading-normal block text-sage-600 mt-1">
                {s.description}
              </small>
            </span>
            <Icon name="external" size={17} className="text-sage-400" />
          </a>
        ))}
      </div>
      <p className="leading-relaxed text-xs text-sage-400 mt-6">
        Paso is an independent learning app, not affiliated with Instituto Cervantes. Exercises and
        illustrations are original. Official resources remain on their publishers’ websites.
      </p>
    </div>
  );
};
