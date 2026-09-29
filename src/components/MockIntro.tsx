import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { Notice } from "../design-system/Notice";
import { mockSections } from "../data/mock";
import type { Progress } from "../data/types";
import { Icon } from "./Icon";

type Props = { progress: Progress; onStart: () => void };

export const MockIntro = ({ progress, onStart }: Props) => (
  <>
    <Panel className="mock-intro">
      <div className="mock-intro-art">
        <Icon name="flag" size={70} />
        <span>DELE A1</span>
      </div>
      <div>
        <Eyebrow>YOUR FIRST FULL REHEARSAL</Eyebrow>
        <h2>
          One exam. Four ways
          <br />
          to make yourself understood.
        </h2>
        <p>
          Try 55 original tasks and questions. Reading and listening are scored automatically.
          Writing and speaking are saved for self-review or a teacher’s assessment.
        </p>
        <div className="mock-meta">
          <span>
            <Icon name="clock" />
            105 min + 10 min oral prep
          </span>
          <span>
            <Icon name="book" />4 skills · 100 possible points
          </span>
        </div>
        <Button variant="primary" onClick={onStart}>
          Start exam rehearsal
          <Icon name="arrow" />
        </Button>
      </div>
    </Panel>
    <div className="exam-section-grid">
      {mockSections.map((s, i) => (
        <Panel as="article" key={s.title}>
          <div className={`skill-icon ${s.title.toLowerCase()}`}>
            <Icon name={["book", "headphones", "pen", "mic"][i]} />
          </div>
          <h3>{s.title}</h3>
          <p>{s.spanish}</p>
          <strong>{s.minutes} minutes</strong>
          <span>
            {s.questions.length} {i < 2 ? "questions · 4 tasks" : "tasks"}
          </span>
        </Panel>
      ))}
    </div>
    <Notice>
      <Icon name="info" />
      <p>
        This is an independent guided rehearsal. Shorter listening clips, visual symbols and
        navigation differ from the live exam; audio is controlled per question. Use the{" "}
        <a
          href="https://examenes.cervantes.es/es/dele/preparar-prueba"
          target="_blank"
          rel="noreferrer"
        >
          official papers and recordings
        </a>{" "}
        to practise exact formatting and continuous audio. The timer keeps running if you leave this
        page.
      </p>
    </Notice>
    {progress.mockResults.length > 0 && (
      <Panel className="previous-exams">
        <h3>Your previous rehearsals</h3>
        {progress.mockResults
          .slice()
          .reverse()
          .map((r) => (
            <div className="history-row" key={r.at}>
              <span>{new Date(r.at).toLocaleDateString()}</span>
              <strong>Reading {r.reading}/25</strong>
              <strong>Listening {r.listening}/25</strong>
              <small>Productive skills ungraded</small>
            </div>
          ))}
      </Panel>
    )}
  </>
);
