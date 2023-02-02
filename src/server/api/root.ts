import { autoSaveRouter } from "./routers/auto-save";
import { experienceRouter } from "./routers/experience";
import { studiableTermsRouter } from "./routers/studiable-terms";
import { studySetsRouter } from "./routers/study-sets";
import { termsRouter } from "./routers/terms";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  studySets: studySetsRouter,
  terms: termsRouter,
  experience: experienceRouter,
  studiableTerms: studiableTermsRouter,
  autoSave: autoSaveRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
