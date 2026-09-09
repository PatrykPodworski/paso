import { useEffect, useRef, useState } from "react";
import { coachReviewSchema } from "../data/coach";
import type { CoachReview } from "../data/coach";

const request = async (path: string, body: string | Blob, signal: AbortSignal) => {
  const response = await fetch(`/api/coach/${path}`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": typeof body === "string" ? "application/json" : body.type || "audio/webm",
      "X-Paso-Coach": "1",
    },
    body,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(
      result?.error ||
        "The local coach is unavailable. Run this app with pnpm dev or pnpm preview on your Mac, then try again.",
    );
  }
  return result;
};

export const useCoach = (questionId: string) => {
  const [review, setReview] = useState<CoachReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => active.current?.abort(), [questionId]);
  const reset = () => {
    active.current?.abort();
    setReview(null);
    setError("");
    setLoading(false);
  };
  const check = async (answer: string) => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setLoading(true);
    setError("");
    setReview(null);
    try {
      const result = await request(
        "review",
        JSON.stringify({ questionId, answer }),
        controller.signal,
      );
      const parsed = coachReviewSchema.safeParse(result.review);
      if (!parsed.success) {
        throw new Error("The coach returned an incomplete review. Please try again.");
      }
      if (!controller.signal.aborted) {
        setReview(parsed.data);
      }
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(
          failure instanceof Error
            ? failure.message
            : "The coach could not finish. Please try again.",
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };
  return { review, loading, error, check, reset };
};

export const useTranscription = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const active = useRef<AbortController | null>(null);
  const recording = useRef<Blob | null>(null);
  useEffect(() => () => active.current?.abort(), []);
  const clear = () => {
    active.current?.abort();
    recording.current = null;
    setText("");
    setLoading(false);
    setError("");
  };
  const transcribe = async (blob: Blob) => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    recording.current = blob;
    setLoading(true);
    setError("");
    try {
      const result = await request("transcribe", blob, controller.signal);
      if (typeof result.text !== "string") {
        throw new Error("The transcript could not be read. Please try again.");
      }
      if (!controller.signal.aborted) {
        setText(result.text);
      }
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(
          failure instanceof Error
            ? failure.message
            : "Transcription failed. You can type what you said below.",
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };
  return {
    text,
    setText,
    loading,
    error,
    clear,
    transcribe,
    retry: () => {
      if (recording.current) {
        void transcribe(recording.current);
      }
    },
  };
};
