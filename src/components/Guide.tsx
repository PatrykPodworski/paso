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

const TD =
  "p-[18px_10px] max-md:p-[15px_10px] border-b border-b-sage-100 max-md:text-[13px] max-sm:text-[12px]";

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
          <Eyebrow variant="page" className="mb-[9px]">
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
      <Panel className="p-[32px] max-xl:p-[27px] max-md:p-[25px] max-sm:p-[22px] flex max-lg:block justify-between items-center gap-[35px] max-xl:gap-[20px] bg-sage-100!">
        <div className="max-w-[680px]">
          <Eyebrow>A1 · THE EVERYDAY ESSENTIALS</Eyebrow>
          <h2 className="font-serif font-semibold tracking-[-0.7px] leading-[1.25] text-[32px] max-xl:text-[28px] max-sm:text-[25px] m-[11px_0_14px]">
            You don’t need perfect Spanish.
            <br />
            You need to connect.
          </h2>
          <p className="leading-[1.7] text-sage-600 text-[14px]">
            A1 is about understanding familiar expressions, giving basic personal information and
            taking part in simple exchanges when the other person speaks clearly and helps. This
            course prepares for the general DELE A1, using the format introduced in 2020.
          </p>
          <TextLink className="mt-[15px]" href={sources[0].url} target="_blank" rel="noreferrer">
            Read the official guide
            <Icon name="external" size={15} />
          </TextLink>
        </div>
        <div className="w-[145px] h-[160px] max-xl:w-[115px] max-xl:h-[140px] shrink-0 border border-sage-300 bg-sage-100 rounded-[75px_75px_14px_14px] text-[76px] max-xl:text-[65px] font-serif font-medium flex max-lg:hidden flex-col items-center justify-center text-olive-500 leading-[1]">
          A1
          <span className="font-sans text-[9px] tracking-[1.4px] mt-[17px]">
            UN PEQUEÑO GRAN PASO
          </span>
        </div>
      </Panel>
      <SectionHeading title="Four skills. Two passing groups." />
      <Panel className="pt-[8px] px-[25px] pb-[17px] max-md:px-[12px] overflow-x-auto">
        <table className="w-full border-collapse text-[14px] max-xl:text-[13px] text-left whitespace-nowrap">
          <thead>
            <tr>
              {["Skill", "Time", "What you do", "Points"].map((h) => (
                <th
                  key={h}
                  className="text-sage-400 font-medium text-[13px] max-sm:text-[11px] p-[15px_10px] border-b border-b-sage-100"
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
                  <Icon name={icon} className="inline align-middle w-[17px] mr-[10px]" />
                  {skill}
                </td>
                <td className={`${TD} text-sage-700`}>{time}</td>
                <td className={`${TD} text-sage-700`}>{tasks}</td>
                <td className={`${TD} text-sage-700 font-semibold`}>25</td>
              </tr>
            ))}
          </tbody>
        </table>
        <FieldNote className="mt-[15px]">
          Administration order is reading, listening, writing, then the oral appointment as arranged
          by your centre. Older A1 guides have different timings.{" "}
          <a className="underline" href={sources[0].url} target="_blank" rel="noreferrer">
            Official structure ↗
          </a>
        </FieldNote>
      </Panel>
      <div className="grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] gap-[22px] mt-[24px]">
        <PassingRule />
        <Panel className="p-[27px] max-xl:p-[23px] max-md:p-[24px]">
          <Eyebrow>WHAT THE EXAMINER LOOKS FOR</Eyebrow>
          <h3 className="tracking-[-0.3px] font-serif text-[25px] font-medium m-[9px_0_12px]">
            Be clear. Cover the task.
          </h3>
          {CRITERIA.map(([icon, title, text]) => (
            <div key={title} className="flex gap-[15px] mt-[23px]">
              <Icon name={icon} className="mt-[3px] text-sage-400" />
              <section>
                <h4 className="font-semibold text-[15px]">{title}</h4>
                <p className="leading-[1.7] text-[14px] text-sage-700 mt-[6px]">{text}</p>
              </section>
            </div>
          ))}
          <FieldNote className="border-t border-t-sage-200 pt-[17px] mt-[22px]">
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
        <p className="leading-[1.7]">
          There is no official fixed word list or separate grammar test to memorize for a guaranteed
          pass. This is a practical coverage map of the official A1 inventories. The{" "}
          <a className="underline" href={sources[10].url} target="_blank" rel="noreferrer">
            full curriculum
          </a>{" "}
          is the reference for exhaustive detail; A1 and A2 are separate columns. A checked box
          records your self-assessment.
        </p>
      </Notice>
      <div className="grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] gap-[21px]">
        {requirementGroups.map((g) => (
          <Panel as="section" className="p-[25px] max-xl:p-[23px]" key={g.title}>
            <h3 className="font-semibold tracking-[-0.3px] flex items-center gap-[10px] mb-[23px] text-[17px]">
              <Icon name={g.icon} className="text-sage-400 w-[20px]" />
              {g.title}
            </h3>
            {g.items.map(([id, title, mapping]) => (
              <label
                className="flex gap-[11px] m-[17px_0] items-start text-sage-700 text-[14px] leading-[1.65]"
                key={id}
              >
                <input
                  className={`${CHECKBOX} m-[3px_0_0]`}
                  type="checkbox"
                  checked={progress.checks.includes(id)}
                  onChange={() => onCheck(id)}
                />
                <span>
                  {title}
                  <small className="text-[11px] max-md:text-[12px] text-sage-400 block mt-[5px]">
                    {mapping}
                  </small>
                </span>
              </label>
            ))}
            <TextLink
              className="mt-[5px] border-t border-t-sage-200 pt-[14px] text-[13px]!"
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
      <Panel className="grid grid-cols-[repeat(3,1fr)] max-lg:grid-cols-[1fr] p-[27px] gap-[28px] max-lg:gap-[20px]">
        {STEPS.map(([title, text], i) => (
          <div key={title} className="max-lg:relative max-lg:pl-[43px]">
            <span className="font-serif text-[28px] text-sage-300 max-lg:absolute max-lg:left-0 max-lg:top-[3px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[16px] m-[10px_0] font-semibold tracking-[-0.3px]">{title}</h3>
            <p className="leading-[1.7] text-[14px] text-sage-500">{text}</p>
          </div>
        ))}
      </Panel>
      <SectionHeading title="Go straight to the source">
        <span className="text-[14px] text-sage-700">Instituto Cervantes · Primary sources</span>
      </SectionHeading>
      <div className="grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] gap-[12px]">
        {sources.map((s, i) => (
          <a
            key={s.url}
            className="border border-sage-200 rounded-[9px] flex items-center gap-[15px] max-xl:gap-[10px] p-[17px] max-xl:p-[15px] bg-white no-underline hover:border-sage-300 hover:bg-sage-50"
            href={s.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="source-number text-[13px] text-sage-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">
              <strong className="text-[14px] max-xl:text-[13px] max-md:text-[14px] font-semibold block leading-[1.5]">
                {s.title}
              </strong>
              <small className="text-[12px] max-xl:text-[11px] max-md:text-[12px] leading-[1.5] block text-sage-600 mt-[4px]">
                {s.description}
              </small>
            </span>
            <Icon name="external" size={17} className="text-sage-400" />
          </a>
        ))}
      </div>
      <p className="leading-[1.7] text-[13px] text-sage-400 mt-[25px]">
        Paso is an independent learning app, not affiliated with Instituto Cervantes. Exercises and
        illustrations are original. Official resources remain on their publishers’ websites.
      </p>
    </div>
  );
};
