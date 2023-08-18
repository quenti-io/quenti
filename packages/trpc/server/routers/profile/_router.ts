import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZGetSchema } from "./get.schema";

type ProfileRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: ProfileRouterHandlerCache = {
  handlers: {},
  routerPath: "profile",
};

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.input(ZGetSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers.get!({ ctx, input });
  }),
});
