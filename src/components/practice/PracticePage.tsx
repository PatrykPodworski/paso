import { Badge } from "../../design-system/Badge";
import { Eyebrow } from "../../design-system/Eyebrow";
import { PageHeading } from "../../design-system/PageHeading";
import type { Lesson, ProgressSnapshot, Skill, VocabularyReview } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { MistakesPanel } from "./MistakesPanel";
import type { Page } from "../navigation";
import { PocketVocabulary } from "../PocketVocabulary";
import { exerciseBank, skills, type Practice, type Session } from "../practice";
import { SkillPractice } from "./SkillPractice";
import { RecentAnswers } from "../history/RecentAnswers";
import { PRESSABLE } from "../../design-system/pressable";

type Props = {
  progress: ProgressSnapshot;
  onVocabulary: (reviews: Record<string, VocabularyReview>) => void;
  mistakeQuestions: Lesson["questions"];
  filter: Skill | "all" | "mistakes";
  setFilter: (filter: Skill | "all" | "mistakes") => void;
  setSession: Session;
  navigate: (target: Page) => void;
  practice: Practice;
};

export const PracticePage = ({
  progress,
  onVocabulary,
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
        <Eyebrow variant="page" className="mb-2">
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
      className="flex flex-wrap gap-1.5 max-md:gap-1 border-b border-b-border pb-5 max-md:pb-3.5 mb-6"
      role="group"
      aria-label="Filter practice by skill"
    >
      {(["all", ...skills.map((s) => s.id), "mistakes"] as const).map((s) => (
        <button
          key={s}
          className={`${PRESSABLE} border border-transparent rounded-2xl py-2 px-3.5 max-md:py-2 max-md:px-3 text-sm max-md:text-xs ${filter === s ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
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
    <RecentAnswers recent={progress.recent} />
    <PocketVocabulary
      progress={progress}
      onReview={(word, review) => onVocabulary({ [word]: review })}
      onAddWords={onVocabulary}
      onLearn={() => navigate("path")}
    />
  </>
);
