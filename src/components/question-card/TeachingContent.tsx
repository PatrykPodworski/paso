import type { TeachContent } from "../../data/types";
import { TeachingExample } from "./TeachingExample";

type Props = { teach: TeachContent };

// The meaning sits beside the word while the card is wide enough, and under it otherwise.
export const TeachingContent = ({ teach }: Props) => (
  <div className="flex flex-col gap-5 text-base leading-relaxed max-w-prose">
    {teach.rule && <p>{teach.rule}</p>}
    {teach.terms && (
      <dl className="@container flex flex-col gap-5">
        {teach.terms.map((term) => (
          <div key={term.es} className="grid gap-x-6 @sm:grid-cols-3">
            <dt lang="es" className="font-semibold">
              {term.es}
            </dt>
            <dd className="@sm:col-span-2">{term.meaning}</dd>
            {term.example && (
              <dd className="col-span-full ps-4 mbs-1">
                <TeachingExample example={term.example} />
              </dd>
            )}
            {term.note && (
              <dd className="col-span-full text-sm text-muted-foreground mbs-1">{term.note}</dd>
            )}
          </div>
        ))}
      </dl>
    )}
    {teach.examples && (
      <ul className="flex flex-col gap-3 ps-4">
        {teach.examples.map((example) => (
          <li key={example.es}>
            <TeachingExample example={example} />
          </li>
        ))}
      </ul>
    )}
  </div>
);
