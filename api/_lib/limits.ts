import { getCache, ipAddress } from "@vercel/functions";

// Vercel Runtime Cache: regional and ephemeral, so a count can reset when an entry is
// evicted, and two instances can race on the same key. Within one instance, updates to
// a key run one at a time. That is enough for the free talk and the passcode tries;
// the spend limit on the OpenAI key caps the cost.
const cache = getCache({ namespace: "paso" });
const queues = new Map<string, Promise<unknown>>();

const oneAtATime = <T>(key: string, update: () => Promise<T>) => {
  const run = (queues.get(key) ?? Promise.resolve()).then(update);

  const tail = run.then(
    () => {},
    () => {},
  );

  queues.set(key, tail);
  void tail.then(() => queues.get(key) === tail && queues.delete(key));

  return run;
};

export const DAY_SECONDS = 86_400;

// How long an address keeps its free use of a paid endpoint.
export const FREE_SECONDS = 30 * DAY_SECONDS;

export const today = () => new Date().toISOString().slice(0, 10);

export const clientIp = (request: Request) => ipAddress(request) ?? "unknown";

const used = async (key: string) => Number(await cache.get(key)) || 0;

// Reserves one use of a key; false when the limit is already reached.
export const take = (key: string, limit: number, ttl: number) =>
  oneAtATime(key, async () => {
    const count = await used(key);

    if (count >= limit) {
      return false;
    }

    await cache.set(key, count + 1, { ttl });

    return true;
  });

// Gives back a use reserved with take.
export const give = (key: string, ttl: number) =>
  oneAtATime(key, async () => cache.set(key, Math.max(0, (await used(key)) - 1), { ttl }));

export const json = (body: object, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers });
