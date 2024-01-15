/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
import type { Session } from "next-auth";
import type { AxiomAPIRequest } from "next-axiom";
import type { Counter } from "prom-client";
import superjson from "superjson";

import { getServerAuthSession } from "@quenti/auth";

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { env } from "@quenti/env/server";
import type { EnabledFeature } from "@quenti/lib/feature";
import { prisma } from "@quenti/prisma";

import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { register } from "./prometheus";

type CreateContextOptions = {
  req: AxiomAPIRequest;
  session: Session | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    req: opts.req,
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    req: req as AxiomAPIRequest,
    session,
  });
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

// Process batches every minute to avoid row locking issues, although slightly less accurate
const lastSeenUpdateInterval = 60 * 1000;
// store all users active for the session in memory, along with a timestamp
// ...approximately 31,038 active users would have to use the serverless function for the memory usage to increase by just 1 MB
const userMap = new Map<string, number>();

export const enforceBasicAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user)
    throw new TRPCError({ code: "UNAUTHORIZED" });
  if (ctx.session.user.banned)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You are banned." });

  const userLogger = ctx.req.log.with({
    user: ctx.session.user,
  });
  ctx.req.log = userLogger;

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
export const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user)
    throw new TRPCError({ code: "UNAUTHORIZED" });
  if (ctx.session.user.banned)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You are banned." });
  if (!ctx.session.user.username)
    throw new TRPCError({ code: "PRECONDITION_FAILED" });

  const userLogger = ctx.req.log.with({
    user: ctx.session.user,
  });
  ctx.req.log = userLogger;

  (register.getSingleMetric("authed_api_requests_total") as Counter).inc();

  const userId = ctx.session.user.id;
  const lastSeenAt = userMap.get(userId);

  const now = new Date();
  const ms = now.getTime();

  if ((lastSeenAt || 0) < ms - lastSeenUpdateInterval) {
    void (async () => {
      await prisma.$executeRaw`UPDATE User SET lastSeenAt = NOW() WHERE id = ${userId};`;
    })();
    userMap.set(userId, ms);
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const enforceEnabledFeatures = (features: EnabledFeature[]) =>
  enforceUserIsAuthed.unstable_pipe(({ ctx, next }) => {
    const flags = ctx.session.user.flags;
    if (!features.find((f) => (flags & (f as number)) == (f as number))) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next();
  });

export const onboardingProcedure = t.procedure.use(enforceBasicAuth);
/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const enforceUserIsTeacher = enforceUserIsAuthed.unstable_pipe(
  ({ ctx, next }) => {
    if (ctx.session.user.type !== "Teacher") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next();
  },
);

export const teacherProcedure = protectedProcedure.use(enforceUserIsTeacher);

export const enforceDevMode = t.middleware(({ next }) => {
  if (env.SERVER_NAME !== undefined) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

export const lockedProcedure = (features: EnabledFeature[]) =>
  protectedProcedure.use(enforceEnabledFeatures(features));

export const devProcedure = protectedProcedure.use(enforceDevMode);
