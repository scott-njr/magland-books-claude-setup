import { headers } from 'next/headers';

const DEFAULT_MAX_REQUESTS = 5;
const DEFAULT_WINDOW_SECONDS = 60;

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

// In-memory bucket: action+ip → list of millisecond timestamps inside the window.
// Fine for a single-region, single-process Vercel deployment — swap in Upstash
// (or a similar shared store) if we ever scale to multi-region.
const buckets = new Map<string, number[]>();

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return headersList.get('x-real-ip') ?? 'unknown';
}

function pruneOldEntries(timestamps: number[], cutoff: number): number[] {
  let firstValidIndex = 0;
  while (firstValidIndex < timestamps.length) {
    const ts = timestamps[firstValidIndex];
    if (ts !== undefined && ts >= cutoff) break;
    firstValidIndex++;
  }
  return firstValidIndex === 0 ? timestamps : timestamps.slice(firstValidIndex);
}

export async function checkRateLimit(
  action: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowSeconds: number = DEFAULT_WINDOW_SECONDS,
): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const key = `${action}:${ip}`;

  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;

  const existing = buckets.get(key) ?? [];
  const recent = pruneOldEntries(existing, cutoff);

  if (recent.length >= maxRequests) {
    buckets.set(key, recent);
    return { allowed: false, remaining: 0 };
  }

  recent.push(now);
  buckets.set(key, recent);

  if (buckets.size > 10000) {
    sweepStaleBuckets(cutoff);
  }

  return { allowed: true, remaining: maxRequests - recent.length };
}

function sweepStaleBuckets(cutoff: number): void {
  for (const [key, timestamps] of buckets.entries()) {
    const last = timestamps[timestamps.length - 1];
    if (last === undefined || last < cutoff) {
      buckets.delete(key);
    }
  }
}
