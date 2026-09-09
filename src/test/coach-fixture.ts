import type { CoachReview } from "../data/coach";
export const review: CoachReview = {
  summary: "Your introduction is clear.",
  strengths: ["You gave your name."],
  corrections: [
    {
      original: "Soy veinte años",
      corrected: "Tengo veinte años",
      explanation: "Use tener for age.",
    },
  ],
  coverage: [
    { point: "Introduce yourself", met: true, feedback: "You gave your name." },
    { point: "Say where you live", met: false, feedback: "Add your city." },
    { point: "Speak clearly", met: null, feedback: "Replay your recording to check." },
  ],
  improvedAnswer: "Me llamo Ana. Tengo veinte años.",
  nextStep: "Practise tengo for age.",
};
