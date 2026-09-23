import { Button } from "../design-system/Button";
import { CONTEXT_SIZE } from "../design-system/button-context-sizes";
import { useEffect, useRef, useState } from "react";
import { vocabulary } from "../data/curriculum";
import { localDate, reviewDue, vocabularyReview } from "../data/progress";
import type { Progress } from "../data/types";
import { AudioButton, stopAudio } from "./Audio";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";
import { MemoryHint } from "./MemoryHint";

type Word = (typeof vocabulary)[number];
type Review = Progress["vocabularyReviews"][string];
type Props = {
  progress: Progress;
  onReview: (word: string, review: Review) => void;
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

const VocabularySession = ({
  words,
  progress,
  onReview,
  onClose,
}: Omit<Props, "onLearn"> & {
  words: Word[];
  onClose: () => void;
}) => {
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
    word && vocabularyReview(progress.vocabularyReviews[word.es], true, now.toISOString());
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
    const review = vocabularyReview(progress.vocabularyReviews[word.es], correct);
    onReview(word.es, review);
    setResults((previous) => [...previous, { correct, review }]);
    setIndex((i) => i + 1);
    setRevealed(false);
  };
  return (
    <Dialog label="Vocabulary review" className="lesson-dialog vocabulary-dialog" onClose={onClose}>
      <header className="lesson-header">
        <button className="icon-button" aria-label="Close vocabulary review" onClick={onClose}>
          <Icon name="x" />
        </button>
        <div>
          <span className="eyebrow">POCKET VOCABULARY</span>
          <h3>A little Spanish, remembered.</h3>
        </div>
        <span className="lesson-counter">
          {Math.min(index + 1, words.length)} / {words.length}
        </span>
      </header>
      <div
        className="lesson-progress"
        role="progressbar"
        aria-label="Flashcards reviewed"
        aria-valuemin={0}
        aria-valuemax={words.length}
        aria-valuenow={results.length}
      >
        <div style={{ width: `${(results.length / words.length) * 100}%` }} />
      </div>
      {result && (
        <div className="flashcard-last-review" role="status">
          <strong lang="es">{words[index - 1].es}</strong>
          <span>
            Available to review {reviewWait(result.review.nextAt, now)} ·{" "}
            <time dateTime={result.review.nextAt}>{reviewDate(result.review.nextAt)}</time>
          </span>
        </div>
      )}
      {finished ? (
        <div className="session-complete">
          <Icon name="check" size={44} />
          <h2>Your review is complete.</h2>
          <p>Every card has its next review scheduled.</p>
          <div className="completion-stats">
            <div>
              <strong>{results.length}</strong>
              <span>reviewed</span>
            </div>
            <div>
              <strong>{results.filter((r) => r.correct).length}</strong>
              <span>remembered</span>
            </div>
            <div>
              <strong>{results.filter((r) => !r.correct).length}</strong>
              <span>to revisit</span>
            </div>
          </div>
          <p>
            Next review: <time dateTime={nextSessionReview}>{reviewDate(nextSessionReview)}</time>.
          </p>
          <Button ref={action} variant="primary" className="mt-[25px]" onClick={onClose}>
            Back to vocabulary <Icon name="arrow" />
          </Button>
        </div>
      ) : (
        <div className="flashcard-review">
          <div className="flashcard-prompt">
            <span className="eyebrow">
              UNIT {String(word.unit).padStart(2, "0")} · SPANISH → ENGLISH
            </span>
            <p>Can you remember the meaning?</p>
            <h2 lang="es">{word.es}</h2>
            <AudioButton key={word.es} text={word.es} label={`Play ${word.es}`} minimal autoPlay />
          </div>
          {revealed && (
            <div className="flashcard-answer">
              <span className="eyebrow">THE MEANING</span>
              <h3 lang="en">{word.en}</h3>
              <MemoryHint text={word.memoryHint} />
            </div>
          )}
          {!revealed ? (
            <div className="flashcard-actions">
              <p>Say the meaning to yourself, then reveal the answer.</p>
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
            <div className="flashcard-actions">
              <p>Did you get it right? Choose when this card returns.</p>
              <div className="flashcard-ratings">
                <Button ref={action} variant="secondary" sizeClasses={CONTEXT_SIZE.flashcardRatings} className="whitespace-normal" onClick={() => rate(false)}>
                  <Icon name="repeat" />
                  <span>
                    Got it wrong<small>Review in 10 min</small>
                  </span>
                </Button>
                <Button variant="primary" sizeClasses={CONTEXT_SIZE.flashcardRatings} className="whitespace-normal" onClick={() => rate(true)}>
                  <Icon name="check" />
                  <span>
                    Got it right<small>Review {reviewWait(nextRight.nextAt, now)}</small>
                  </span>
                </Button>
              </div>
            </div>
          )}
          <p className="flashcard-save-note">
            Your choices are saved as you go. You can leave at any time.
          </p>
        </div>
      )}
    </Dialog>
  );
};

