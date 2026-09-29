import { FieldNote } from "../design-system/FieldNote";
import type { Question } from "../data/types";

export const FormFields = ({
  q,
  fieldValues,
  feedback,
  words,
  onFieldChange,
}: {
  q: Question;
  fieldValues: Record<string, string>;
  feedback: boolean;
  words: number;
  onFieldChange: (label: string, text: string) => void;
}) => (
  <div className="form-fields">
    {q.fields?.map((f) => (
      <label key={f.label}>
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
