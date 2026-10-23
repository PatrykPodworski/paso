import { clientIp, FREE_SECONDS, give, json, take } from "./limits.js";
import { passcodeRefusal } from "./passcode.js";

// Reserves one paid call with the passcode, or with the address's free use of `scope`.
// `freeUsed` can refuse the free use before it is counted. Returns the refusal, or a
// refund for when the upstream call fails.
export const reserve = async (
  request: Request,
  passcode: string | undefined,
  scope: string,
  freeUsed: (request: Request) => boolean = () => false,
) => {
  const freeKey = `${scope}:free:${clientIp(request)}`;

  if (passcode !== undefined) {
    const refusal = await passcodeRefusal(request, passcode);

    if (refusal) {
      return { refusal };
    }
  } else if (freeUsed(request) || !(await take(freeKey, 1, FREE_SECONDS))) {
    return { refusal: json({ error: "free_used" }, 403) };
  }

  return {
    refund: async () => {
      if (passcode === undefined) {
        await give(freeKey, FREE_SECONDS);
      }
    },
  };
};
