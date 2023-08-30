import { adminRouter } from "./routers/admin/_router";
import { autoSaveRouter } from "./routers/auto-save/_router";
import { classesRouter } from "./routers/classes/_router";
import { containerRouter } from "./routers/container/_router";
import { cortexRouter } from "./routers/cortex/_router";
import { devRouter } from "./routers/dev";
import { discoverableRouter } from "./routers/discoverable";
import { foldersRouter } from "./routers/folders/_router";
import { importRouter } from "./routers/import/_router";
import { leaderboardRouter } from "./routers/leaderboard/_router";
import { organizationsRouter } from "./routers/organizations/_router";
import { profileRouter } from "./routers/profile/_router";
import { recentRouter } from "./routers/recent";
import { shareResolverRouter } from "./routers/share-resolver";
import { studiableTermsRouter } from "./routers/studiable-terms";
import { studySetsRouter } from "./routers/study-sets/_router";
import { termsRouter } from "./routers/terms/_router";
import { userRouter } from "./routers/user/_router";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  profile: profileRouter,
  admin: adminRouter,
  studySets: studySetsRouter,
  folders: foldersRouter,
  terms: termsRouter,
  container: containerRouter,
  studiableTerms: studiableTermsRouter,
  cortex: cortexRouter,
  leaderboard: leaderboardRouter,
  recent: recentRouter,
  autoSave: autoSaveRouter,
  import: importRouter,
  classes: classesRouter,
  organizations: organizationsRouter,
  disoverable: discoverableRouter,
  shareResolver: shareResolverRouter,
  dev: devRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
