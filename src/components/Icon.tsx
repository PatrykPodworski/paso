import type { CSSProperties } from "react";
const paths: Record<string, string> = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  chevron: "m9 5 7 7-7 7",
  down: "m6 9 6 6 6-6",
  check: "m5 12 4 4L19 6",
  x: "m6 6 12 12M18 6 6 18",
  sun: "M12 3V1m0 22v-2M3 12H1m22 0h-2M4 4 3 3m18 18-1-1M4 20l-1 1M21 3l-1 1M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  home: "m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7",
  map: "m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16",
  layers: "m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5",
  headphones: "M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v8h4v-8H4Zm16 0h2v8h-4v-8h2Z",
  mic: "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5Zm-3 6v1a6 6 0 0 0 12 0v-1m-6 7v4m-4 0h8",
  book: "M12 5v16M3 3c4 0 6 0 9 2 3-2 5-2 9-2v16c-4 0-6 0-9 2-3-2-5-2-9-2V3Z",
  pen: "m15 3 6 6-12 12H3v-6L15 3Zm-9 11 4 4M13 5l6 6",
  flag: "M4 22V3m0 1c6-5 10 5 16 0v10c-6 5-10-5-16 0",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z",
  repeat: "M20 7H6l3-3m-3 3 3 3M4 17h14l-3 3m3-3-3-3M20 7v5M4 17v-5",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-6v6l4 2",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  people:
    "M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10 1a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1 21v-3a6 6 0 0 1 12 0v3m1-6a5 5 0 0 1 9 3v3",
  coffee: "M3 7h13v9a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V7Zm13 1h2a4 4 0 0 1 0 8h-2M6 3V1m4 2V1m4 2V1",
  bag: "M4 7h16l1 14H3L4 7Zm4 0V5a4 4 0 0 1 8 0v2",
  heart: "M12 21 3 12a6 6 0 0 1 9-8 6 6 0 0 1 9 8l-9 9Z",
  train:
    "M5 17V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Zm0-7h14M8 14h.01M16 14h.01M8 19l-3 3m11-3 3 3",
  cloud: "M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12H6Z",
  volume: "m3 9 5 0 5-5v16l-5-5H3V9Zm14-2a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16",
  play: "m8 4 12 8-12 8V4Z",
  pause: "M8 4v16M16 4v16",
  trophy: "M7 3h10v8a5 5 0 0 1-10 0V3Zm0 2H3v3a5 5 0 0 0 5 5m9-8h4v3a5 5 0 0 1-5 5m-4 3v5m-5 0h10",
  settings:
    "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 1v3m0 17v2M1 12h3m17 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2",
  download: "M12 3v12m-5-5 5 5 5-5M3 17v4h18v-4",
  external: "M14 3h7v7m0-7L11 13M10 3H3v18h18v-7",
  flame: "M12 2c0 6 7 7 7 13a7 7 0 0 1-14 0c0-4 3-6 4-8 0 4 2 4 3 5 2-3 2-6 0-10Z",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6",
  info: "M12 11v6m0-10v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  menu: "M3 5h18M3 12h18M3 19h18",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z",
};
export const Icon = ({
  name,
  size = 20,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    style={style}
  >
    <path d={paths[name] || paths.spark} />
  </svg>
);
