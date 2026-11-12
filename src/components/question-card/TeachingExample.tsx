import type { TeachExample } from "../../data/types";

type Props = { example: TeachExample };

export const TeachingExample = ({ example }: Props) => (
  <>
    <p lang="es">{example.es}</p>
    <p className="text-sm text-muted-foreground">{example.en}</p>
  </>
);
