import {
  answerDiff,
  type AnswerChange,
  type AnswerPiece,
  type CorrectPiece,
} from "../../data/answerDiff";

const MARK = "rounded-xs underline decoration-2 underline-offset-4";

const MissingMark = () => (
  <span className="relative">
    <svg
      viewBox="0 0 8 5"
      className="absolute start-0 inset-bs-full [inline-size:0.6em] [block-size:0.4em] -translate-x-1/2 overflow-visible stroke-destructive"
    >
      <path d="M0.5 4.5 4 0.5l3.5 4" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </span>
);

// A key for each piece from where it starts in its text; a missing mark takes no room there.
const keys = (pieces: { text: string; mark: string }[]) =>
  pieces.map(
    ({ mark }, i) =>
      `${pieces
        .slice(0, i)
        .reduce(
          (at, piece) => at + (piece.mark === "missing" ? 0 : piece.text.length),
          0,
        )}-${mark}`,
  );

type AnswerTextProps = { pieces: AnswerPiece[] };

const AnswerText = ({ pieces }: AnswerTextProps) => {
  const key = keys(pieces);

  return pieces.map((piece, i) =>
    piece.mark === "missing" ? (
      <MissingMark key={key[i]} />
    ) : piece.mark === "wrong" ? (
      <del key={key[i]} className={`${MARK} bg-destructive/15 decoration-destructive`}>
        {piece.text}
      </del>
    ) : (
      piece.text
    ),
  );
};

type CorrectTextProps = { pieces: CorrectPiece[] };

const CorrectText = ({ pieces }: CorrectTextProps) => {
  const key = keys(pieces);

  return pieces.map((piece, i) =>
    piece.mark === "changed" ? (
      <ins key={key[i]} className={`${MARK} bg-success/15 decoration-success`}>
        {piece.text}
      </ins>
    ) : (
      piece.text
    ),
  );
};

const changeText = ({ written, expected }: AnswerChange) =>
  !written
    ? `“${expected}” is missing`
    : !expected
      ? `“${written}” is extra`
      : `“${written}” should be “${expected}”`;

type Props = { answer: string; correct: string };

// The marks are hidden from screen readers, which read the plain answers and the changes instead.
export const AnswerComparison = ({ answer, correct }: Props) => {
  const diff = answerDiff(answer, correct);

  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 mbs-3 text-sm leading-loose">
      <dt>Your answer:</dt>
      <dd className="font-semibold">
        <span lang="es" className="sr-only">
          {answer}
        </span>
        <span lang="es" aria-hidden="true">
          <AnswerText pieces={diff.answer} />
        </span>
        {diff.changes.length > 0 && (
          <span className="sr-only"> Differences: {diff.changes.map(changeText).join("; ")}.</span>
        )}
      </dd>
      <dt>Correct answer:</dt>
      <dd className="font-semibold">
        <span lang="es" className="sr-only">
          {correct}
        </span>
        <span lang="es" aria-hidden="true">
          <CorrectText pieces={diff.correct} />
        </span>
      </dd>
    </dl>
  );
};
