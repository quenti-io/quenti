import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { ZGetPublicSchema } from "./get-public.schema";
import { ZGetSchema } from "./get.schema";

type ProfileRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    ["get-public"]?: typeof import("./get-public.handler").getPublicHandler;
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
  getPublic: publicProcedure
    .input(ZGetPublicSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-public");
      return HANDLER_CACHE.handlers["get-public"]!({ ctx, input });
    }),
});
