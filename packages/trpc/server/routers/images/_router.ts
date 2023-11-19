import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZSearchSchema } from "./search.schema";

type ImagesRouterHandlerCache = {
  handlers: {
    search?: typeof import("./search.handler").searchHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: ImagesRouterHandlerCache = {
  handlers: {},
  routerPath: "images",
};

export const imagesRouter = createTRPCRouter({
  search: protectedProcedure
    .input(ZSearchSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "search");
      return HANDLER_CACHE.handlers.search!({ ctx, input });
    }),
});
