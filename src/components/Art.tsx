export const JourneyArt = () => (
  <svg
    viewBox="0 0 600 410"
    role="img"
    aria-label="A sunlit Spanish village with terracotta rooftops, an orange tree and a winding path to a flag"
    className="journey-art"
  >
    <defs>
      <pattern
        id="tile"
        width="32"
        height="18"
        patternUnits="userSpaceOnUse"
        patternTransform="skewX(-30)"
      >
        <rect width="32" height="18" fill="#ead7b5" />
        <rect width="16" height="9" fill="#dcc295" />
        <rect x="16" y="9" width="16" height="9" fill="#dcc295" />
      </pattern>
      <linearGradient id="sky" x2="0" y2="1">
        <stop stopColor="#eddec4" />
        <stop offset="1" stopColor="#f4e7d0" />
      </linearGradient>
      <linearGradient id="wall" x2="1" y2="1">
        <stop stopColor="#f9f2dc" />
        <stop offset="1" stopColor="#efdbba" />
      </linearGradient>
    </defs>
    <circle cx="350" cy="183" r="170" fill="url(#sky)" />
    <circle cx="448" cy="78" r="40" fill="#e5a15c" />
    <path d="M91 257Q228 148 339 200T590 205V344H80Z" fill="#bec8a0" />
    <path d="M280 245q181-90 320 32v90H220Z" fill="#8ba58c" />
    <path d="M62 333q98-59 205-18t155 3q67-29 147-8v58H60Z" fill="#d4b68b" />
    <path
      d="M374 240c-14 35-78 36-46 63 23 20 103 21 97 48l-92 25c41-45-104-38-93-86 9-32 89-31 87-53Z"
      fill="#f6ecd7"
    />
    <ellipse cx="230" cy="342" rx="156" ry="25" fill="#537665" opacity=".13" />
    <path d="m100 282 107-37 162 62-93 63-185-29Z" fill="url(#tile)" />
    <path d="M187 143h108v165H187Z" fill="url(#wall)" />
    <path d="m295 143 43 27v159l-43-21Z" fill="#d4bb98" />
    <path d="m174 146 62-46 77 35-18 15Z" fill="#c2694e" />
    <path d="m236 100 70 14 45 58-39-21Z" fill="#a95642" />
    <path d="M198 167h24v36h-24Zm60 0h24v36h-24Z" fill="#497569" />
    <path d="M208 167v36m60-36v36" stroke="#2b574b" strokeWidth="2" />
    <path d="M193 204h34m26 0h36" stroke="#baae87" strokeWidth="5" />
    <path d="M197 218h80v14h-80Z" fill="#f3e5cb" />
    <path d="M214 304v-46a23 23 0 0 1 46 0v46Z" fill="#3f685a" />
    <path d="M239 242v61m-21-33h39" stroke="#315347" strokeWidth="2" />
    <circle cx="246" cy="279" r="2" fill="#d2a560" />
    <path d="m112 218 70-16 27 19v93l-97 23Z" fill="#f6e9ce" />
    <path d="m106 218 39-36 52 15 17 25-40-7Z" fill="#d78a66" />
    <path d="m145 182 53 15 16 25-40-7Z" fill="#b86a4f" />
    <path d="M130 248h38v53h-38Z" fill="#628171" />
    <path d="m127 246 46-7v8l-46 7Z" fill="#d2bd97" />
    <path d="m350 181 64-18 37 22v69l-101 14Z" fill="#f7e8c9" />
    <path d="m343 181 50-31 27 4 40 31-46-11Z" fill="#ce8060" />
    <path d="M382 224a11 11 0 0 1 22 0v36h-22Z" fill="#6a8271" />
    <path d="M424 197h15v19h-15Z" fill="#9aaf8c" />
    <path d="M288 130V57h38v92Z" fill="#eddcb7" />
    <path d="m326 57 16 11v92l-16-11Z" fill="#c6af8b" />
    <path d="M283 59V46h48v13Z" fill="#e6c99a" />
    <path d="M299 93V79a7 7 0 0 1 14 0v14Z" fill="#61735e" />
    <path d="M306 47V26m0 0 28 7-28 7" fill="#ce724f" stroke="#96704f" strokeWidth="2" />
    <path d="M110 341v-90" stroke="#836146" strokeWidth="9" />
    <path d="m110 299-30-26m31 9 28-30" stroke="#836146" strokeWidth="5" />
    <circle cx="108" cy="235" r="37" fill="#587c57" />
    <circle cx="82" cy="249" r="27" fill="#6d905e" />
    <circle cx="133" cy="250" r="27" fill="#3f7053" />
    {[
      [96, 218],
      [121, 234],
      [79, 249],
      [103, 260],
      [139, 251],
      [112, 242],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#e3a24e" />
    ))}
    <path
      d="M468 323v-69m0 33h-16v-31m16 18h17v-36"
      fill="none"
      stroke="#547b60"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path d="m452 320 32 0-7 24h-18Z" fill="#c67855" />
    <path d="M159 328h22l-4 19h-14Z" fill="#c77455" />
    <path
      d="M170 329v-22m0 12c-19-5-11-17 0-7m0 8c18-8 16-18 1-12"
      fill="#6e8b5d"
      stroke="#6e8b5d"
      strokeWidth="3"
    />
    <path
      d="M394 98q10-11 20 0m-8-8q8-7 16 0"
      stroke="#8d977c"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <g transform="translate(418 146) rotate(7)">
      <rect x="0" y="0" width="83" height="36" rx="10" fill="#fffaf0" />
      <text
        x="42"
        y="24"
        textAnchor="middle"
        fill="#476554"
        fontSize="17"
        fontFamily="Georgia"
        fontStyle="italic"
      >
        ¡Vamos!
      </text>
    </g>
    <path d="m530 308 5 7 8-9m-159 67 7-1" stroke="#ebd9b6" strokeWidth="2" fill="none" />
  </svg>
);
export const Stamp = () => (
  <div className="stamp" aria-hidden="true">
    <span>PASO A PASO</span>
    <svg viewBox="0 0 60 45">
      <path
        d="m5 35 16-27 13 27M12 24h17m7 11V10l-7 6m3 19h15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m7 41 42-3" stroke="currentColor" />
    </svg>
    <small>YOUR JOURNEY STARTS HERE</small>
  </div>
);
