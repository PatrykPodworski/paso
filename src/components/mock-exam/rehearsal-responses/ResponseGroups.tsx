import type { MockResponses } from "../../../data/types";
import { ObjectiveResponse } from "./ObjectiveResponse";
import { type ResponseEntry, responseGroups, savedText } from "./groupResponses";
import { SpeakingResponse } from "./SpeakingResponse";
import { WritingResponse } from "./WritingResponse";

type Props = { responses: MockResponses };

const Entry = ({ response, question }: ResponseEntry) => {
  if (response.section === 0 || response.section === 1) {
    return (
      <ObjectiveResponse question={question} answer={response.answer} correct={response.correct} />
    );
  }

  if (response.section === 2) {
    return <WritingResponse question={question} text={response.text} band={response.band} />;
  }

  return response.status === "scored" ? (
    <SpeakingResponse question={question} transcript={response.transcript} score={response.score} />
  ) : (
    <SpeakingResponse question={question} />
  );
};

const GROUP = "flex flex-col gap-4 border-bs border-border pbs-4";
const HEADING = "text-sm font-semibold";

// The responses of one rehearsal, by section.
export const ResponseGroups = ({ responses }: Props) => {
  const { groups, lost } = responseGroups(responses);

  return (
    <div className="flex flex-col gap-6 text-sm leading-relaxed">
      {groups.map(({ title, entries }) => (
        <section key={title} className={GROUP}>
          <h3 className={HEADING}>{title}</h3>
          {entries.map((entry) => (
            <Entry key={entry.response.questionId} {...entry} />
          ))}
        </section>
      ))}
      {lost.length > 0 && (
        <section className={GROUP}>
          <h3 className={HEADING}>This task is no longer in the exam</h3>
          {lost.map((response) => (
            <p key={response.questionId} className="whitespace-pre-wrap" lang="es">
              {savedText(response)}
            </p>
          ))}
        </section>
      )}
    </div>
  );
};
