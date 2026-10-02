import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import { mount, seed, setupMockExam } from "../../test/mockExam";
import { Blob as NodeBlob } from "node:buffer";

setupMockExam();

it("exports objective scores with all responses and revokes the temporary URL", async () => {
  vi.stubGlobal("Blob", NodeBlob);
  const create = vi.fn((_blob: Blob) => "blob:exam");

  vi.stubGlobal(
    "URL",
    Object.assign(class extends URL {}, { createObjectURL: create, revokeObjectURL: vi.fn() }),
  );

  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  const question = mockSections[0].questions[0];

  seed({ section: 3, stage: "done", answers: { [question.id]: question.answer } });
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Export responses for review" }));
  expect(create.mock.calls[0][0].type).toBe("application/json");
  const exported = JSON.parse(await create.mock.calls[0][0].text());

  expect(exported).toMatchObject({
    reading: 1,
    listening: 0,
    writing: "Requires human assessment",
    speaking: "Requires human assessment",
  });

  expect(exported.responses).toHaveLength(55);

  expect(exported.responses[0]).toMatchObject({
    response: question.answer,
    prompt: question.prompt,
    model: question.answer,
    explanation: question.explanation,
    task: question.task,
    skill: "Reading",
  });

  expect(exported.responses.slice(1).every((r: { response: string }) => r.response === "")).toBe(
    true,
  );

  expect((click.mock.instances[0] as HTMLAnchorElement).download).toBe("paso-exam-responses.json");
  expect(click).toHaveBeenCalledOnce();
  act(() => vi.advanceTimersByTime(1000));
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:exam");
});
