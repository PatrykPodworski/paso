import { CompletionStats } from "./CompletionStats";
import { Eyebrow } from "../design-system/Eyebrow";
import { SectionHeading } from "../design-system/SectionHeading";
import { Button } from "../design-system/Button";
import { useEffect, useRef, useState } from "react";
import { localDate, reviewDue, vocabularyReview } from "../data/progress";
import { type Card, WORDS_PER_ADD, addWords, deckCards, topicCounts, topics } from "../data/topics";
import type { Progress } from "../data/types";
import { AudioButton } from "./audio/AudioButton";
import { stopAudio } from "./audio/playback";
import { Dialog } from "../design-system/Dialog";
import { Icon } from "../design-system/Icon";
import { IconButton } from "../design-system/IconButton";
import { ProgressTrack } from "../design-system/ProgressTrack";
import { MemoryHint } from "./MemoryHint";
import { TextLink } from "../design-system/TextLink";
import { FIELD } from "../design-system/field";

type Review = Progress["vocabularyReviews"][string];
type Props = {
  progress: Progress;
  onReview: (word: string, review: Review) => void;
  onAddWords: (entries: Progress["vocabularyReviews"]) => void;
  onLearn: () => void;
};

const reviewDate = (at: string) =>
  new Date(at).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const reviewWait = (at: string, now: Date) => {
  const minutes = Math.max(1, Math.round((new Date(at).getTime() - now.getTime()) / 60_000));

  if (minutes < 60) {
    return `in ${minutes} min`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  const days = Math.round(hours / 24);

  return `in ${days} ${days === 1 ? "day" : "days"}`;
};

type VocabularySessionProps = Omit<Props, "onLearn" | "onAddWords"> & {
  words: Card[];
  onClose: () => void;
};

const VocabularySession = ({ words, progress, onReview, onClose }: VocabularySessionProps) => {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; review: Review }[]>([]);
  const ratingLock = useRef(false);
  const action = useRef<HTMLButtonElement>(null);
  const word = words[index];
  const finished = index === words.length;
  const result = results[index - 1];
  const nextSessionReview = results.map((r) => r.review.nextAt).sort()[0];
  const now = new Date();

  const nextRight =
    word && vocabularyReview(progress.vocabularyReviews[word.id], true, now.toISOString());

  useEffect(() => {
    action.current?.focus();
  }, [index, revealed]);

  useEffect(() => () => stopAudio(), []);

  const rate = (correct: boolean) => {
    if (!revealed || ratingLock.current) {
      return;
    }

    ratingLock.current = true;
    stopAudio();
    const review = vocabularyReview(progress.vocabularyReviews[word.id], correct);

    onReview(word.id, review);
    setResults((previous) => [...previous, { correct, review }]);
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <Dialog
      label="Vocabulary review"
      className="w-[min(810px,calc(100vw-36px))] max-md:w-[calc(100vw_-_22px)]"
      onClose={onClose}
    >
      <header className="flex items-center gap-[16px] p-[22px_26px] max-md:p-[18px] max-md:gap-[12px]">
        <IconButton aria-label="Close vocabulary review" onClick={onClose}>
          <Icon name="x" />
        </IconButton>
        <div className="flex-1">
          <Eyebrow variant="small" className="mb-[5px]">
            POCKET VOCABULARY
          </Eyebrow>
          <h3 className="font-semibold tracking-[-0.3px] text-[15px] max-md:text-[14px]">
            A little Spanish, remembered.
          </h3>
        </div>
        <span className="text-[14px] text-sage-400 max-md:text-[12px]">
          {Math.min(index + 1, words.length)} / {words.length}
        </span>
      </header>
      <ProgressTrack value={results.length} max={words.length} label="Flashcards reviewed" />
      {result && (
        <div
          className="flex flex-wrap gap-[4px_12px] p-[12px_20px] text-[12px] leading-[1.6] text-sage-800 bg-sage-100"
          role="status"
        >
          <strong lang="es">{words[index - 1].es}</strong>
          <span>
            Available to review {reviewWait(result.review.nextAt, now)} ·{" "}
            <time dateTime={result.review.nextAt}>{reviewDate(result.review.nextAt)}</time>
          </span>
        </div>
      )}
      {finished ? (
        <div className="p-[50px_30px] text-center max-md:p-[35px_20px]">
          <Icon name="check" size={44} />
          <h2 className="font-serif font-semibold tracking-[-0.7px] leading-[1.25] text-[39px] m-[12px_0] max-md:text-[34px]">
            Your review is complete.
          </h2>
          <p className="leading-[1.7] text-[14px] text-sage-500 mt-[13px]">
            Every card has its next review scheduled.
          </p>
          <CompletionStats
            stats={[
              ["reviewed", results.length],
              ["remembered", results.filter((r) => r.correct).length],
              ["to revisit", results.filter((r) => !r.correct).length],
            ]}
          />
          <p className="leading-[1.7] text-[14px] text-sage-500 mt-[13px]">
            Next review: <time dateTime={nextSessionReview}>{reviewDate(nextSessionReview)}</time>.
          </p>
          <Button ref={action} variant="primary" className="mt-[25px]" onClick={onClose}>
            Back to vocabulary <Icon name="arrow" />
          </Button>
        </div>
      ) : (
        <div className="p-[28px_36px] max-sm:p-[20px_16px]">
          <div className="text-center p-[24px_16px] border border-sage-200 rounded-[16px] bg-white max-sm:p-[20px_12px]">
            <Eyebrow>{word.topic.toLocaleUpperCase()} · SPANISH → ENGLISH</Eyebrow>
            <p className="leading-[1.7] text-sage-800 text-[14px] mt-[24px]">
              Can you remember the meaning?
            </p>
            <h2
              lang="es"
              className="font-semibold tracking-[-0.7px] leading-[1.25] font-serif text-3xl sm:text-4xl md:text-5xl m-[18px_0] wrap-anywhere"
            >
              {word.es}
            </h2>
            <AudioButton
              key={word.id}
              text={word.es}
              label={`Play ${word.es}`}
              minimal
              round="word"
              className="justify-center"
              autoPlay
            />
          </div>
          {revealed && (
            <div className="mt-[20px] p-[20px] rounded-[12px] bg-sage-100">
              <Eyebrow>THE MEANING</Eyebrow>
              <h3
                lang="en"
                className="font-semibold tracking-[-0.3px] font-serif text-[26px] mt-[8px]"
              >
                {word.en}
              </h3>
              {word.example && (
                <div className="mt-[16px]">
                  <p lang="es" className="text-[16px] leading-[1.6]">
                    {word.example.es}
                  </p>
                  <p lang="en" className="text-[14px] leading-[1.6] text-sage-800">
                    {word.example.en}
                  </p>
                  {/* Starting this clip stops the word clip through stopAudio(). */}
                  <AudioButton
                    text={word.example.es}
                    label="Play example sentence"
                    minimal
                    autoPlay
                  />
                </div>
              )}
              <MemoryHint text={word.memoryHint} />
            </div>
          )}
          {!revealed ? (
            <div className="flex flex-col gap-[16px] mt-[24px]">
              <p className="text-[14px] text-sage-800 leading-[1.6]">
                Say the meaning to yourself, then reveal the answer.
              </p>
              <Button
                ref={action}
                variant="primary"
                onClick={() => {
                  ratingLock.current = false;
                  setRevealed(true);
                }}
              >
                Reveal answer <Icon name="down" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-[16px] mt-[24px]">
              <p className="text-[14px] text-sage-800 leading-[1.6]">
                Did you get it right? Choose when this card returns.
              </p>
              <div className="grid grid-cols-[1fr_1fr] gap-[12px]">
                <Button
                  ref={action}
                  variant="secondary"
                  size="small"
                  className="whitespace-normal"
                  onClick={() => rate(false)}
                >
                  <Icon name="repeat" />
                  <span>
                    Got it wrong
                    <small className="block mt-[5px] text-[12px] font-normal">
                      Review in 10 min
                    </small>
                  </span>
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  className="whitespace-normal"
                  onClick={() => rate(true)}
                >
                  <Icon name="check" />
                  <span>
                    Got it right
                    <small className="block mt-[5px] text-[12px] font-normal">
                      Review {reviewWait(nextRight.nextAt, now)}
                    </small>
                  </span>
                </Button>
              </div>
            </div>
          )}
          <p className="text-center text-[12px] leading-[1.6] text-sage-800 mt-[20px]">
            Your choices are saved as you go. You can leave at any time.
          </p>
        </div>
      )}
    </Dialog>
  );
};

