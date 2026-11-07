import { listeningClips } from "../src/data/mockListening.ts";

// Listening clips made by scripts/make-dialogue.mjs, one entry per speaker turn: [speaker, text].
// A clip has one speaker or more. `voices` gives each speaker a reference voice of the ai repo's
// audio/spanish. The turn texts joined with spaces must equal the question's audio text, which is
// the clip's lookup key. The mock exam's clips live with its listening tasks.
export const dialogues = [
  ...listeningClips,
  {
    id: "u7-a0",
    voices: { asker: "female", local: "male" },
    turns: [
      ["asker", "Perdona, ¿dónde está la estación?"],
      [
        "local",
        "Está cerca. Sigue todo recto y después gira a la derecha. La estación está al lado del supermercado. Son cinco minutos a pie.",
      ],
    ],
  },
  {
    id: "u8-a0",
    voices: { customer: "male", assistant: "female" },
    turns: [
      ["customer", "Buenos días. Busco una camisa azul, talla mediana. ¿Cuánto cuesta?"],
      ["assistant", "Cuesta veintidós euros."],
      ["customer", "Muy bien. Quiero dos, por favor. ¿Puedo pagar con tarjeta?"],
    ],
  },
];