export const PocketVocabulary = ({ progress, onReview, onLearn }: Props) => {
  const [search, setSearch] = useState("");
  const [session, setSession] = useState<Word[] | null>(null);
  const [now, setNow] = useState(() => new Date());
  const words = vocabulary.filter((w) => progress.completed[`u${w.unit}-words`]);
  const due = words
    .filter((w) => reviewDue(progress.vocabularyReviews[w.es], now))
    .sort((a, b) =>
      (progress.vocabularyReviews[a.es]?.nextAt ?? "").localeCompare(
        progress.vocabularyReviews[b.es]?.nextAt ?? "",
      ),
    );
  const scheduled = words.filter((w) => !reviewDue(progress.vocabularyReviews[w.es], now));
  const nextAt = scheduled.map((w) => progress.vocabularyReviews[w.es].nextAt).sort()[0];
  const reviewedToday = words.filter((w) => {
    const at = progress.vocabularyReviews[w.es]?.reviewedAt;
    return at && localDate(new Date(at)) === localDate(now);
  }).length;
  const newCount = words.filter((w) => !progress.vocabularyReviews[w.es]).length;
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
      <div className="section-heading word-heading">
        <div>
          <span className="eyebrow">A LITTLE PRACTICE, A LASTING MEMORY</span>
          <h2 id="vocabulary-title">Your pocket vocabulary</h2>
          <p>Words from your completed vocabulary lessons, ready to remember.</p>
        </div>
        <span className="pocket-icon" aria-hidden="true">
          <Icon name="layers" size={28} />
        </span>
      </div>
      <div className="vocabulary-overview">
        <dl className="vocabulary-stats">
          {[
            [due.length, "To review"],
            [reviewedToday, "Reviewed today"],
            [scheduled.length, "Scheduled"],
            [words.length, "Total flashcards"],
          ].map(([count, label]) => (
            <div key={label} className={label === "To review" ? "is-due" : ""}>
              <dt>{label}</dt>
              <dd>{count}</dd>
            </div>
          ))}
        </dl>
        <div className="vocabulary-start">
          <div>
            <h3>
              {!words.length
                ? "Your collection starts with a lesson."
                : due.length
                  ? "Ready for a little recall?"
                  : "You’re all caught up."}
            </h3>
            <p>
              {!words.length
                ? "Complete a vocabulary lesson to unlock all of its flashcards."
                : due.length
                  ? `${due.length} ${due.length === 1 ? "card is" : "cards are"} ready, including ${newCount} new. One at a time, at your pace.`
                  : "Your cards will return when it’s time to practise again."}
            </p>
            {nextAt && (
              <p>
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
              variant="primary" className="shrink-0"
              disabled={!due.length}
              onClick={() => setSession(due)}
            >
              Review flashcards <Icon name="arrow" />
            </Button>
          )}
        </div>
      </div>
      {words.length > 0 && (
        <div className="vocabulary-collection">
          <div className="section-heading">
            <div>
              <h3>Your flashcards</h3>
              <p>Every unlocked word, with its next review.</p>
            </div>
            <label className="search-field">
              <Icon name="search" size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a word…"
                aria-label="Search vocabulary"
              />
            </label>
          </div>
          {filtered.length ? (
            <ul className="vocabulary-list">
              {filtered.map((w) => {
                const entry = progress.vocabularyReviews[w.es];
                const isDue = reviewDue(entry, now);
                return (
                  <li key={w.es}>
                    <span className="vocabulary-word">
                      <strong lang="es">{w.es}</strong>
                      <span lang="en">{w.en}</span>
                    </span>
                    <span className="vocabulary-unit">Unit {String(w.unit).padStart(2, "0")}</span>
                    <span className={`vocabulary-availability ${isDue ? "is-due" : ""}`}>
                      <strong>
                        {isDue
                          ? entry
                            ? "Due now"
                            : "New · ready now"
                          : `Review ${reviewWait(entry.nextAt, now)}`}
                      </strong>
                      {entry && <time dateTime={entry.nextAt}>{reviewDate(entry.nextAt)}</time>}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty-state">
              <Icon name="search" />
              <h3>No word found yet.</h3>
              <p>Try a Spanish word or its English meaning.</p>
              <button className="text-link" onClick={() => setSearch("")}>
                Clear search
              </button>
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
