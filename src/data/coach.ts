import { z } from "zod";

const shortText = z.string().min(1).max(1200);
export const coachReviewSchema = z.object({
  summary: shortText,
  strengths: z.array(shortText).max(3),
  corrections: z
    .array(
      z.object({
        original: shortText,
        corrected: shortText,
        explanation: shortText,
      }),
    )
    .max(8),
  coverage: z
    .array(
      z.object({
        point: shortText,
        met: z.boolean().nullable(),
        feedback: shortText,
      }),
    )
    .max(10),
  improvedAnswer: z.string().min(1).max(8000),
  nextStep: shortText,
});

export type CoachReview = z.infer<typeof coachReviewSchema>;
