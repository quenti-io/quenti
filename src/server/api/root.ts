import { createTRPCRouter } from "./trpc";
import { studySetsRouter } from "./routers/study-sets";
import { termsRouter } from "./routers/terms";
import { autoSaveRouter } from "./routers/auto-save";
import { experienceRouter } from "./routers/experience";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  studySets: studySetsRouter,
  terms: termsRouter,
  experience: experienceRouter,
  autoSave: autoSaveRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
