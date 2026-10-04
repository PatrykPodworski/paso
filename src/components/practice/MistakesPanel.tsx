import { SkillDot } from "../SkillDot";
import { TONE } from "../tone";
import { Button } from "../../design-system/Button";
import { Panel } from "../../design-system/Panel";
import { TextLink } from "../../design-system/TextLink";
import type { Lesson } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { MemoryHint } from "../MemoryHint";
import type { Practice, Session } from "../practice";

type Props = {
  mistakeQuestions: Lesson["questions"];
  setSession: Session;
  practice: Practice;
};

export const MistakesPanel = ({ mistakeQuestions, setSession, practice }: Props) => (
  <Panel className="p-7">
    <span
      className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${TONE.peach}`}
    >
      <Icon name="repeat" size={28} />
    </span>
    <h2 className="font-serif text-2xl font-semibold tracking-tight leading-tight mt-4 mx-0 mb-3">
      {mistakeQuestions.length ? "Mistakes are little signposts." : "A fresh page. A fresh start."}
    </h2>
    <p className="leading-relaxed max-w-142 text-sm text-sage-500">
      {mistakeQuestions.length
        ? `${mistakeQuestions.length} questions are ready for another look. A correct answer without transcript assistance clears a question from this queue.`
        : "No mistakes waiting here yet. As you practise, tricky questions will collect here with their explanations."}
    </p>
    <Button
      variant="primary"
      className="my-5"
      onClick={() => practice(mistakeQuestions.length ? "mistakes" : "all")}
    >
      {mistakeQuestions.length ? "Review my mistakes" : "Try a daily mix"}
      <Icon name="arrow" />
    </Button>
    {mistakeQuestions.slice(0, 12).map((q) => (
      <details key={q.id} className="border-t border-t-sage-200 py-4 px-0">
        <summary className="cursor-pointer text-sm flex items-center gap-2">
          <SkillDot skill={q.skill} />
          {q.prompt}
        </summary>
        <p className="leading-relaxed my-3 text-sm text-sage-700">
          Correct answer: <strong>{q.answer}</strong>
        </p>
        <p className="leading-relaxed my-3 text-sm text-sage-700">{q.explanation}</p>
        <MemoryHint text={q.memoryHint} variant="mistake" />
        <TextLink
          onClick={() =>
            setSession({
              id: "review-one",
              title: "Another little chance",
              subtitle: "Mistake review",
              minutes: 2,
              icon: "repeat",
              questions: [q],
            })
          }
        >
          Try again
          <Icon name="arrow" size={15} />
        </TextLink>
      </details>
    ))}
  </Panel>
);
