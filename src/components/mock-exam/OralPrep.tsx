import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { mockSections } from "../../data/mock";
import { Icon } from "../../design-system/Icon";
import type { Run, SetRun } from "./useMockRun";
import { FIELD } from "../../design-system/field";

type Props = {
  run: Run;
  setRun: SetRun;
  setNow: (now: number) => void;
};

export const OralPrep = ({ run, setRun, setNow }: Props) => (
  <Panel className="p-8 max-md:p-6">
    <Eyebrow>10 MINUTES TO PREPARE</Eyebrow>
    <h2 className="font-serif text-2xl font-semibold tracking-tight leading-tight mt-2.5 mb-3.5 max-md:text-3xl">
      A moment to find your words.
    </h2>
    <p className="leading-relaxed text-sm text-sage-500">
      Prepare tasks 1 and 2. You may make brief notes; practise speaking from ideas rather than
      reading a script.
    </p>
    {mockSections[3].questions.slice(0, 2).map((q) => (
      <div key={q.id} className="my-6 rounded-lg bg-sage-50 p-5">
        <h3 className="text-base font-semibold tracking-tight">{q.task}</h3>
        <p className="leading-relaxed mt-2 text-sm text-sage-600">{q.prompt}</p>
      </div>
    ))}
    <label className="text-sm block text-sage-600">
      Your preparation notes
      <textarea
        className={`${FIELD} leading-relaxed mt-2.5 mb-5`}
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
