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
  <Panel className="p-[32px] max-md:p-[25px]">
    <Eyebrow>10 MINUTES TO PREPARE</Eyebrow>
    <h2 className="font-serif text-[27px] font-semibold tracking-[-0.7px] leading-[1.25] mt-[10px] mb-[15px] max-md:text-[28px]">
      A moment to find your words.
    </h2>
    <p className="leading-[1.7] text-[14px] text-[#8c9b7b]">
      Prepare tasks 1 and 2. You may make brief notes; practise speaking from ideas rather than
      reading a script.
    </p>
    {mockSections[3].questions.slice(0, 2).map((q) => (
      <div key={q.id} className="my-[24px] rounded-[8px] bg-[#f5f7ef] p-[20px]">
        <h3 className="text-[17px] font-semibold tracking-[-0.3px]">{q.task}</h3>
        <p className="leading-[1.7] mt-[9px] text-[14px] text-[#859573]">{q.prompt}</p>
      </div>
    ))}
    <label className="text-[15px] block text-[#8a987b]">
      Your preparation notes
      <textarea
        className={`${FIELD} leading-[1.7] mt-[10px] mb-[20px]`}
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
