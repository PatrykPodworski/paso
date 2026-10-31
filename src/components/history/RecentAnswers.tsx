import type { Attempt } from "../../data/types";
import { Eyebrow } from "../../design-system/Eyebrow";
import { SectionHeading } from "../../design-system/SectionHeading";
import { exerciseBank } from "../practice";
import { SkillDot } from "../SkillDot";
import { answerResult } from "./answerResult";

const questions = new Map(exerciseBank.map((q) => [q.id, q]));

type Props = { recent: Attempt[] };

// The learner's last answers across all tasks, newest first. Answers to questions no
// longer in the course are left out.
export const RecentAnswers = ({ recent }: Props) => {
  const rows = recent.flatMap((a) => {
    const q = questions.get(a.questionId);

    return q ? [{ a, q }] : [];
  });

  if (!rows.length) {
    return null;
  }

  return (
    <section aria-labelledby="recent-answers-title">
      <SectionHeading
        variant="word"
        eyebrow={<Eyebrow>EVERY ANSWER COUNTS</Eyebrow>}
        title="Recent answers"
        titleId="recent-answers-title"
        text="Your latest answers across all tasks, newest first."
      />
      <ol className="border border-sage-200 rounded-2xl bg-white px-6 max-md:px-4">
        {rows.map(({ a, q }) => {
          const result = answerResult(a.correct);

          return (
            <li
              key={a.id}
              className="flex items-start gap-3 py-3.5 border-t border-t-sage-200 first:border-t-0"
            >
              <span className="mt-2">
                <SkillDot skill={q.skill} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">{q.prompt}</p>
                {a.answer && (
                  <p className="mt-1 text-xs leading-relaxed text-sage-600 line-clamp-2 break-words whitespace-pre-line">
                    {a.answer}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className={`text-xs font-medium ${result.tone}`}>{result.label}</p>
                <time dateTime={a.at} className="block mt-1 text-2xs text-sage-400">
                  {new Date(a.at).toLocaleDateString()}
                </time>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
