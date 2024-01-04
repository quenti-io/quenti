import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZSubmitSchema } from "./submit.schema";

type CollabRouterHandlerCache = {
  handlers: {
    submit?: typeof import("./submit.handler").submitHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: CollabRouterHandlerCache = {
  handlers: {},
  routerPath: "collab",
};

export const collabRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(ZSubmitSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "submit");
      return HANDLER_CACHE.handlers.submit!({ ctx, input });
    }),
});
