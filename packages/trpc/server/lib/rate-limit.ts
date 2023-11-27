import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "@quenti/env/server";

import { TRPCError } from "@trpc/server";

export interface RateLimiterOptions {
  type?: RateLimitType;
  identifier: string;
}

export interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending: Promise<unknown>;
}

export enum RateLimitType {
  Core = "core",
  Fast = "fast",
  FanOut = "fanOut",
  Verify = "verify",
  Strict = "strict",
  Rare = "rare",
  Slowmode = "slowmode",
}

export const rateLimiter = () => {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return () =>
      ({
        success: true,
        limit: 10,
        remaining: 999,
        reset: 0,
      }) as RateLimitResponse;
  }

  const redis = Redis.fromEnv();
  const limiter: { [K in RateLimitType]: Ratelimit } = {
    core: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit",
      limiter: Ratelimit.fixedWindow(10, "60s"),
    }),
    fast: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit:fast",
      limiter: Ratelimit.fixedWindow(40, "2m"),
    }),
    fanOut: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit:fanOut",
      limiter: Ratelimit.fixedWindow(20, "1h"),
    }),
    verify: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit:verify",
      limiter: Ratelimit.fixedWindow(10, "1h"),
    }),
    rare: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit:rare",
      limiter: Ratelimit.fixedWindow(2, "1h"),
    }),
    strict: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit:strict",
      limiter: Ratelimit.fixedWindow(2, "1d"),
    }),
    slowmode: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit:slowmode",
      limiter: Ratelimit.fixedWindow(1, "1m"),
    }),
  };

  const doRatelimit = async ({
    type = RateLimitType.Core,
    identifier,
  }: RateLimiterOptions) => {
    return await limiter[type].limit(identifier);
  };

  return doRatelimit;
};

export const rateLimitOrThrow = async ({
  type = RateLimitType.Core,
  identifier,
}: RateLimiterOptions) => {
  const { remaining } = await rateLimiter()({ type, identifier });

  if (remaining < 0) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "too_many_requests",
    });
  }
};

export const rateLimitOrThrowMultiple = async ({
  type,
  identifiers,
}: Omit<RateLimiterOptions, "identifier"> & { identifiers: string[] }) => {
  const limiters = identifiers.map((identifier) =>
    rateLimitOrThrow({ type, identifier }),
  );

  const result = await Promise.allSettled(limiters);
  if (result.find((r) => r.status === "rejected")) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "too_many_requests",
    });
  }
};
