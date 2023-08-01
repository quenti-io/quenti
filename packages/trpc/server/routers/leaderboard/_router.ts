import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZAddSchema } from "./add.schema";
import { ZByEntityIdSchema } from "./by-entity-id.schema";
import { ZHighscoreSchema } from "./highscore.schema";

type LeaderboardRouterHandlerCache = {
  handlers: {
    ["by-entity-id"]?: typeof import("./by-entity-id.handler").byEntityIdHandler;
    highscore?: typeof import("./highscore.handler").highscoreHandler;
    add?: typeof import("./add.handler").addHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: LeaderboardRouterHandlerCache = {
  handlers: {},
  routerPath: "leaderboard",
};

export const leaderboardRouter = createTRPCRouter({
  byEntityId: protectedProcedure
    .input(ZByEntityIdSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "by-entity-id");
      return HANDLER_CACHE.handlers["by-entity-id"]!({ ctx, input });
    }),
  highscore: protectedProcedure
    .input(ZHighscoreSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "highscore");
      return HANDLER_CACHE.handlers.highscore!({ ctx, input });
    }),
  add: protectedProcedure.input(ZAddSchema).mutation(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "add");
    return HANDLER_CACHE.handlers.add!({ ctx, input });
  }),
});
