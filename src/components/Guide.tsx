import { Eyebrow } from "../design-system/Eyebrow";
import { Badge } from "../design-system/Badge";
import { SectionHeading } from "../design-system/SectionHeading";
import { PageHeading } from "../design-system/PageHeading";
import { useState } from "react";
import type { Progress } from "../data/types";
import { passingGroups } from "../data/progress";
import { requirementGroups, sources } from "../data/research";
import { Icon } from "./Icon";
import { FieldNote } from "../design-system/FieldNote";
import { Panel } from "../design-system/Panel";
import { Notice } from "../design-system/Notice";
import { TextLink } from "../design-system/TextLink";
export const Guide = ({
  progress,
  onCheck,
}: {
  progress: Progress;
  onCheck: (id: string) => void;
}) => {
  const [scores, setScores] = useState([15, 15, 15, 15]);
  const groups = passingGroups(scores[0], scores[1], scores[2], scores[3]);
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
        <Badge className="max-tablet:hidden">
          <Icon name="check" size={16} /> Researched 7 Sep 2026
        </Badge>
      </PageHeading>
      <Panel className="p-[32px] max-desktop:p-[27px] max-tablet:p-[25px] max-phone:p-[22px] flex max-laptop:block justify-between items-center gap-[35px] max-desktop:gap-[20px] bg-[#edf0e3]!">
        <div className="max-w-[680px]">
          <Eyebrow>A1 · THE EVERYDAY ESSENTIALS</Eyebrow>
          <h2 className="text-[32px] max-desktop:text-[28px] max-phone:text-[25px] m-[11px_0_14px]">
            You don’t need perfect Spanish.
            <br />
            You need to connect.
          </h2>
          <p className="text-[#829174] text-[14px]">
            A1 is about understanding familiar expressions, giving basic personal information and
            taking part in simple exchanges when the other person speaks clearly and helps. This
            course prepares for the general DELE A1, using the format introduced in 2020.
          </p>
          <TextLink className="mt-[15px]" href={sources[0].url} target="_blank" rel="noreferrer">
            Read the official guide
            <Icon name="external" size={15} />
          </TextLink>
        </div>
        <div className="w-[145px] h-[160px] max-desktop:w-[115px] max-desktop:h-[140px] shrink-0 border border-[#bbcaab] bg-[#e5ecdb] rounded-[75px_75px_14px_14px] text-[76px] max-desktop:text-[65px] font-(family-name:--serif) font-medium flex max-laptop:hidden flex-col items-center justify-center text-[#8ea078] leading-[1]">
          A1
          <span className="font-[family-name:'Avenir_Next',sans-serif] text-[9px] tracking-[1.4px] mt-[17px]">
            UN PEQUEÑO GRAN PASO
          </span>
        </div>
      </Panel>
      <SectionHeading>
        <h2>Four skills. Two passing groups.</h2>
      </SectionHeading>
      <Panel className="pt-[8px] px-[25px] pb-[17px] max-tablet:px-[12px] overflow-x-auto">
        <table className="w-full border-collapse text-[14px] max-desktop:text-[13px] text-left whitespace-nowrap [&_th]:text-[#a0aa91] [&_th]:font-medium [&_th]:text-[13px] max-phone:[&_th]:text-[11px] [&_th]:p-[15px_10px] [&_th]:border-b [&_th]:border-b-[#e6ecdd] [&_td]:p-[18px_10px] max-tablet:[&_td]:p-[15px_10px] [&_td]:border-b [&_td]:border-b-[#edf0e6] [&_td]:text-[#78876a] max-tablet:[&_td]:text-[13px] max-phone:[&_td]:text-[12px] [&_td:first-child]:text-[#526846] [&_td:first-child]:font-semibold [&_td:last-child]:font-semibold [&_td_svg]:align-middle [&_td_svg]:w-[17px] [&_td_svg]:mr-[10px]">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Time</th>
              <th>What you do</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Icon name="book" />
                Reading
              </td>
              <td>45 min</td>
              <td>4 tasks · 25 questions (5 + 6 + 6 + 8)</td>
              <td>25</td>
            </tr>
            <tr>
              <td>
                <Icon name="headphones" />
                Listening
              </td>
              <td>25 min</td>
              <td>4 tasks · 25 questions (5 + 5 + 8 + 7)</td>
              <td>25</td>
            </tr>
            <tr>
              <td>
                <Icon name="pen" />
                Writing
              </td>
              <td>25 min</td>
              <td>Form: 15–25 words · Message: 30–40 words</td>
              <td>25</td>
            </tr>
            <tr>
              <td>
                <Icon name="mic" />
                Speaking
              </td>
              <td>10 min + 10 prep</td>
              <td>Introduction · Topic · Conversation</td>
              <td>25</td>
            </tr>
          </tbody>
        </table>
        <FieldNote className="mt-[15px]">
          Administration order is reading, listening, writing, then the oral appointment as arranged
          by your centre. Older A1 guides have different timings.{" "}
          <a href={sources[0].url} target="_blank" rel="noreferrer">
            Official structure ↗
          </a>
        </FieldNote>
      </Panel>
      <div className="grid grid-cols-[1fr_1fr] max-laptop:grid-cols-[1fr] gap-[22px] mt-[24px]">
        <Panel className="p-[27px] max-desktop:p-[23px] max-tablet:p-[24px]">
          <Eyebrow>TRY THE PASSING RULE</Eyebrow>
          <h3 className="font-(family-name:--serif) text-[25px] font-medium m-[9px_0_12px]">
            Does this score pass?
          </h3>
          <p className="text-[14px] text-[#768762] mb-[23px]">
            Move the sliders. Both groups must reach 30/50, even if your total is 60 or more.
          </p>
          {["Reading", "Writing", "Listening", "Speaking"].map((s, i) => (
            <label key={s} className="score-slider">
              <span>
                {s}
                <b>{scores[i]}/25</b>
              </span>
              <input
                type="range"
                min="0"
                max="25"
                value={scores[i]}
                onChange={(e) => setScores((v) => v.map((n, j) => (j === i ? +e.target.value : n)))}
              />
            </label>
          ))}
          <div className="passing-groups">
            <div className={groups.group1 >= 30 ? "passed" : "below"}>
              <span>Reading + writing</span>
              <b>{groups.group1}/50</b>
            </div>
            <div className={groups.group2 >= 30 ? "passed" : "below"}>
              <span>Listening + speaking</span>
              <b>{groups.group2}/50</b>
            </div>
          </div>
          <div className={`pass-verdict ${groups.pass ? "passed" : "below"}`} role="status">
            <Icon name={groups.pass ? "check" : "info"} />
            {groups.pass
              ? "These example scores meet the passing rule."
              : "These example scores do not meet the passing rule."}
          </div>
          <TextLink href={sources[1].url} target="_blank" rel="noreferrer">
            Official scoring rules
            <Icon name="external" size={14} />
          </TextLink>
        </Panel>
        <Panel className="p-[27px] max-desktop:p-[23px] max-tablet:p-[24px] [&>div]:flex [&>div]:gap-[15px] [&>div]:mt-[23px] [&>div>svg]:mt-[3px] [&>div>svg]:text-[#a2ae90] [&_h4]:text-[15px] [&_section_p]:text-[14px] [&_section_p]:text-[#768762] [&_section_p]:mt-[6px]">
          <Eyebrow>WHAT THE EXAMINER LOOKS FOR</Eyebrow>
          <h3 className="font-(family-name:--serif) text-[25px] font-medium m-[9px_0_12px]">
            Be clear. Cover the task.
          </h3>
          <div>
            <Icon name="pen" />
            <section>
              <h4>Writing</h4>
              <p>
                Each task has equal weight. Answer the fields or message prompts with enough
                understandable information. Check word count, greeting and farewell where requested.
              </p>
            </section>
          </div>
          <div>
            <Icon name="mic" />
            <section>
              <h4>Speaking</h4>
              <p>
                Introduce yourself for 1–2 minutes, discuss your chosen topic for 2–3, then converse
                for 3–4. Ask the interviewer two questions. Task completion and language use are
                assessed.
              </p>
            </section>
          </div>
          <div>
            <Icon name="headphones" />
            <section>
              <h4>Understanding</h4>
              <p>
                Each correct reading or listening answer earns one point. There is no penalty for
                wrong answers. Official listening texts are played twice.
              </p>
            </section>
          </div>
          <FieldNote className="border-t border-t-line pt-[17px] mt-[22px]">
            Productive tasks use trained human raters and 0–3 rating bands, then scale to 25. This
            app’s completion, XP and practice accuracy are not official grades.{" "}
            <a href={sources[0].url} target="_blank" rel="noreferrer">
              Assessment scales ↗
            </a>
          </FieldNote>
        </Panel>
      </div>
      <SectionHeading>
        <div>
          <h2>Your A1 readiness checklist</h2>
          <p>Self-assess these abilities as you work through the path.</p>
        </div>
        <Badge>
          {
            requirementGroups.flatMap((g) => g.items).filter(([id]) => progress.checks.includes(id))
              .length
          }
          /{requirementGroups.flatMap((g) => g.items).length} checked
        </Badge>
      </SectionHeading>
      <Notice>
        <Icon name="info" />
        <p>
          There is no official fixed word list or separate grammar test to memorize for a guaranteed
          pass. This is a practical coverage map of the official A1 inventories. The{" "}
          <a href={sources[10].url} target="_blank" rel="noreferrer">
            full curriculum
          </a>{" "}
          is the reference for exhaustive detail; A1 and A2 are separate columns. A checked box
          records your self-assessment.
        </p>
      </Notice>
      <div className="grid grid-cols-[1fr_1fr] max-laptop:grid-cols-[1fr] gap-[21px]">
        {requirementGroups.map((g) => (
          <Panel as="section" className="p-[25px] max-desktop:p-[23px]" key={g.title}>
            <h3 className="flex items-center gap-[10px] mb-[23px] text-[17px]">
              <Icon name={g.icon} className="text-[#9ca987] w-[20px]" />
              {g.title}
            </h3>
            {g.items.map(([id, title, mapping]) => (
              <label
                className="flex gap-[11px] m-[17px_0] items-start text-[#6d7e5c] text-[14px] leading-[1.65]"
                key={id}
              >
                <input
                  className="m-[3px_0_0]"
                  type="checkbox"
                  checked={progress.checks.includes(id)}
                  onChange={() => onCheck(id)}
                />
                <span>
                  {title}
                  <small className="text-[11px] max-tablet:text-[12px] text-[#a5ae98] block mt-[5px]">
                    {mapping}
                  </small>
                </span>
              </label>
            ))}
            <TextLink
              className="mt-[5px] border-t border-t-(--line) pt-[14px] text-[13px]!"
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
      <SectionHeading>
        <h2>Before you walk through the door</h2>
      </SectionHeading>
      <Panel className="grid grid-cols-[repeat(3,1fr)] max-laptop:grid-cols-[1fr] p-[27px] gap-[28px] max-laptop:gap-[20px] max-laptop:[&>div]:relative max-laptop:[&>div]:pl-[43px] [&>div>span]:font-(family-name:--serif) [&>div>span]:text-[28px] [&>div>span]:text-[#bac4aa] max-laptop:[&>div>span]:absolute max-laptop:[&>div>span]:left-0 max-laptop:[&>div>span]:top-[3px] [&_h3]:text-[16px] [&_h3]:m-[10px_0] [&_p]:text-[14px] [&_p]:text-[#929e83]">
        <div>
          <span>01</span>
          <h3>Book the right exam</h3>
          <p>
            Select general DELE A1 at an authorized centre. No lower-level certificate is required.
            Fees, dates and deadlines depend on the centre and session; check the{" "}
            <a href={sources[9].url} target="_blank" rel="noreferrer">
              official registration page
            </a>
            .
          </p>
        </div>
        <div>
          <span>02</span>
          <h3>Check your appointment</h3>
          <p>
            Confirm the location and the separate written and oral times. Ask the centre about any
            access arrangements when registering. Follow its instructions about materials and
            arrival time.
          </p>
        </div>
        <div>
          <span>03</span>
          <h3>Bring your documents</h3>
          <p>
            Have the original official photo ID or passport used to register, registration receipt
            and official exam summons. Check the{" "}
            <a href={sources[8].url} target="_blank" rel="noreferrer">
              candidate guidance
            </a>{" "}
            and your centre’s current instructions.
          </p>
        </div>
      </Panel>
      <SectionHeading>
        <h2>Go straight to the source</h2>
        <span className="subtle">Instituto Cervantes · Primary sources</span>
      </SectionHeading>
      <div className="grid grid-cols-[1fr_1fr] max-laptop:grid-cols-[1fr] gap-[12px]">
        {sources.map((s, i) => (
          <a
            key={s.url}
            className="border border-(--line) rounded-[9px] flex items-center gap-[15px] max-desktop:gap-[10px] p-[17px] max-desktop:p-[15px] bg-[#fffefa] no-underline [&:hover]:border-[#bdcdb0] [&:hover]:bg-[#f6f8ef]"
            href={s.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="source-number">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1">
              <strong className="text-[14px] max-desktop:text-[13px] max-tablet:text-[14px] font-semibold block leading-[1.5]">
                {s.title}
              </strong>
              <small className="text-[12px] max-desktop:text-[11px] max-tablet:text-[12px] leading-[1.5] block text-[#7e8d6c] mt-[4px]">
                {s.description}
              </small>
            </span>
            <Icon name="external" size={17} className="text-[#9eac8b]" />
          </a>
        ))}
      </div>
      <p className="guide-footer">
        Paso is an independent learning app, not affiliated with Instituto Cervantes. Exercises and
        illustrations are original. Official resources remain on their publishers’ websites.
      </p>
    </div>
  );
};
