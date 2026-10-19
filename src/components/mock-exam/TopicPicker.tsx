import { mockTopics, type MockTopic } from "../../data/mock";
import { CHECKBOX } from "../../design-system/field";

type Props = {
  topic: MockTopic | undefined;
  onPick: (topic: MockTopic) => void;
};

export const TopicPicker = ({ topic, onPick }: Props) => (
  <fieldset className="mbe-5 rounded-[9px] bg-sage-50 p-[19px_20px] max-md:p-[16px]">
    <legend className="float-left mbe-[13px] text-[12px] uppercase tracking-[1.4px] text-sage-600">
      Your topic for Tasks 2 and 3
    </legend>
    <div className="clear-both flex flex-col gap-[10px]">
      {mockTopics.map((t) => (
        <label
          key={t.id}
          className="flex items-start gap-[10px] text-[14px] leading-[1.7] text-sage-800"
        >
          <input
            type="radio"
            name="mock-topic"
            className={`${CHECKBOX} m-[4px_3px_3px_4px]`}
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
