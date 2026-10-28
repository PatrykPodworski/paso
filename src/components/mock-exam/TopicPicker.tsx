import { mockTopics, type MockTopic } from "../../data/mock";
import { CHECKBOX } from "../../design-system/field";

type Props = {
  topic: MockTopic | undefined;
  onPick: (topic: MockTopic) => void;
};

export const TopicPicker = ({ topic, onPick }: Props) => (
  <fieldset className="mbe-5 rounded-lg bg-sage-50 p-5 max-md:p-4">
    <legend className="float-left mbe-3 text-xs uppercase tracking-widest text-sage-600">
      Your topic for Tasks 2 and 3
    </legend>
    <div className="clear-both flex flex-col gap-2.5">
      {mockTopics.map((t) => (
        <label
          key={t.id}
          className="flex items-start gap-2.5 text-sm leading-relaxed text-sage-800"
        >
          <input
            type="radio"
            name="mock-topic"
            className={`${CHECKBOX} mt-1 mr-0.5 mb-0.5 ml-1`}
            checked={topic === t.id}
            onChange={() => onPick(t.id)}
          />
          <span>
            {t.label} <span className="text-sage-600">· {t.points}</span>
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);
