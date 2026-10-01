import { FieldNote } from "../../design-system/FieldNote";
import type { Question } from "../../data/types";

type Props = {
  q: Question;
  fieldValues: Record<string, string>;
  feedback: boolean;
  words: number;
  onFieldChange: (label: string, text: string) => void;
};

export const FormFields = ({ q, fieldValues, feedback, words, onFieldChange }: Props) => (
  <div className="grid grid-cols-[1fr_1fr] gap-[17px] max-md:gap-[14px] max-sm:grid-cols-[1fr]">
    {q.fields?.map((f) => (
      <label
        key={f.label}
        className="flex flex-col gap-[8px] text-[14px] text-[#84986f] max-md:text-[13px] max-sm:text-[14px]"
      >
        {f.label}
        <input
          lang="es"
          value={fieldValues[f.label] || ""}
          onChange={(e) => onFieldChange(f.label, e.target.value)}
          disabled={feedback}
          placeholder={f.example}
        />
      </label>
    ))}
    <FieldNote className="col-[1/-1]">
      {words} words · target {q.minWords}–{q.maxWords}. Use fictional personal details.
    </FieldNote>
  </div>
);
