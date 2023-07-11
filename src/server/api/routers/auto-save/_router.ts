import { loadHandler } from "../../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZSaveSchema } from "./save.schema";

type AutoSaveRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    save?: typeof import("./save.handler").saveHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: AutoSaveRouterHandlerCache = {
  handlers: {},
  routerPath: "auto-save",
};

export const autoSaveRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    await loadHandler<AutoSaveRouterHandlerCache>(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers["get"]!({ ctx });
  }),
  save: protectedProcedure
    .input(ZSaveSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler<AutoSaveRouterHandlerCache>(HANDLER_CACHE, "save");
      return HANDLER_CACHE.handlers["save"]!({ ctx, input });
    }),
});
