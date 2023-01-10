import { createTRPCRouter } from "./trpc";
import { studySetsRouter } from "./routers/studySets";
import { termsRouter } from "./routers/terms";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  studySets: studySetsRouter,
  terms: termsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
