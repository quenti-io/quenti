import { register } from "../prometheus";
import { adminRouter } from "./routers/admin";
import { autoSaveRouter } from "./routers/auto-save";
import { containerRouter } from "./routers/container";
import { discoverableRouter } from "./routers/discoverable";
import { foldersRouter } from "./routers/folders";
import { importRouter } from "./routers/import";
import { leaderboardRouter } from "./routers/leaderboard";
import { organizationsRouter } from "./routers/organizations";
import { profileRouter } from "./routers/profile";
import { recentRouter } from "./routers/recent";
import { shareResolverRouter } from "./routers/share-resolver";
import { studiableTermsRouter } from "./routers/studiable-terms";
import { studySetsRouter } from "./routers/study-sets";
import { termsRouter } from "./routers/terms";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

// Call register.metrics() to ensure the context is properly initialized on startup
void (async () => {
  await register.metrics();
})();

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
  leaderboard: leaderboardRouter,
  recent: recentRouter,
  autoSave: autoSaveRouter,
  import: importRouter,
  organizations: organizationsRouter,
  disoverable: discoverableRouter,
  shareResolver: shareResolverRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
