import { FieldNote } from "../../design-system/FieldNote";
import type { Question } from "../../data/types";
import { FIELD } from "../../design-system/field";

type Props = {
  q: Question;
  fieldValues: Record<string, string>;
  feedback: boolean;
  words: number;
  onFieldChange: (label: string, text: string) => void;
};

export const FormFields = ({ q, fieldValues, feedback, words, onFieldChange }: Props) => (
  <div className="grid grid-cols-2 gap-4 max-md:gap-3.5 max-sm:grid-cols-1">
    {q.fields?.map((f) => (
      <label
        key={f.label}
        className="flex flex-col gap-2 text-sm text-olive-600 max-md:text-xs max-sm:text-sm"
      >
        {f.label}
        <input
          className={FIELD}
          lang="es"
          value={fieldValues[f.label] || ""}
          onChange={(e) => onFieldChange(f.label, e.target.value)}
          disabled={feedback}
          placeholder={f.example}
        />
      </label>
    ))}
    <FieldNote className="col-span-full">
      {words} words · target {q.minWords}–{q.maxWords}. Use fictional personal details.
    </FieldNote>
  </div>
);
