import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZGetSchema } from "./get.schema";
import { ZSubmitSchema } from "./submit.schema";

type CollabRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    submit?: typeof import("./submit.handler").submitHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: CollabRouterHandlerCache = {
  handlers: {},
  routerPath: "collab",
};

export const collabRouter = createTRPCRouter({
  get: protectedProcedure.input(ZGetSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers.get!({ ctx, input });
  }),
  submit: protectedProcedure
    .input(ZSubmitSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "submit");
      return HANDLER_CACHE.handlers.submit!({ ctx, input });
    }),
});
