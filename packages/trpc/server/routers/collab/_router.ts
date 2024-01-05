import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZAddTermSchema } from "./add-term.schema";
import { ZEditTermSchema } from "./edit-term.schema";
import { ZGetSchema } from "./get.schema";
import { ZSubmitSchema } from "./submit.schema";

type CollabRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    submit?: typeof import("./submit.handler").submitHandler;
    addTerm?: typeof import("./add-term.handler").addTermHandler;
    editTerm?: typeof import("./edit-term.handler").editTermHandler;
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
  addTerm: protectedProcedure
    .input(ZAddTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "addTerm");
      return HANDLER_CACHE.handlers.addTerm!({ ctx, input });
    }),
  editTerm: protectedProcedure
    .input(ZEditTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "editTerm");
      return HANDLER_CACHE.handlers.editTerm!({ ctx, input });
    }),
});
