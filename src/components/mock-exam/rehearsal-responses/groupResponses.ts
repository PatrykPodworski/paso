import { mockExam, mockQuestions } from "../../../data/mock";
import type { MockResponse, MockResponses, Question } from "../../../data/types";

const QUESTIONS = new Map(mockQuestions.map((q) => [q.id, q]));

export type ResponseEntry = { response: MockResponse; question: Question };
type ResponseGroup = { title: string; entries: ResponseEntry[] };

// The responses by exam section, each with its question. A response to a question the exam
// data no longer has is lost: only its saved text can be shown.
export const responseGroups = ({ items }: MockResponses) => ({
  groups: mockExam
    .map(
      (s, section): ResponseGroup => ({
        title: s.title,
        entries: items.flatMap((response) => {
          const question = QUESTIONS.get(response.questionId);

          return response.section === section && question ? [{ response, question }] : [];
        }),
      }),
    )
    .filter((group) => group.entries.length > 0),
  lost: items.filter((response) => !QUESTIONS.has(response.questionId)),
});

// The learner's own text in a response, or what stands in for it.
export const savedText = (response: MockResponse) => {
  if (response.section === 0 || response.section === 1) {
    return response.answer || "No answer";
  }

  if (response.section === 2) {
    return response.text.trim() ? response.text : "Nothing submitted";
  }

  return response.status === "scored" ? response.transcript : "No scored talk";
};
