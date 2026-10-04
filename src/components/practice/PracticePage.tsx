import { Badge } from "../../design-system/Badge";
import { Eyebrow } from "../../design-system/Eyebrow";
import { PageHeading } from "../../design-system/PageHeading";
import type { Lesson, Progress, Skill } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { MistakesPanel } from "./MistakesPanel";
import type { Page } from "../navigation";
import { PocketVocabulary } from "../PocketVocabulary";
import { exerciseBank, skills, type Practice, type Session } from "../practice";
import { SkillPractice } from "./SkillPractice";
import { PRESSABLE } from "../../design-system/pressable";

type Props = {
  progress: Progress;
  setProgress: (update: (p: Progress) => Progress) => void;
  mistakeQuestions: Lesson["questions"];
  filter: Skill | "all" | "mistakes";
  setFilter: (filter: Skill | "all" | "mistakes") => void;
  setSession: Session;
  navigate: (target: Page) => void;
  practice: Practice;
};

export const PracticePage = ({
  progress,
  setProgress,
  mistakeQuestions,
  filter,
  setFilter,
  setSession,
  navigate,
  practice,
}: Props) => (
  <>
    <PageHeading
      eyebrow={
        <Eyebrow variant="page" className="mb-[9px]">
          MORE PLAY. MORE PRACTICE. MORE YOU.
        </Eyebrow>
      }
      title="Your practice studio."
      description="Follow your curiosity, or give a tricky word another chance."
    >
      <Badge className="max-md:hidden">
        <Icon name="spark" size={16} />
        {exerciseBank.length} exercises to explore
      </Badge>
    </PageHeading>
    <div
      className="flex flex-wrap gap-[7px] max-md:gap-[5px] border-b border-b-sage-200 pb-[19px] max-md:pb-[15px] mb-[23px]"
      role="group"
      aria-label="Filter practice by skill"
    >
      {(["all", ...skills.map((s) => s.id), "mistakes"] as const).map((s) => (
        <button
          key={s}
          className={`${PRESSABLE} border border-transparent rounded-[20px] p-[9px_15px] max-md:p-[8px_12px] text-[14px] max-md:text-[12px] ${filter === s ? "bg-green-900 text-white" : "bg-transparent text-[#8a967d] hover:bg-[#edf1e5]"}`}
          onClick={() => setFilter(s)}
        >
          {s === "all"
            ? "All skills"
            : s === "mistakes"
              ? `My mistakes (${mistakeQuestions.length})`
              : s[0].toUpperCase() + s.slice(1)}
        </button>
      ))}
    </div>
    {filter === "mistakes" ? (
      <MistakesPanel
        mistakeQuestions={mistakeQuestions}
        setSession={setSession}
        practice={practice}
      />
    ) : (
      <SkillPractice
        progress={progress}
        filter={filter}
        setSession={setSession}
        practice={practice}
      />
    )}
    <PocketVocabulary
      progress={progress}
      onReview={(word, review) =>
        setProgress((p) => ({
          ...p,
          vocabularyReviews: { ...p.vocabularyReviews, [word]: review },
        }))
      }
      onAddWords={(entries) =>
        setProgress((p) => ({
          ...p,
          vocabularyReviews: { ...p.vocabularyReviews, ...entries },
        }))
      }
      onLearn={() => navigate("path")}
    />
  </>
);
