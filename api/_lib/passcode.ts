import { createHash, timingSafeEqual } from "node:crypto";
import { clientIp, DAY_SECONDS, give, json, take, today } from "./limits.js";

export const PASSCODE_TRIES = 10;

const digest = (text: string) => createHash("sha256").update(text).digest();

const passcodeMatches = (given: string) => {
  const expected = process.env.PASSCODE;

  return !!expected && timingSafeEqual(digest(given), digest(expected));
};

// Wrong guesses from one address count against one daily limit for every endpoint.
// Returns the refusal, or null when the passcode matches.
export const passcodeRefusal = async (request: Request, passcode: string) => {
  const triesKey = `passcode:tries:${clientIp(request)}:${today()}`;

  if (!(await take(triesKey, PASSCODE_TRIES, DAY_SECONDS))) {
    return json({ error: "passcode_tries" }, 429);
  }

  if (!passcodeMatches(passcode)) {
    return json({ error: "passcode" }, 401);
  }

  await give(triesKey, DAY_SECONDS);

  return null;
};
