import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { mockSections } from "../data/mock";
import { Icon } from "./Icon";
import type { Run, SetRun } from "./useMockRun";

export const OralPrep = ({
  run,
  setRun,
  setNow,
}: {
  run: Run;
  setRun: SetRun;
  setNow: (now: number) => void;
}) => (
  <Panel className="oral-prep">
    <Eyebrow>10 MINUTES TO PREPARE</Eyebrow>
    <h2>A moment to find your words.</h2>
    <p>
      Prepare tasks 1 and 2. You may make brief notes; practise speaking from ideas rather than
      reading a script.
    </p>
    {mockSections[3].questions.slice(0, 2).map((q) => (
      <div key={q.id}>
        <h3>{q.task}</h3>
        <p>{q.prompt}</p>
      </div>
    ))}
    <label>
      Your preparation notes
      <textarea
        rows={6}
        value={run.drafts.prep || ""}
        onChange={(e) => setRun((r) => ({ ...r, drafts: { ...r.drafts, prep: e.target.value } }))}
        placeholder="Nombre · nacionalidad · edad…"
      />
    </label>
    <Button
      variant="primary"
      onClick={() => {
        setNow(Date.now());
        setRun((r) => ({ ...r, stage: "run", deadline: Date.now() + 600000 }));
      }}
    >
      I’m ready · start speaking
      <Icon name="mic" />
    </Button>
  </Panel>
);
