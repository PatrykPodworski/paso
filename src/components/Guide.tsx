import { useState } from "react";
import type { Progress } from "../data/types";
import { passingGroups } from "../data/progress";
import { requirementGroups, sources } from "../data/research";
import { Icon } from "./Icon";
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
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE BIG PICTURE, MADE SIMPLE</span>
          <h1>Your guide to DELE A1.</h1>
          <p>Know what’s expected. Practise with a purpose.</p>
        </div>
        <span className="outline-badge">
          <Icon name="check" size={16} /> Researched 7 Sep 2026
        </span>
      </div>
      <div className="guide-overview panel">
        <div>
          <span className="eyebrow">A1 · THE EVERYDAY ESSENTIALS</span>
          <h2>
            You don’t need perfect Spanish.
            <br />
            You need to connect.
          </h2>
          <p>
            A1 is about understanding familiar expressions, giving basic personal information and
            taking part in simple exchanges when the other person speaks clearly and helps. This
            course prepares for the general DELE A1, using the format introduced in 2020.
          </p>
          <a className="text-link" href={sources[0].url} target="_blank" rel="noreferrer">
            Read the official guide
            <Icon name="external" size={15} />
          </a>
        </div>
        <div className="a1-emblem">
          A1<span>UN PEQUEÑO GRAN PASO</span>
        </div>
      </div>
      <div className="section-heading">
        <h2>Four skills. Two passing groups.</h2>
      </div>
      <div className="panel exam-table-wrap">
        <table className="exam-table">
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
        <p className="field-note">
          Administration order is reading, listening, writing, then the oral appointment as arranged
          by your centre. Older A1 guides have different timings.{" "}
          <a href={sources[0].url} target="_blank" rel="noreferrer">
            Official structure ↗
          </a>
        </p>
      </div>
      <div className="guide-two-col">
        <div className="panel pass-simulator">
          <span className="eyebrow">TRY THE PASSING RULE</span>
          <h3>Does this score pass?</h3>
          <p>Move the sliders. Both groups must reach 30/50, even if your total is 60 or more.</p>
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
          <a className="text-link" href={sources[1].url} target="_blank" rel="noreferrer">
            Official scoring rules
            <Icon name="external" size={14} />
          </a>
        </div>
        <div className="panel examiner-notes">
          <span className="eyebrow">WHAT THE EXAMINER LOOKS FOR</span>
          <h3>Be clear. Cover the task.</h3>
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
          <p className="field-note">
            Productive tasks use trained human raters and 0–3 rating bands, then scale to 25. This
            app’s completion, XP and practice accuracy are not official grades.{" "}
            <a href={sources[0].url} target="_blank" rel="noreferrer">
              Assessment scales ↗
            </a>
          </p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <h2>Your A1 readiness checklist</h2>
          <p>Self-assess these abilities as you work through the path.</p>
        </div>
        <span className="outline-badge">
          {
            requirementGroups.flatMap((g) => g.items).filter(([id]) => progress.checks.includes(id))
              .length
          }
          /{requirementGroups.flatMap((g) => g.items).length} checked
        </span>
      </div>
      <div className="notice">
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
      </div>
      <div className="requirement-grid">
        {requirementGroups.map((g) => (
          <section className="panel requirement-group" key={g.title}>
            <h3>
              <Icon name={g.icon} />
              {g.title}
            </h3>
            {g.items.map(([id, title, mapping]) => (
              <label className="requirement-row" key={id}>
                <input
                  type="checkbox"
                  checked={progress.checks.includes(id)}
                  onChange={() => onCheck(id)}
                />
                <span>
                  {title}
                  <small>{mapping}</small>
                </span>
              </label>
            ))}
            <a className="text-link" href={sources[g.source].url} target="_blank" rel="noreferrer">
              Official reference
              <Icon name="external" size={14} />
            </a>
          </section>
        ))}
      </div>
      <div className="section-heading">
        <h2>Before you walk through the door</h2>
      </div>
      <div className="panel exam-day">
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
      </div>
      <div className="section-heading">
        <h2>Go straight to the source</h2>
        <span className="subtle">Instituto Cervantes · Primary sources</span>
      </div>
      <div className="source-list">
        {sources.map((s, i) => (
          <a key={s.url} className="source-card" href={s.url} target="_blank" rel="noreferrer">
            <span className="source-number">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <strong>{s.title}</strong>
              <small>{s.description}</small>
            </span>
            <Icon name="external" size={17} />
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
