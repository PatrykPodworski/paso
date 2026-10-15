import { getCache, ipAddress } from "@vercel/functions";

// Vercel Runtime Cache: regional and ephemeral, so a count can reset when an entry is
// evicted. The get-then-set increment is not atomic. Both are acceptable for a cost cap
// on a hobby app; the OpenAI project budget is the hard backstop.
const cache = getCache({ namespace: "paso" });

export const DAY_SECONDS = 86_400;

export const today = () => new Date().toISOString().slice(0, 10);

export const clientIp = (request: Request) => ipAddress(request) ?? "unknown";

export const used = async (key: string) => Number(await cache.get(key)) || 0;

export const count = async (key: string, ttl: number) =>
  cache.set(key, (await used(key)) + 1, { ttl });

export const json = (body: object, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers });
