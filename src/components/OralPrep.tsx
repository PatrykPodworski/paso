import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { mockSections } from "../data/mock";
import { Icon } from "../design-system/Icon";

type Props = {
  notes: string;
  onNotes: (notes: string) => void;
  onReady: () => void;
};

export const OralPrep = ({ notes, onNotes, onReady }: Props) => (
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
        value={notes}
        onChange={(e) => onNotes(e.target.value)}
        placeholder="Nombre · nacionalidad · edad…"
      />
    </label>
    <Button variant="primary" onClick={onReady}>
      I’m ready · start speaking
      <Icon name="mic" />
    </Button>
  </Panel>
);