export const PocketVocabulary = ({ progress, onReview, onAddWords, onLearn }: Props) => {
  const [search, setSearch] = useState("");
  const [session, setSession] = useState<Card[] | null>(null);
  const [now, setNow] = useState(() => new Date());
  const words = deckCards(progress);

  const due = words
    .filter((w) => reviewDue(progress.vocabularyReviews[w.id], now))
    .sort((a, b) =>
      (progress.vocabularyReviews[a.id]?.nextAt ?? "").localeCompare(
        progress.vocabularyReviews[b.id]?.nextAt ?? "",
      ),
    );

  const scheduled = words.filter((w) => !reviewDue(progress.vocabularyReviews[w.id], now));
  const nextAt = scheduled.map((w) => progress.vocabularyReviews[w.id].nextAt).sort()[0];

  const reviewedToday = words.filter((w) => {
    const at = progress.vocabularyReviews[w.id]?.reviewedAt;

    return at && localDate(new Date(at)) === localDate(now);
  }).length;

  const newCount = due.filter((w) => !progress.vocabularyReviews[w.id]?.reviewedAt).length;

  const filtered = words.filter((w) =>
    `${w.es} ${w.en}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  // Refresh at the next due time, on return to the tab, and across midnight.
  useEffect(() => {
    const refresh = () => setNow(new Date());

    const delay = Math.min(
      60_000,
      Math.max(1, nextAt ? new Date(nextAt).getTime() - Date.now() : 60_000),
    );

    const timer = window.setInterval(refresh, delay);

    window.addEventListener("focus", refresh);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [now, nextAt]);

  return (
    <section className="pocket-vocabulary" aria-labelledby="vocabulary-title">
      <SectionHeading
        variant="word"
        eyebrow={<Eyebrow>A LITTLE PRACTICE, A LASTING MEMORY</Eyebrow>}
        title="Your pocket vocabulary"
        titleId="vocabulary-title"
        text="Words from your completed vocabulary lessons, ready to remember."
      >
        <span
          className="grid place-items-center shrink-0 w-[56px] h-[56px] rounded-[16px] bg-sage-100 text-green-900 max-sm:hidden"
          aria-hidden="true"
        >
          <Icon name="layers" size={28} />
        </span>
      </SectionHeading>
      <div className="border border-sage-200 rounded-[16px] overflow-hidden bg-white">
        <dl className="vocabulary-stats grid grid-cols-[repeat(4,1fr)] m-0 border-b border-sage-200 max-sm:grid-cols-[repeat(2,1fr)]">
          {[
            [due.length, "To review"],
            [reviewedToday, "Reviewed today"],
            [scheduled.length, "Scheduled"],
            [words.length, "Total flashcards"],
          ].map(([count, label], i) => (
            <div
              key={label}
              className={`flex flex-col-reverse gap-[7px] p-[24px] max-sm:p-[20px] border-sage-200 ${i > 0 ? "border-l" : ""} ${i === 2 ? "max-sm:border-l-0" : ""} ${i >= 2 ? "max-sm:border-t" : ""} ${label === "To review" ? "bg-sage-100" : ""}`}
            >
              <dt className="text-[12px] text-sage-800">{label}</dt>
              <dd className="m-0 font-serif text-[36px] leading-[1] text-green-900">{count}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between gap-[24px] p-[24px] max-sm:items-stretch max-sm:flex-col max-sm:p-[20px] max-sm:gap-[18px]">
          <div>
            <h3 className="font-semibold tracking-[-0.3px] text-[17px]">
              {!words.length
                ? "Your collection starts with a lesson."
                : due.length
                  ? "Ready for a little recall?"
                  : "You’re all caught up."}
            </h3>
            <p className="text-[13px] leading-[1.6] text-sage-800 mt-[6px]">
              {!words.length
                ? "Add words from a topic below or complete a vocabulary lesson."
                : due.length
                  ? `${due.length} ${due.length === 1 ? "card is" : "cards are"} ready, including ${newCount} new. One at a time, at your pace.`
                  : "Your cards will return when it’s time to practise again."}
            </p>
            {nextAt && (
              <p className="text-[13px] leading-[1.6] text-sage-800 mt-[6px]">
                Next scheduled review: <time dateTime={nextAt}>{reviewDate(nextAt)}</time>
              </p>
            )}
          </div>
          {!words.length ? (
            <Button variant="primary" className="shrink-0" onClick={onLearn}>
              Explore lessons <Icon name="arrow" />
            </Button>
          ) : (
            <Button
              variant="primary"
              className="shrink-0"
              disabled={!due.length}
              onClick={() => setSession(due)}
            >
              Review flashcards <Icon name="arrow" />
            </Button>
          )}
        </div>
      </div>
      <section className="mt-6" aria-labelledby="topics-title">
        <h3 className="text-[17px] font-semibold tracking-[-0.3px]" id="topics-title">
          Topics
        </h3>
        <ul className="m-0 mt-3 list-none p-0 rounded-2xl border border-sage-200 bg-white">
          {topics.map(({ topic, optional, cards }, index) => {
            const counts = topicCounts(cards, progress);
            const adding = Math.min(WORDS_PER_ADD, counts.new);

            return (
              <li
                key={topic}
                tabIndex={-1}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-sage-200 px-4 py-3 not-first:border-t focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-coral-500"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <span id={`topic-${index}`}>{topic}</span>
                  {optional && (
                    <span className="rounded-full border border-sage-200 px-2 text-xs font-normal text-sage-700">
                      Optional
                    </span>
                  )}
                </span>
                <span className="flex gap-3 text-xs text-sage-700 max-sm:col-span-2">
                  {(["total", "learning", "new", "known"] as const).map((key) => (
                    <span key={key}>
                      {counts[key]} {key}
                    </span>
                  ))}
                </span>
                <Button
                  variant="secondary"
                  size="small"
                  className="col-start-2 row-start-1 row-end-3 max-sm:row-end-2"
                  disabled={!adding}
                  aria-describedby={`topic-${index}`}
                  onClick={(e) => {
                    onAddWords(addWords(cards, progress));
                    setNow(new Date());

                    // Disabling the focused button would drop focus to <body>.
                    if (adding === counts.new) {
                      e.currentTarget.closest("li")!.focus();
                    }
                  }}
                >
                  {adding ? `Add ${adding} ${adding === 1 ? "word" : "words"}` : "All added"}
                </Button>
              </li>
            );
          })}
        </ul>
      </section>
      {words.length > 0 && (
        <div className="mt-[26px]">
          <SectionHeading
            variant="collection"
            title="Your flashcards"
            titleId="flashcards-title"
            text="Every unlocked word, with its next review."
          >
            <label className="text-[15px] flex items-center gap-[8px] bg-white border border-sage-200 rounded-[8px] pl-[11px] w-[210px] max-md:w-full text-sage-400">
              <Icon name="search" size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a word…"
                aria-label="Search vocabulary"
                className={`${FIELD} border-0! outline-none! p-[10px_10px_10px_0]! bg-transparent! text-[14px]`}
              />
            </label>
          </SectionHeading>
          {filtered.length ? (
            <ul
              aria-labelledby="flashcards-title"
              className="vocabulary-list list-none p-0 m-0 max-h-[380px] overflow-y-auto border border-sage-200 rounded-[12px] bg-white"
            >
              {filtered.map((w) => {
                const entry = progress.vocabularyReviews[w.id];
                const isDue = reviewDue(entry, now);
                const isNew = isDue && !entry?.reviewedAt;

                return (
                  <li
                    key={w.id}
                    className="grid grid-cols-[minmax(0,1fr)_70px_minmax(150px,auto)] items-center gap-[20px] p-[16px_20px] border-sage-200 not-first:border-t max-sm:grid-cols-[minmax(0,1fr)_minmax(120px,auto)] max-sm:p-[16px] max-sm:gap-[8px_12px]"
                  >
                    <span className="flex flex-col gap-[5px]">
                      <strong lang="es" className="font-serif text-[18px] wrap-anywhere">
                        {w.es}
                      </strong>
                      <span lang="en" className="text-[12px] text-sage-800">
                        {w.en}
                      </span>
                    </span>
                    <span className="text-[12px] text-sage-800 max-sm:col-[1] max-sm:row-[2]">
                      {w.topic}
                    </span>
                    <span className="flex flex-col gap-[5px] text-[12px] text-sage-800 items-end text-right max-sm:col-[2] max-sm:row-[1/3]">
                      <strong className={isDue ? "text-green-900" : ""}>
                        {isNew
                          ? "New · ready now"
                          : isDue
                            ? "Due now"
                            : `Review ${reviewWait(entry.nextAt, now)}`}
                      </strong>
                      {!isNew && <time dateTime={entry.nextAt}>{reviewDate(entry.nextAt)}</time>}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center p-[40px] text-sage-500">
              <Icon name="search" className="mx-auto mb-[15px]" />
              <h3 className="text-[17px] font-semibold tracking-[-0.3px]">No word found yet.</h3>
              <p className="leading-[1.7] text-[14px] m-[10px_0]">
                Try a Spanish word or its English meaning.
              </p>
              <TextLink onClick={() => setSearch("")}>Clear search</TextLink>
            </div>
          )}
        </div>
      )}
      {session && (
        <VocabularySession
          words={session}
          progress={progress}
          onReview={(word, review) => {
            onReview(word, review);
            setNow(new Date());
          }}
          onClose={() => {
            setSession(null);
            setNow(new Date());
          }}
        />
      )}
    </section>
  );
};
